// api/src/routes/bookshelf.routes.ts
import { Router, Request } from "express";
import prisma from "../prisma";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// Rota: POST /bookshelves
router.post("/", authMiddleware, async (req: Request, res) => {
    try {
        const userId = req.userId!;
        const {
            googleId,
            title,
            author,
            coverUrl,
            description,
            status,
            pageCount,
        } = req.body;

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
                pageCount: pageCount ?? 0,
            },
        });

        const newBookshelfEntry = await prisma.bookshelf.create({
            data: {
                status,
                userId: userId,
                bookId: book.id,
            },
        });

        res.status(201).json(newBookshelfEntry);
    } catch (error: any) {
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

// Rota: GET /bookshelves
router.get("/", authMiddleware, async (req: Request, res) => {
    try {
        const userId = req.userId!;

        const bookshelf = await prisma.bookshelf.findMany({
            where: { userId },
            include: {
                book: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        res.status(200).json(bookshelf);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocorreu um erro ao buscar a estante." });
    }
});

// Rota: PATCH /bookshelves/:id
router.patch("/:id", authMiddleware, async (req: Request, res) => {
    try {
        const userId = req.userId!;
        const bookshelfEntryId = req.params.id;
        const { status, rating, review } = req.body;

        const updatedEntry = await prisma.bookshelf.updateMany({
            where: {
                id: bookshelfEntryId,
                userId: userId,
            },
            data: {
                status,
                rating,
                review,
            },
        });

        if (updatedEntry.count === 0) {
            return res.status(404).json({
                error: "Entrada da estante não encontrada ou não pertence ao usuário.",
            });
        }

        res.status(200).json({ message: "Estante atualizada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Ocorreu um erro ao atualizar a estante.",
        });
    }
});

// Rota: GET /bookshelves/:id
router.get("/:id", authMiddleware, async (req: Request, res) => {
    try {
        const userId = req.userId!;
        const bookshelfEntryId = req.params.id;

        const entry = await prisma.bookshelf.findFirst({
            where: {
                id: bookshelfEntryId,
                userId: userId, // Garante que o usuário só pode ver seus próprios itens
            },
            include: {
                book: true, // Inclui os detalhes do livro
            },
        });

        if (!entry) {
            return res
                .status(404)
                .json({ error: "Entrada da estante não encontrada." });
        }

        res.status(200).json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Ocorreu um erro ao buscar o item da estante.",
        });
    }
});

// Rota: DELETE /bookshelves/:id
router.delete("/:id", authMiddleware, async (req: Request, res) => {
    try {
        const userId = req.userId!;
        const bookshelfEntryId = req.params.id;

        const deleteResult = await prisma.bookshelf.deleteMany({
            where: {
                id: bookshelfEntryId,
                userId: userId, // Garante que o usuário só pode deletar seus próprios itens
            },
        });

        if (deleteResult.count === 0) {
            return res.status(404).json({
                error: "Entrada da estante não encontrada ou não pertence ao usuário.",
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Ocorreu um erro ao remover o livro da estante.",
        });
    }
});

export default router;
