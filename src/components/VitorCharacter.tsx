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
    <div className={cn("flex flex-col items-center space-y-1.5", className)}>
      {/* Vitor Character Image */}
      <div 
        className={cn(
          "relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white shadow-game border-2 border-accent",
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
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-white" />
          
          {/* Speech bubble content */}
          <div className="bg-white rounded-lg px-2.5 py-1.5 shadow-shape border border-accent/20">
            <p className="text-center text-foreground font-medium text-[10px] sm:text-xs leading-tight">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitorCharacter;