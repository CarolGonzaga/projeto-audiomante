"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();

    // Ocultar Navbar nas páginas públicas
    const isPublicRoute =
        pathname === "/login" || pathname === "/signup" || pathname === "/";

    return (
        <div className="min-h-screen flex flex-col bg-[#4d3859]">
            {!isPublicRoute && <Navbar />}
            <main className="flex-grow">{children}</main>
        </div>
    );
}
