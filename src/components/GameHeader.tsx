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
    <header className={cn("flex items-center justify-between gap-2 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm border-b border-border shrink-0", className)}>
      {/* Left side - Home button */}
      <GameButton
        variant="ghost"
        size="icon"
        onClick={onGoHome}
        className="hover:bg-accent/20 shrink-0 p-1 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
      >
        <img src={homeIcon} alt="Home" className="h-full w-full object-contain" />
      </GameButton>

      {/* Center - Title */}
      <div className="flex items-center justify-center flex-1">
        <img 
          src={vitorFormasLogo} 
          alt="Vitor Formas"
          className="h-6 sm:h-8 md:h-10 w-auto object-contain"
        />
      </div>

      {/* Right side - Score and Sound */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Score Display */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-accent/10 rounded-full px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1">
          <span className="text-xs sm:text-sm font-medium text-foreground">⭐</span>
          <span className="text-xs sm:text-sm font-bold text-foreground">{score}</span>
        </div>

        {/* Level Display - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1 md:gap-1.5 bg-primary/10 rounded-full px-2 md:px-3 py-1">
          <span className="text-xs sm:text-sm font-medium text-primary uppercase">Nível</span>
          <span className="text-xs sm:text-sm font-bold text-primary">{level}</span>
        </div>

        {/* Mute Button */}
        <GameButton
          variant="mute"
          onClick={onToggleMute}
          className="transition-colors duration-200 shrink-0 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1"
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