import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import bookshelfRoutes from "./routes/bookshelf.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Rotas de Usuário
app.use("/users", userRoutes);

// Rotas de Estante de Livros
app.use("/bookshelves", bookshelfRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.send("A API do Audiomante está no ar! 🎉");
});

app.listen(port, () => {
    console.log(`🚀 Servidor da API rodando em http://localhost:${port}`);
});
