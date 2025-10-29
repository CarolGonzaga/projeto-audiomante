import { Router, Request } from "express";
import axios from "axios";

const router = Router();

const suggestionBookIds = [
    "cQxIEQAAQBAJ", // 1. Sorte no Amor - Lynn Painter
    "fDxUEQAAQBAJ", // 2. Querida Tia - Valérie Perrin
    "TJOFEAAAQBAJ", // 3. Murdle: Caderno de Casos Confidenciais, Vol. 2 - G. T. Karber
    "XjxUEQAAQBAJ", // 4. Férias de Matar - Tessa Bailey
    "J99MEQAAQBAJ", // 5. Casas Estranhas - Uketsu
    "MXCAEAAAQBAJ", // 6. Delilah Green não está nem aí - Ashley Herring Blake
    "dGSOEAAAQBAJ", // 7. A Noite Passada no Telegraph Club - Malinda Lo
    "BiaoBAAAQBAJ", // 8. Dias Perfeitos - Raphael Montes
    "pFu9EAAAQBAJ", // 9. A Empregada - Freida McFadden
    "F0BIEAAAQBAJ", // 10. O Primeiro Beijo de Romeu - Felipe B. D'Elia
    "p84OEAAAQBAJ", // 11. É Assim Que Se Perde a Guerra do Tempo - Max Gladstone & Amal El-Mohtar
    "3qI8EQAAQBAJ", // 12. O Amor Não É Óbvio: Edição Especial - Elayne Baeta
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
const fetchBookById = async (googleId: string): Promise<any | null> => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes/${googleId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
        );
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar livro com ID ${googleId}:`, error); // Mantém o log de erro caso algum ID falhe no futuro
        return null;
    }
};

router.get("/", async (req: Request, res) => {
    try {
        const bookPromises = suggestionBookIds.map(fetchBookById);
        const bookResults = await Promise.all(bookPromises);

        // Filtra resultados nulos (caso algum ID falhe) e formata
        const formattedBooks = bookResults
            .filter((item): item is GoogleApiBook => item !== null)
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
