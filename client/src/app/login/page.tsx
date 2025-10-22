"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthPage() {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberEmail");
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setRemember(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const endpoint =
                tab === "login"
                    ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
                    : `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;

            const response = await axios.post(endpoint, formData);
            const token = response.data?.token;

            if (token) {
                await login(token);
                if (remember) {
                    localStorage.setItem("rememberEmail", formData.email);
                } else {
                    localStorage.removeItem("rememberEmail");
                }
            } else {
                setError("Erro ao autenticar. Token não retornado.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Erro ao conectar com o servidor.");
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };


    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative min-h-screen flex flex-col bg-[#4d3859] overflow-hidden">
            {/* Fundo com imagem translúcida */}
            <div className="absolute inset-0">
                <Image
                    src="/background.png"
                    alt="Background"
                    fill
                    className="object-cover w-full h-full opacity-60"
                    priority
                />
            </div>

            {/* Camada escura translúcida */}
            <div className="absolute inset-0 bg-[#4d3859]/70" />

            {/* Logo no topo */}
            <div className="flex justify-start items-center pl-10 pt-6">
                <Image
                    src="/audiomante.png"
                    alt="Audiomante"
                    width={180}
                    height={60}
                    className="drop-shadow-lg"
                />
            </div>

            {/* Card principal */}
            <div className="relative z-10 w-[95%] max-w-md bg-[#fffaf7]/90 shadow-2xl rounded-2xl p-8 border border-[#e3d5ca]/60 mt-6">
                {/* Tabs */}
                <div className="flex mb-6 rounded-full bg-[#f4eae3]/80 overflow-hidden">
                    <button
                        onClick={() => setTab("login")}
                        className={`flex-1 py-2 text-center font-semibold transition-all ${tab === "login"
                            ? "bg-[#4d3859] text-white"
                            : "text-[#4d3859] hover:bg-[#decbe8]/60"
                            }`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setTab("signup")}
                        className={`flex-1 py-2 text-center font-semibold transition-all ${tab === "signup"
                            ? "bg-[#4d3859] text-white"
                            : "text-[#4d3859] hover:bg-[#decbe8]/60"
                            }`}
                    >
                        Cadastrar
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {tab === "signup" && (
                        <div>
                            <label className="block text-sm font-medium text-[#4d3859] mb-1">
                                Usuário
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-[#c8b6d9]/50 focus:outline-none focus:ring-2 focus:ring-[#4d3859]/50 bg-white/70"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#4d3859] mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-[#c8b6d9]/50 focus:outline-none focus:ring-2 focus:ring-[#4d3859]/50 bg-white/70"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-[#4d3859] mb-1">Senha</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 pr-10 rounded-lg border border-[#c8b6d9]/50 focus:outline-none focus:ring-2 focus:ring-[#4d3859]/50 bg-white/70"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-8 text-[#4d3859]/70 hover:text-[#4d3859]"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>


                    {tab === "login" && (
                        <div className="flex items-center justify-between text-sm text-[#4d3859]/80">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={() => setRemember(!remember)}
                                    className="accent-[#4d3859] w-4 h-4"
                                />
                                Lembrar de mim
                            </label>
                            <button
                                type="button"
                                className="hover:underline hover:text-[#4d3859]"
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-600 text-sm text-center mt-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 mt-2 font-semibold rounded-lg shadow-md transition ${loading
                            ? "bg-[#4d3859]/60 text-white cursor-not-allowed"
                            : "bg-[#4d3859] hover:bg-[#3c2b46] text-white"
                            }`}
                    >
                        {loading
                            ? "Carregando..."
                            : tab === "login"
                                ? "Entrar"
                                : "Cadastrar"}
                    </button>
                </form>

                {/* Divisor */}
                <div className="flex items-center my-5">
                    <div className="flex-1 h-px bg-[#d1c0d8]" />
                    <span className="mx-2 text-sm text-[#4d3859]/80">
                        ou {tab === "login" ? "acesse" : "cadastre-se"} com
                    </span>
                    <div className="flex-1 h-px bg-[#d1c0d8]" />
                </div>

                {/* Login com Google */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-2 border border-[#c8b6d9]/70 rounded-lg bg-white/80 hover:bg-[#f4ecf7] shadow-sm transition-all"
                >
                    <Image src="/google-color-svgrepo-com.svg" alt="Google" width={20} height={20} />
                    <span className="font-medium text-[#4d3859]">Google</span>
                </button>
            </div>
        </div>
    );
}
