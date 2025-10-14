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
}

const CountingGame: React.FC<CountingGameProps> = ({
  shapes,
  onCorrectAnswer,
  onErrorAnswer,
  onNext,
  className,
}) => {
  const [currentShape, setCurrentShape] = useState<GeometricShape | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [vitorMessage, setVitorMessage] = useState(gameMessages.instructions.counting);

  // Number options for counting (3, 4, 5, 6, 8, 0 for circle/oval)
  const numberOptions = [0, 3, 4, 5, 6, 8];

  const generateQuestion = () => {
    // Filter shapes that have sides (exclude shapes without clear side count)
    const shapesWithSides = shapes.filter(shape => 
      shape.name !== "Estrela" // Stars are complex
    );
    
    const randomShape = shapesWithSides[Math.floor(Math.random() * shapesWithSides.length)];
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
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-3 sm:p-4 gap-2 sm:gap-3 overflow-hidden", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showFeedback}
        />
      </div>

      {/* Current Shape Display */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="text-center space-y-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground px-4 uppercase">
            Quantos lados tem esta forma?
          </h2>
          <ShapeCard
            shape={currentShape}
            className="mx-auto w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 text-4xl sm:text-5xl md:text-6xl"
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
              className="h-auto w-48 sm:w-56"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default CountingGame;