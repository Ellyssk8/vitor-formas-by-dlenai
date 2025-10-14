import React from "react";
import { cn } from "@/lib/utils";
import vitorImage from "@/assets/vitor-character-animated.gif";

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
    <div className={cn("flex flex-col items-center space-y-2 sm:space-y-3", className)}>
      {/* Vitor Character Image */}
      <div 
        className={cn(
          "relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white shadow-game border-2 sm:border-4 border-accent",
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
        <div className="relative max-w-xs sm:max-w-sm">
          {/* Speech bubble triangle */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white" />
          
          {/* Speech bubble content */}
          <div className="bg-white rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-shape border-2 border-accent/20">
            <p className="text-center text-foreground font-medium text-xs sm:text-sm md:text-base leading-snug">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitorCharacter;