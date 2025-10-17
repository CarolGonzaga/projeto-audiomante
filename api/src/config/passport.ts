// /api/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../prisma";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Tenta encontrar um usuário com o email do Google
                let user = await prisma.user.findUnique({
                    where: { email: profile.emails![0].value },
                });

                if (!user) {
                    // Se não encontrar, cria um novo usuário
                    user = await prisma.user.create({
                        data: {
                            email: profile.emails![0].value,
                            username: profile.displayName.replace(/\s/g, ""), // Remove espaços do nome
                            password: "", // Não precisa de senha para login social
                        },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
