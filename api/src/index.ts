import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes"; // Importe as rotas de usuário

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Use as rotas de usuário com o prefixo /users
app.use("/users", userRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.send("A API do Audiomante está no ar! 🎉");
});

app.listen(port, () => {
    console.log(`🚀 Servidor da API rodando em http://localhost:${port}`);
});
