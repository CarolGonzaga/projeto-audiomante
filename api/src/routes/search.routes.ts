import { Router, Request } from "express";
import axios from "axios";

const router = Router();

router.get("/", async (req: Request, res) => {
    const { q } = req.query;

    if (!q) {
        return res
            .status(400)
            .json({ error: "O termo de busca (q) é obrigatório." });
    }

    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erro ao buscar livros na Google API:", error);
        res.status(500).json({
            error: "Erro ao se comunicar com a Google Books API.",
        });
    }
});

export default router;
