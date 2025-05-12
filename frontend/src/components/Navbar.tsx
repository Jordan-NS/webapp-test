"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./magicui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const { status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/rocket.svg"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>
          </div>
          
          <div>
            {status === "authenticated" ? (
              <Button
                onClick={handleLogout}
                className="px-4 py-2"
                variant="primary"
              >
                Sair
              </Button>
            ) : (
              <Button
                href="/login"
                variant="primary"
                className="px-4 py-2"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 