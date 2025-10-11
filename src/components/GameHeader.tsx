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
    <header className={cn("flex items-center justify-between p-2 sm:p-4 bg-white/80 backdrop-blur-sm border-b border-border", className)}>
      {/* Left side - Home button */}
      <GameButton
        variant="ghost"
        size="icon"
        onClick={onGoHome}
        className="hover:bg-accent/20 shrink-0 p-1"
      >
        <img src={homeIcon} alt="Home" className="h-6 w-6 sm:h-8 sm:w-8" />
      </GameButton>

      {/* Center - Title */}
      <div className="flex items-center">
        <img 
          src={vitorFormasLogo} 
          alt="Vitor Formas"
          className="h-8 sm:h-10 md:h-14 w-auto"
        />
      </div>

      {/* Right side - Score and Sound */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        {/* Score Display */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-accent/10 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-2">
          <span className="text-xs sm:text-sm font-medium text-foreground">⭐</span>
          <span className="text-xs sm:text-sm font-bold text-foreground">{score}</span>
        </div>

        {/* Level Display - Hidden on mobile */}
        <div className="hidden sm:flex items-center space-x-2 bg-primary/10 rounded-full px-3 md:px-4 py-1 sm:py-2">
          <span className="text-xs sm:text-sm font-medium text-primary uppercase">Nível</span>
          <span className="text-xs sm:text-sm font-bold text-primary">{level}</span>
        </div>

        {/* Mute Button */}
        <GameButton
          variant="mute"
          onClick={onToggleMute}
          className="transition-colors duration-200 shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-1"
        >
          <img 
            src={isMuted ? soundOffIcon : soundOnIcon} 
            alt={isMuted ? "Som desligado" : "Som ligado"} 
            className="h-full w-full"
          />
        </GameButton>
      </div>
    </header>
  );
};

export default GameHeader;