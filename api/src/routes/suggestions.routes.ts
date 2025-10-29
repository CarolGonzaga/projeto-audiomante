import { Router, Request } from "express";
import axios from "axios";

const router = Router();

// Lista fixa de Google Books IDs para sugestões
const suggestionBookIds = [
    "q71zEAAAQBAJ", // Sorte no Amor
    "-omanQEACAAJ", // A Breve Vida das Flores (Substituto)
    "M_TZEAAAQBAJ", // Murdle 1
    "KjnNEAAAQBAJ", // Férias de Matar
    "j17iEAAAQBAJ", // Casas Estranhas
    "96TNEAAAQBAJ", // O Manifesto do Cuidado (Substituto)
    "vM3AEAAAQBAJ", // Como Não Se Apaixonar
    "oFhNEAAAQBAJ", // A Noite Passada no Telegraph Club
    "Prc0AgAAQBAJ", // Dias Perfeitos
    "QzEtDwAAQBAJ", // Na Ponta dos Dedos
    "o7aZDwAAQBAJ", // É Assim Que Se Perde a Guerra do Tempo
    "2x0xEAAAQBAJ", // O Amor Não É Óbvio
];

interface GoogleApiBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: { thumbnail?: string };
        pageCount?: number;
    };
}

// Função auxiliar para buscar detalhes de um livro pelo ID
const fetchBookById = async (googleId: string): Promise<any | null> => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes/${googleId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
        );
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar livro com ID ${googleId}:`, error);
        return null; // Retorna null se falhar
    }
};


router.get("/", async (req: Request, res) => {
    try {
        // Busca os detalhes de todos os livros da lista em paralelo
        const bookPromises = suggestionBookIds.map(fetchBookById);
        const bookResults = await Promise.all(bookPromises);

        // Filtra resultados nulos e formata os dados
        const formattedBooks = bookResults
            .filter((item): item is GoogleApiBook => item !== null) // Garante que item não é nulo e tipa corretamente
            .map((item) => ({
                googleId: item.id,
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Autor desconhecido",
                coverUrl: item.volumeInfo.imageLinks?.thumbnail || null,
                description: item.volumeInfo.description || null,
                pageCount: item.volumeInfo.pageCount || null,
            }));

        res.status(200).json(formattedBooks);

    } catch (error) {
        console.error("Erro ao buscar sugestões de livros:", error);
        res.status(500).json({ error: "Erro ao buscar sugestões." });
    }
});

export default router;