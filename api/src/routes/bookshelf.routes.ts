// api/src/routes/bookshelf.routes.ts
import { Router, Request } from "express";
import prisma from "../prisma";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// Rota: POST /bookshelves
// Adiciona um livro a uma estante para o usuário logado
router.post("/", authMiddleware, async (req: Request, res) => {
    try {
        const userId = req.userId!;
        const { googleId, title, author, coverUrl, description, status } =
            req.body;

        // Validação básica dos dados do livro
        if (!googleId || !title || !author || !status) {
            return res
                .status(400)
                .json({ error: "Dados incompletos para adicionar o livro." });
        }

        const book = await prisma.book.upsert({
            where: { googleId },
            update: {},
            create: {
                googleId,
                title,
                author,
                coverUrl,
                description,
            },
        });

        // Agora que temos o livro (existente ou novo), criamos a entrada na estante
        const newBookshelfEntry = await prisma.bookshelf.create({
            data: {
                status,
                userId: userId,
                bookId: book.id,
            },
        });

        res.status(201).json(newBookshelfEntry);
    } catch (error: any) {
        // Trata o erro caso o usuário tente adicionar o mesmo livro duas vezes
        if (error.code === "P2002") {
            return res
                .status(409)
                .json({ error: "Este livro já está na sua estante." });
        }
        console.error(error);
        res.status(500).json({
            error: "Ocorreu um erro ao adicionar o livro à estante.",
        });
    }
});

export default router;
