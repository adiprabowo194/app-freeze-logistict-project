import Link from "next/link";
import React from "react";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  textColor?: string;
  showText?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export default function Logo({
  href = "/",
  size = "md",
  color = "text-blue-600",
  textColor = "text-[#0F253C]",
  showText = true,
  className = "",
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <i
        className={`ri-snowflake-line ${sizeClasses[size]} ${color} transition-colors duration-300`}
      ></i>

      {/* Text */}
      {showText && (
        <h1
          className={`font-bold ${sizeClasses[size]} ${textColor} transition-colors duration-300`}
        >
          Freeze Logistics
        </h1>
      )}
    </Link>
  );
}
