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
    <div className={cn("flex flex-col items-center space-y-1 sm:space-y-2", className)}>
      {/* Vitor Character Image */}
      <div 
        className={cn(
          "relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white shadow-game border-2 sm:border-3 border-accent",
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
          <div className="bg-white rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 shadow-shape border-2 border-accent/20">
            <p className="text-center text-foreground font-medium text-[10px] sm:text-xs md:text-sm leading-snug">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitorCharacter;