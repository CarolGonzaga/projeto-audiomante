// /api/src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import bookshelfRoutes from "./routes/bookshelf.routes";
import searchRoutes from "./routes/search.routes";
import authRoutes from "./routes/auth.routes";
import suggestionsRoutes from "./routes/suggestions.routes";
import "./config/passport";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/bookshelves", bookshelfRoutes);
app.use("/search", searchRoutes);
app.use("/auth", authRoutes);
app.use("/suggestions", suggestionsRoutes); // <-- 2. Usar a rota

app.get("/", (req, res) => {
    /* ... */
});
app.listen(port, () => {
    /* ... */
});
