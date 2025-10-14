import React from "react";
import { GameButton } from "./GameButton";
import VitorCharacter from "./VitorCharacter";
import { GameMode } from "@/data/gameData";
import { cn } from "@/lib/utils";
import vitorFormasLogo from "@/assets/vitor-formas-logo.png";
import identificarFormas from "@/assets/identificar-formas.svg";
import corresponderFormas from "@/assets/corresponder-formas.svg";
import contarLados from "@/assets/contar-lados.svg";
import playButton from "@/assets/play-button.png";
import soundOn from "@/assets/icons/sound-on.png";
import soundOff from "@/assets/icons/sound-off.png";
import backgroundAnimation from "@/assets/background-animation.gif";

interface GameMenuProps {
  onSelectMode: (mode: GameMode) => void;
  className?: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectMode, className, isMuted, onToggleMute }) => {
  const gameOptions = [
    {
      mode: GameMode.IDENTIFICATION,
      image: identificarFormas,
      alt: "Identificar Formas",
    },
    {
      mode: GameMode.MATCHING,
      image: corresponderFormas,
      alt: "Corresponder Formas",
    },
    {
      mode: GameMode.COUNTING,
      image: contarLados,
      alt: "Contar Lados",
    },
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-3 sm:p-4 gap-2 sm:gap-3 relative overflow-hidden", className)}>
      {/* Background Animation */}
      <div 
        className="absolute left-0 right-0 flex items-start justify-center pointer-events-none"
        style={{ zIndex: 0, top: '20%' }}
      >
        <img 
          src={backgroundAnimation}
          alt=""
          className="w-full max-w-4xl h-auto object-contain"
        />
      </div>

      {/* Sound Toggle Button */}
      <GameButton
        variant="mute"
        size="icon"
        onClick={onToggleMute}
        className="absolute top-4 right-4 z-20"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        <img 
          src={isMuted ? soundOff : soundOn}
          alt={isMuted ? "Som desativado" : "Som ativado"}
          className="w-6 h-6 sm:w-8 sm:h-8"
        />
      </GameButton>

      {/* Game Title */}
      <div className="text-center space-y-1 sm:space-y-2 animate-fade-in-up flex flex-col items-center w-full relative z-10">
        <img 
          src={vitorFormasLogo} 
          alt="Vitor Formas"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4"
        />
        <p className="text-base sm:text-xl md:text-2xl text-foreground font-semibold max-w-3xl px-4 uppercase">
          Aprenda formas geométricas de forma divertida!
        </p>
      </div>

      {/* Vitor Character */}
      <div className="animate-fade-in-up flex justify-center w-full relative z-10" style={{ animationDelay: "0.2s" }}>
        <VitorCharacter 
          message="Olá! Vamos aprender formas juntos?"
          animate={true}
        />
      </div>

      {/* Game Mode Options */}
      <div className="grid gap-2 sm:gap-3 w-full max-w-md sm:max-w-lg px-4 animate-fade-in-up mx-auto relative z-10" style={{ animationDelay: "0.4s" }}>
        {gameOptions.map((option, index) => (
          <GameButton
            key={option.mode}
            variant="shape"
            className="h-auto p-2 sm:p-3 hover:bg-accent/10 border-2 hover:border-accent/30 transition-all duration-300 w-full"
            onClick={() => onSelectMode(option.mode)}
            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
          >
            <img 
              src={option.image} 
              alt={option.alt}
              className="w-full h-auto"
            />
          </GameButton>
        ))}
      </div>

      {/* Play Button */}
      <div className="animate-fade-in-up cursor-pointer flex justify-center w-full relative z-10" style={{ animationDelay: "0.8s" }} onClick={() => onSelectMode(GameMode.IDENTIFICATION)}>
        <img 
          src={playButton} 
          alt="Play"
          className="w-full max-w-[120px] sm:max-w-[140px] hover:scale-105 transition-transform duration-300 animate-pulse-gentle"
        />
      </div>
    </div>
  );
};

export default GameMenu;