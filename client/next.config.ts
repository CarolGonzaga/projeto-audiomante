import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "exemplo.com",
            },
            {
                // ADICIONE ESTE BLOCO
                protocol: "http",
                hostname: "books.google.com",
            },
        ],
    },
};

export default nextConfig;
