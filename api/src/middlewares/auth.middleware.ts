import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. Pega o cabeçalho de autorização
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Token não fornecido ou mal formatado." });
    }

    // 2. Extrai o token (formato "Bearer TOKEN...")
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verifica se o token é válido usando nosso segredo
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };

        // 4. Se for válido, anexa o ID do usuário na requisição para ser usado nas próximas etapas
        req.userId = decoded.userId;

        // 5. Permite que a requisição continue
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};

export default authMiddleware;
