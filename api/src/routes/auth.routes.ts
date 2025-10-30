// /api/src/routes/auth.routes.ts
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const user: any = req.user;
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        // Define a URL do cliente a partir de uma variável de ambiente
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

        // Redireciona para a URL correta
        res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    }
);

export default router;
