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
    <div className={cn("flex flex-col items-center justify-between h-screen overflow-hidden p-2 sm:p-3 space-y-2", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up flex-shrink-0">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showFeedback}
        />
      </div>

      {/* Current Shape Display */}
      <div className="animate-fade-in-up flex-shrink" style={{ animationDelay: "0.2s" }}>
        <div className="text-center space-y-2">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-foreground px-2 uppercase">
            Quantos lados tem esta forma?
          </h2>
          <ShapeCard
            shape={currentShape}
            className="mx-auto w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-4xl sm:text-5xl md:text-6xl"
            animate={!showFeedback}
            showAnswer={showFeedback && isCorrect}
            hideName={true}
          />
        </div>
      </div>

      {/* Number Options */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-xl px-2 animate-fade-in-up flex-shrink" style={{ animationDelay: "0.4s" }}>
        {numberOptions.map((number) => (
          <GameButton
            key={number}
            variant="shape"
            className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full text-sm sm:text-base md:text-lg font-bold transition-all duration-300",
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
        <div className="text-center animate-fade-in-up px-2 flex-shrink-0" style={{ animationDelay: "0.6s" }}>
          <p className="text-[10px] sm:text-xs text-muted-foreground max-w-md uppercase">
            💡 Círculos e ovais não têm lados - eles são redondos!
          </p>
        </div>
      )}

      {/* Next Button */}
      {showFeedback && (
        <div className="animate-fade-in-up flex-shrink-0 pb-2">
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