import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import bookshelfRoutes from "./routes/bookshelf.routes";
import searchRoutes from "./routes/search.routes";
import "./config/passport";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas de Usuário
app.use("/users", userRoutes);

// Rotas de Estante de Livros
app.use("/bookshelves", bookshelfRoutes);

app.use("/search", searchRoutes);

app.use("/auth", authRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.send("A API do Audiomante está no ar! 🎉");
});

app.listen(port, () => {
    console.log(`🚀 Servidor da API rodando em http://localhost:${port}`);
});
