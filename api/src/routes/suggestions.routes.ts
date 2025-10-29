import { Router, Request } from "express";
import axios from "axios";

const router = Router();

// Lista fixa de Google Books IDs para sugestões
const suggestionBookIds = [
    "q71zEAAAQBAJ", // 1. Sorte no Amor - Lynn Painter
    "fDxUEQAAQBAJ", // 2. Querida Tia - Valérie Perrin
    "M_TZEAAAQBAJ", // 3. Murdle 1 - G. T. Karber
    "KjnNEAAAQBAJ", // 4. Férias de Matar - Tessa Bailey
    "j17iEAAAQBAJ", // 5. Casas Estranhas - Uketsu
    "0cTYEAAAQBAJ", // 6. Delilah Green Não Quer Saber - Ashley Herring Blake
    "vM3AEAAAQBAJ", // 7. Como Não Se Apaixonar - D. Barreto
    "oFhNEAAAQBAJ", // 8. A Noite Passada no Telegraph Club - Malinda Lo
    "Prc0AgAAQBAJ", // 9. Dias Perfeitos - Raphael Montes
    "QzEtDwAAQBAJ", // 10. Na Ponta dos Dedos - Sarah Waters
    "o7aZDwAAQBAJ", // 11. É Assim Que Se Perde a Guerra do Tempo - Max Gladstone & Amal El-Mohtar
    "2x0xEAAAQBAJ", // 12. O Amor Não É Óbvio - Elayne Baeta
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
                author: item.volumeInfo.authors
                    ? item.volumeInfo.authors.join(", ")
                    : "Autor desconhecido",
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
