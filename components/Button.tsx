import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "purple"
    | "red"
    | "gray"
    | "blue"
    | "green"
    | "yellow";
  className?: string;
  disabled?: boolean; // ✅ FIX
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  className = "w-full",
  disabled = false, // ✅ default boolean
  onClick,
}) => {
  const base =
    "py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed items-center";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
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
