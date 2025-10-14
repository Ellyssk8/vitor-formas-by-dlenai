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
    <div className={cn("flex flex-col items-center justify-between h-screen overflow-hidden p-2 sm:p-3 relative", className)}>
      {/* Background Animation */}
      <div 
        className="absolute left-0 right-0 flex items-start justify-center pointer-events-none"
        style={{ zIndex: 0, top: '15%' }}
      >
        <img 
          src={backgroundAnimation}
          alt=""
          className="w-full max-w-2xl h-auto object-contain opacity-80"
        />
      </div>

      {/* Sound Toggle Button */}
      <GameButton
        variant="mute"
        size="icon"
        onClick={onToggleMute}
        className="absolute top-2 right-2 z-20 w-8 h-8 sm:w-10 sm:h-10"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        <img 
          src={isMuted ? soundOff : soundOn}
          alt={isMuted ? "Som desativado" : "Som ativado"}
          className="w-4 h-4 sm:w-5 sm:h-5"
        />
      </GameButton>

      {/* Top Section: Title */}
      <div className="text-center space-y-1 animate-fade-in-up flex flex-col items-center w-full relative z-10 pt-2">
        <img 
          src={vitorFormasLogo} 
          alt="Vitor Formas"
          className="w-full max-w-[180px] sm:max-w-[240px] md:max-w-[280px] mx-auto px-2"
        />
        <p className="text-xs sm:text-sm md:text-base text-foreground font-semibold max-w-2xl px-2 uppercase">
          Aprenda formas geométricas de forma divertida!
        </p>
      </div>

      {/* Middle Section: Character + Options */}
      <div className="flex flex-col items-center w-full relative z-10 space-y-2 flex-shrink">
        {/* Vitor Character */}
        <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "0.2s" }}>
          <VitorCharacter 
            message="Olá! Vamos aprender formas juntos?"
            animate={true}
          />
        </div>

        {/* Game Mode Options */}
        <div className="grid gap-1.5 sm:gap-2 w-full max-w-sm sm:max-w-md px-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {gameOptions.map((option, index) => (
            <GameButton
              key={option.mode}
              variant="shape"
              className="h-auto p-1.5 sm:p-2 hover:bg-accent/10 border-2 hover:border-accent/30 transition-all duration-300 w-full"
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
      </div>

      {/* Bottom Section: Play Button */}
      <div className="animate-fade-in-up cursor-pointer flex justify-center w-full relative z-10 pb-2" style={{ animationDelay: "0.8s" }} onClick={() => onSelectMode(GameMode.IDENTIFICATION)}>
        <img 
          src={playButton} 
          alt="Play"
          className="w-full max-w-[80px] sm:max-w-[100px] hover:scale-105 transition-transform duration-300 animate-pulse-gentle"
        />
      </div>
    </div>
  );
};

export default GameMenu;