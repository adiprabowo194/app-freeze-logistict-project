import Link from "next/link";
import React from "react";
import Image from "next/image";
import DataImage from "@/public/assets/logo_freeze_logistics.webp";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  width?: number;
  height?: number;
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
  width = 240,
  height = 240,
  className = "",
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <Image
        src={DataImage} // pastikan ini ada di data.ts
        alt="Freeze Logistics Logo"
        width={width}
        height={height}
        className="rounded-xl object-contain"
      />
    </Link>
  );
}
