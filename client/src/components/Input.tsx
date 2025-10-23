// src/components/Input.tsx
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    showToggle?: boolean;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', showToggle = false, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type={inputType}
                {...props}
                className="w-full px-2 py-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#4d3859] text-[#4d3859] pr-10"
            />
            {showToggle && type === 'password' && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 text-gray-500 hover:text-[#4d3859]"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
            )}
        </div>
    );
};

export default Input;