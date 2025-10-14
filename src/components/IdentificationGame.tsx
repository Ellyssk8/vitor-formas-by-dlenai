import React, { useState, useEffect } from "react";
import { gameMessages } from "@/data/gameData";
import ShapeCard, { GeometricShape } from "./ShapeCard";
import VitorCharacter from "./VitorCharacter";
import { GameButton } from "./GameButton";
import { cn } from "@/lib/utils";
import proximaFormaBtn from "@/assets/buttons/proxima-forma.png";
import tentarNovamenteBtn from "@/assets/buttons/tentar-novamente.png";

interface IdentificationGameProps {
  shapes: GeometricShape[];
  onCorrectAnswer: () => void;
  onErrorAnswer: () => void;
  onNext: () => void;
  className?: string;
}

const IdentificationGame: React.FC<IdentificationGameProps> = ({
  shapes,
  onCorrectAnswer,
  onErrorAnswer,
  onNext,
  className,
}) => {
  const [currentShape, setCurrentShape] = useState<GeometricShape | null>(null);
  const [options, setOptions] = useState<GeometricShape[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [vitorMessage, setVitorMessage] = useState(gameMessages.instructions.identification);

  const generateQuestion = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(randomShape);

    // Create 3 options: correct answer + 2 random wrong answers
    const wrongOptions = shapes
      .filter(shape => shape.id !== randomShape.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const allOptions = [randomShape, ...wrongOptions]
      .sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setVitorMessage(gameMessages.instructions.identification);
  };

  const handleAnswerSelect = (shapeId: string) => {
    if (showFeedback) return;

    setSelectedAnswer(shapeId);
    const correct = shapeId === currentShape?.id;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const encouragement = gameMessages.encouragement[
        Math.floor(Math.random() * gameMessages.encouragement.length)
      ];
      setVitorMessage(encouragement);
      onCorrectAnswer();
    } else {
      setVitorMessage("NÃO FOI DESSA VEZ! OBSERVE BEM AS CARACTERÍSTICAS DA FORMA E TENTE NOVAMENTE!");
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
      setVitorMessage(gameMessages.instructions.identification);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [shapes]);

  if (!currentShape) return null;

  return (
    <div className={cn("flex flex-col items-center justify-center h-full p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-hidden", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showFeedback}
        />
      </div>

      {/* Current Shape Display */}
      <div className="animate-fade-in-up w-full max-w-3xl" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground px-4 text-center uppercase">
            Qual é o nome desta forma?
          </h2>
          <div className="flex justify-center w-full">
            <ShapeCard
              shape={currentShape}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 text-4xl sm:text-5xl md:text-6xl"
              animate={!showFeedback}
              hideName={true}
            />
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="w-full max-w-3xl px-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 justify-items-center">
          {options.map((option) => (
            <GameButton
              key={option.id}
              variant="shape"
              size="shape-answer"
              onClick={() => handleAnswerSelect(option.id)}
              className={cn(
                "transition-all duration-300 h-16 sm:h-18 w-full",
                selectedAnswer === option.id && (
                  isCorrect ? "ring-4 ring-success bg-success/20" : "ring-4 ring-destructive bg-destructive/20"
                ),
                showFeedback && selectedAnswer !== option.id && "opacity-50"
              )}
              disabled={showFeedback}
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-lg sm:text-xl">{option.emoji}</span>
                <span className="font-semibold text-xs sm:text-sm uppercase">{option.name}</span>
              </div>
            </GameButton>
          ))}
        </div>
      </div>

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

export default IdentificationGame;