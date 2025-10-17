// client/src/components/Layout/index.tsx
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#2A233C] text-white">
            <Navbar />
            <main className="container mx-auto p-8">
                {children}
            </main>
        </div>
    );
}