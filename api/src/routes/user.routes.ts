import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';

const router = Router();

// Rota: POST /users/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validação básica
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
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
    if (error.code === 'P2002') {
      return res.status(409).json({ error: `O ${error.meta.target} já está em uso.` });
    }

    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o usuário.' });
  }
});

export default router;