import React, { useState, useEffect } from "react";
import GameMenu from "@/components/GameMenu";
import GameHeader from "@/components/GameHeader";
import IdentificationGame from "@/components/IdentificationGame";
import MatchingGame from "@/components/MatchingGame";
import CountingGame from "@/components/CountingGame";
import MatchThreeGame from "@/components/MatchThreeGame";
import { GameMode, geometricShapes } from "@/data/gameData";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.MENU);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const {
    isMuted,
    toggleMute,
    playSuccessSound,
    playErrorSound,
    playClickSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    playMenuMusic,
    stopMenuMusic,
  } = useGameAudio();
  
  const { toast } = useToast();

  // Play menu music when on menu
  useEffect(() => {
    if (currentMode === GameMode.MENU) {
      stopBackgroundMusic();
      playMenuMusic();
    } else {
      stopMenuMusic();
      playBackgroundMusic();
    }
  }, [currentMode, playMenuMusic, stopMenuMusic, stopBackgroundMusic, playBackgroundMusic]);

  const handleModeSelect = (mode: GameMode) => {
    playClickSound();
    setCurrentMode(mode);
  };

  const handleCorrectAnswer = () => {
    playSuccessSound();
    setScore(prev => prev + 10);
    toast({
      title: "MUITO BEM! 🎉",
      description: "+10 PONTOS",
      duration: 2000,
    });
  };

  const handleNext = () => {
    playClickSound();
    // Level up every 5 correct answers
    if (score > 0 && score % 50 === 0) {
      setLevel(prev => prev + 1);
      toast({
        title: "NÍVEL AUMENTOU! 🚀",
        description: `VOCÊ CHEGOU AO NÍVEL ${level + 1}!`,
        duration: 3000,
      });
    }
  };

  const handleGoHome = () => {
    playClickSound();
    setCurrentMode(GameMode.MENU);
  };

  const renderGame = () => {
    switch (currentMode) {
      case GameMode.IDENTIFICATION:
        return (
          <IdentificationGame
            shapes={geometricShapes}
            onCorrectAnswer={handleCorrectAnswer}
            onErrorAnswer={playErrorSound}
            onNext={handleNext}
            level={level}
          />
        );
      case GameMode.COUNTING:
        return (
          <CountingGame
            shapes={geometricShapes}
            onCorrectAnswer={handleCorrectAnswer}
            onErrorAnswer={playErrorSound}
            onNext={handleNext}
            level={level}
          />
        );
      case GameMode.MATCHING:
        return (
          <MatchingGame
            shapes={geometricShapes}
            onCorrectAnswer={handleCorrectAnswer}
            onErrorAnswer={playErrorSound}
            onNext={handleNext}
            level={level}
          />
        );
      case GameMode.MATCH_THREE:
        return (
          <MatchThreeGame
            shapes={geometricShapes}
            onCorrectAnswer={handleCorrectAnswer}
            onErrorAnswer={playErrorSound}
            onNext={handleNext}
            level={level}
          />
        );
      default:
        return (
          <GameMenu 
            onSelectMode={handleModeSelect}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {currentMode !== GameMode.MENU && (
        <GameHeader
          score={score}
          level={level}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onGoHome={handleGoHome}
        />
      )}
      
      <main className={currentMode !== GameMode.MENU ? "pt-0" : ""}>
        {renderGame()}
      </main>
    </div>
  );
};

export default Index;
