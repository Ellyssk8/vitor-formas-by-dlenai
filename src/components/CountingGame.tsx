import React, { useState, useEffect } from "react";
import { gameMessages } from "@/data/gameData";
import ShapeCard, { GeometricShape } from "./ShapeCard";
import VitorCharacter from "./VitorCharacter";
import { GameButton } from "./GameButton";
import { cn } from "@/lib/utils";
import proximaFormaBtn from "@/assets/buttons/proxima-forma.png";
import tentarNovamenteBtn from "@/assets/buttons/tentar-novamente.png";

interface CountingGameProps {
  shapes: GeometricShape[];
  onCorrectAnswer: () => void;
  onErrorAnswer: () => void;
  onNext: () => void;
  className?: string;
  level?: number;
}

const CountingGame: React.FC<CountingGameProps> = ({
  shapes,
  onCorrectAnswer,
  onErrorAnswer,
  onNext,
  className,
  level = 1,
}) => {
  const [currentShape, setCurrentShape] = useState<GeometricShape | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [vitorMessage, setVitorMessage] = useState(gameMessages.instructions.counting);

  const getDifficultyShapes = () => {
    // Excluir estrela pois pode confundir
    let countableShapes = shapes.filter(s => s.id !== 'star');
    
    // Níveis 1-3: Apenas formas de 3-4 lados (6-8 anos)
    if (level <= 3) {
      return countableShapes.filter(s => s.sides >= 3 && s.sides <= 4);
    }
    // Níveis 4-6: Formas de 3-6 lados (9-10 anos)
    if (level <= 6) {
      return countableShapes.filter(s => s.sides >= 3 && s.sides <= 6);
    }
    // Níveis 7+: Todas as formas contáveis (11-12 anos)
    return countableShapes;
  };

  // Generate number options based on difficulty
  const getNumberOptions = () => {
    // Níveis 1-3: 0-6 (mais fácil)
    if (level <= 3) return Array.from({ length: 7 }, (_, i) => i);
    // Níveis 4-6: 0-8
    if (level <= 6) return Array.from({ length: 9 }, (_, i) => i);
    // Níveis 7+: 0-10 (mais difícil)
    return Array.from({ length: 11 }, (_, i) => i);
  };
  
  const numberOptions = getNumberOptions();

  const generateQuestion = () => {
    const availableShapes = getDifficultyShapes();
    if (availableShapes.length === 0) return;
    
    const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    setCurrentShape(randomShape);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setVitorMessage(gameMessages.instructions.counting);
  };

  const handleAnswerSelect = (number: number) => {
    if (showFeedback) return;

    setSelectedAnswer(number);
    const correct = number === currentShape?.sides;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const encouragement = gameMessages.encouragement[
        Math.floor(Math.random() * gameMessages.encouragement.length)
      ];
      setVitorMessage(`${encouragement} ${currentShape?.description.toUpperCase()}`);
      onCorrectAnswer();
    } else {
      setVitorMessage(`NÃO É CORRETO. CONTE NOVAMENTE OS LADOS DA FORMA! ${currentShape?.description.toUpperCase()}`);
      onErrorAnswer();
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      onNext();
      generateQuestion();
    } else {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setVitorMessage(gameMessages.instructions.counting);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [shapes]);

  if (!currentShape) return null;

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showFeedback}
        />
      </div>

      {/* Current Shape Display */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="text-center space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 px-4 uppercase">
            Quantos lados tem esta forma?
          </h2>
          <ShapeCard
            shape={currentShape}
            className="mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-5xl sm:text-6xl md:text-8xl"
            animate={!showFeedback}
            showAnswer={showFeedback && isCorrect}
            hideName={true}
          />
        </div>
      </div>

      {/* Number Options */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 md:gap-4 w-full max-w-2xl px-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        {numberOptions.map((number) => (
          <GameButton
            key={number}
            variant="shape"
            className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full text-base sm:text-lg md:text-xl font-bold transition-all duration-300",
              selectedAnswer === number && (
                isCorrect ? "ring-4 ring-success bg-success/20" : "ring-4 ring-destructive bg-destructive/20"
              ),
              showFeedback && selectedAnswer !== number && "opacity-50"
            )}
            onClick={() => handleAnswerSelect(number)}
            disabled={showFeedback}
          >
            {number === 0 ? "0" : number}
          </GameButton>
        ))}
      </div>

      {/* Explanation for circles */}
      {currentShape && (currentShape.name === "Círculo" || currentShape.name === "Oval") && (
        <div className="text-center animate-fade-in-up px-4" style={{ animationDelay: "0.6s" }}>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md uppercase">
            💡 Círculos e ovais não têm lados - eles são redondos!
          </p>
        </div>
      )}

      {/* Next Button */}
      {showFeedback && (
        <div className="animate-fade-in-up">
          <button
            onClick={handleNext}
            className="animate-gentle-bounce hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={isCorrect ? proximaFormaBtn : tentarNovamenteBtn} 
              alt={isCorrect ? "Próxima Forma" : "Tentar Novamente"}
              className="h-auto w-64 sm:w-72"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default CountingGame;