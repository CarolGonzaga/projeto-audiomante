"use client";

import { useState, useEffect, FormEvent } from "react";
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

    const [showPassword, setShowPassword] = useState(false);
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
                    ? `${process.env.NEXT_PUBLIC_API_URL}/users/login`
                    : `${process.env.NEXT_PUBLIC_API_URL}/users/signup`;

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

    useEffect(() => {
        // Zera os campos do formulário e o erro ao trocar de aba
        setFormData({ name: "", email: "", password: "" });
        setError(null);
    }, [tab]);

    const inputClassName =
        "peer w-full px-4 pt-6 pb-1 rounded-lg border border-[#c8b6d9]/50 focus:outline-none focus:ring-2 focus:ring-[#4d3859]/50 bg-white text-gray-900 placeholder-transparent text-sm";

    const labelClassName =
        "absolute left-4 text-[#4d3859]/70 transition-all duration-200 ease-in-out pointer-events-none " +
        "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm " +
        "peer-focus:left-3 peer-focus:top-1.5 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-1 peer-focus:text-gray-400 " +
        "peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-transparent peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:text-gray-400";

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#4d3859] overflow-hidden">
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

            <div className="relative z-10 flex flex-col items-center">
                <div className="m-2">
                    <Image
                        src="/Audiomante (2).png"
                        alt="Audiomante"
                        width={180}
                        height={60}
                        className="drop-shadow-lg"
                    />
                </div>

                {/* Card principal */}
                <div className="w-full max-w-md m-10 bg-[#fffaf7]/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-[#e3d5ca]/60">
                    {/* Tabs */}
                    <div className="flex -mb-px z-20 relative">
                        <button
                            type="button"
                            onClick={() => setTab("login")}
                            className={`py-3 px-8 font-semibold transition-all duration-300 rounded-t-lg border-x border-t
                ${tab === "login"
                                    ? "bg-[#4d3859] text-white shadow-lg border-[#4d3859]" // Aba ativa
                                    : "bg-[#fffaf7]/80 text-[#4d3859] hover:bg-white/100 border-[#e3d5ca]/60" // Aba inativa
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("signup")}
                            className={`py-3 px-8 font-semibold transition-all duration-300 rounded-t-lg border-x border-t
                ${tab === "signup"
                                    ? "bg-[#4d3859] text-white shadow-lg border-[#4d3859]" // Aba ativa
                                    : "bg-[#fffaf7]/80 text-[#4d3859] hover:bg-white/100 border-[#e3d5ca]/60" // Aba inativa
                                }`}
                        >
                            Cadastrar
                        </button>
                        {/* Borda inferior que cobre o restante da largura (para se fundir com o card) */}
                        <div className="flex-1 border-b border-[#e3d5ca]/60"></div>
                    </div>

                    <div
                        className={`relative z-10 bg-[#fffaf7]/90 backdrop-blur-sm shadow-2xl p-8 border border-[#e3d5ca]/60
            ${tab === "login"
                                ? "rounded-tl-none rounded-tr-2xl rounded-b-2xl" // Canto superior esquerdo reto
                                : "rounded-tr-none rounded-tl-2xl rounded-b-2xl" // Canto superior direito reto
                            }
          `}
                    >

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {tab === "signup" && (
                                <div className="relative mt-2">
                                    <input
                                        id="username"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={inputClassName}
                                        placeholder="Usuário"
                                    />
                                    <label
                                        htmlFor="username"
                                        className={labelClassName}
                                    >
                                        Usuário
                                    </label>
                                </div>
                            )}

                            <div className="relative mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                    placeholder="E-mail"
                                />
                                <label
                                    htmlFor="email"
                                    className={labelClassName}
                                >
                                    E-mail
                                </label>
                            </div>

                            <div className="relative mt-2">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClassName} pr-10`}
                                    placeholder="Senha"
                                />
                                <label
                                    htmlFor="password"
                                    className={labelClassName}
                                >
                                    Senha
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d3859]/70 hover:text-[#4d3859]"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>


                            {tab === "login" && (
                                <div className="mt-4 mb-8 flex items-center justify-between text-sm text-[#4d3859]/80">
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
            </div>
        </div >
    );
}
