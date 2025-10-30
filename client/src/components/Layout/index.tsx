"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();

    const isPublicRoute =
        pathname === "/login" || pathname === "/signup" || pathname === "/";

    return (
        <div className="flex flex-col min-h-screen md:h-screen bg-[#4d3859] md:overflow-hidden">
            {!isPublicRoute && <Navbar />}
            <main className="flex-grow md:flex md:flex-col md:min-h-0">{children}</main>
        </div>
    );
}