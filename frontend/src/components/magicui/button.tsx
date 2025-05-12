"use client";

import React from 'react'
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
}

export function Button({ 
  children, 
  className, 
  href,
  onClick,
  variant = 'default'
}: ButtonProps) {
  const baseStyles = "transform-gpu sm:transform-none bg-black rounded-sm [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] transition-all duration-500 hover:shadow-[0_0_30px_4px_rgba(79,70,229,0.15)]"
  
  const variants = {
    default: "bg-[#4f5d73] text-white hover:bg-[#4f5d73]/90",
    primary: "bg-[#c75c5c] text-white hover:bg-[#c75c5c]/90",
    secondary: "bg-transparent text-[#4f5d73] border border-[#4f5d73] hover:bg-[#4f5d73]/10",
    outline: "bg-transparent text-[#c75c5c] border border-[#c75c5c] hover:bg-[#c75c5c]/10"
  }

  const styles = cn(
    baseStyles,
    variants[variant],
    className
  )

  if (href) {
    return (
      <Link 
        href={href} 
        className={styles}
      >
        {children}
      </Link>
    )
  }

  return (
    <button 
      className={styles}
      onClick={onClick}
    >
      {children}
    </button>
  )
}