import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean; // ✅ FIX
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false, // ✅ default boolean
  onClick,
}) => {
  const base =
    "w-full py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled} // ✅ APPLY DI SINI
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
