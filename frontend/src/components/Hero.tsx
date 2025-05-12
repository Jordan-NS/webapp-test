"use client";

import { Globe } from "@/components/magicui/globe";
import { Button } from "@/components/magicui/button";
import { Meteors } from "./magicui/meteors";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onExploreClick?: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-end overflow-hidden pt-16">
      <div className="absolute inset-0">
        <Meteors />
      </div>
      <div className="absolute inset-0 scale-150 translate-y-[30%]">
        <Globe />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4 sm:px-6 lg:px-8 mb-32">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-tl from-slate-200 via-slate-50 to-zinc-400 bg-clip-text text-transparent text-center overflow-hidden">
          Explore o Universo
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-2xl">
          Descubra as mais impressionantes imagens capturadas pela NASA. Uma jornada pelo cosmos através dos olhos da ciência.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
          <Button
            onClick={onExploreClick}
            className="text-primary-foreground px-6 py-3 rounded-lg text-md font-medium transition-colors duration-200 flex items-center gap-2"
            variant="primary"
          >
            Começar Exploração
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button 
            href="/register"
            className="bg-transparent hover:bg-primary text-foreground border border-border px-6 py-3 rounded-lg text-md font-medium transition-colors duration-200 text-center"
          >
            Criar Conta
          </Button>
        </div>
      </div>
    </div>
  );
}
