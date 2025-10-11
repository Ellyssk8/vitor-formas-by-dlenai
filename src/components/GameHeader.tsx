import React from "react";
import { GameButton } from "./GameButton";
import { cn } from "@/lib/utils";
import vitorFormasLogo from "@/assets/vitor-formas-logo-game.png";
import homeIcon from "@/assets/icons/home.png";
import soundOnIcon from "@/assets/icons/sound-on.png";
import soundOffIcon from "@/assets/icons/sound-off.png";

interface GameHeaderProps {
  score?: number;
  level?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onGoHome: () => void;
  className?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score = 0,
  level = 1,
  isMuted,
  onToggleMute,
  onGoHome,
  className,
}) => {
  return (
    <header className={cn("flex items-center justify-between gap-2 p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm border-b border-border", className)}>
      {/* Left side - Home button */}
      <GameButton
        variant="ghost"
        size="icon"
        onClick={onGoHome}
        className="hover:bg-accent/20 shrink-0 p-1 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
      >
        <img src={homeIcon} alt="Home" className="h-full w-full object-contain" />
      </GameButton>

      {/* Center - Title */}
      <div className="flex items-center justify-center flex-1">
        <img 
          src={vitorFormasLogo} 
          alt="Vitor Formas"
          className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
        />
      </div>

      {/* Right side - Score and Sound */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Score Display */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-accent/10 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2">
          <span className="text-xs sm:text-sm md:text-base font-medium text-foreground">⭐</span>
          <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">{score}</span>
        </div>

        {/* Level Display - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1.5 md:gap-2 bg-primary/10 rounded-full px-3 md:px-4 py-1.5 md:py-2">
          <span className="text-xs sm:text-sm md:text-base font-medium text-primary uppercase">Nível</span>
          <span className="text-xs sm:text-sm md:text-base font-bold text-primary">{level}</span>
        </div>

        {/* Mute Button */}
        <GameButton
          variant="mute"
          onClick={onToggleMute}
          className="transition-colors duration-200 shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 p-1.5"
        >
          <img 
            src={isMuted ? soundOffIcon : soundOnIcon} 
            alt={isMuted ? "Som desligado" : "Som ligado"} 
            className="h-full w-full object-contain"
          />
        </GameButton>
      </div>
    </header>
  );
};

export default GameHeader;