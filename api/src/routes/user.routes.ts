import { Router } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Rota: POST /users/signup
router.post("/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validação básica
        if (!email || !username || !password) {
            return res
                .status(400)
                .json({ error: "Todos os campos são obrigatórios." });
        }

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        // Remove a senha do objeto antes de enviar a resposta
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json(userWithoutPassword);
    } catch (error: any) {
        // Trata o erro caso o e-mail ou username já exista
        if (error.code === "P2002") {
            return res
                .status(409)
                .json({ error: `O ${error.meta.target} já está em uso.` });
        }

        console.error(error);
        res.status(500).json({ error: "Ocorreu um erro ao criar o usuário." });
    }
});

// Rota: POST /users/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Encontra o usuário pelo e-mail
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // 2. Compara a senha enviada com a senha criptografada no banco
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Senha incorreta." });
        }

        // 3. Gera o Token JWT se a senha estiver correta
        const token = jwt.sign(
            { userId: user.id }, // Informação que queremos guardar no token
            process.env.JWT_SECRET!, // Nosso segredo para assinar o token
            { expiresIn: "7d" } // O token expira em 7 dias
        );

        // 4. Envia o token de volta para o cliente
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocorreu um erro ao fazer login." });
    }
});

export default router;
