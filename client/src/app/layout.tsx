import type { Metadata } from "next";
import { Inter, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cinzel = Cinzel_Decorative({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
});

export const metadata: Metadata = {
  title: "Audiomante",
  description: "Sua plataforma de livros sáficos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-sans`}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}