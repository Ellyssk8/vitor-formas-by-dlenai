import React from "react";
import { cn } from "@/lib/utils";
import vitorImage from "@/assets/vitor-character-new.png";

interface VitorCharacterProps {
  message?: string;
  className?: string;
  animate?: boolean;
}

const VitorCharacter: React.FC<VitorCharacterProps> = ({
  message = "Olá! Sou o Vitor e vou te ensinar geometria de forma divertida!",
  className,
  animate = true,
}) => {
  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Vitor Character Image */}
      <div 
        className={cn(
          "relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden bg-white shadow-game border-4 border-accent",
          animate && "animate-gentle-bounce"
        )}
      >
        <img
          src={vitorImage}
          alt="Vitor - seu guia de formas geométricas"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative max-w-xs">
          {/* Speech bubble triangle */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white" />
          
          {/* Speech bubble content */}
          <div className="bg-white rounded-2xl px-6 py-4 shadow-shape border-2 border-accent/20">
            <p className="text-center text-foreground font-medium text-lg leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitorCharacter;