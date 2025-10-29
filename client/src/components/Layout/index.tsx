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
        <div className="flex flex-col flex-grow min-h-screen bg-[#4d3859] overflow-hidden">
            {!isPublicRoute && <Navbar />}
            <main className="flex-grow">{children}</main>
        </div>
    );
}
