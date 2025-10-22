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
                const user = await prisma.user.upsert({
                    where: {
                        email: profile.emails![0].value,
                    },
                    update: {},
                    create: {
                        email: profile.emails![0].value,
                        username:
                            profile.displayName
                                .replace(/\s/g, "")
                                .toLowerCase() +
                            Math.floor(Math.random() * 1000),
                        password: "",
                    },
                });

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
