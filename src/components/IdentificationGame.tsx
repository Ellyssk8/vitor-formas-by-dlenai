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
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-2 gap-1.5 overflow-hidden", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up flex-shrink-0">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showFeedback}
        />
      </div>

      {/* Current Shape Display */}
      <div className="animate-fade-in-up w-full max-w-3xl flex-shrink-0" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-foreground px-2 text-center uppercase">
            Qual é o nome desta forma?
          </h2>
          <div className="flex justify-center w-full">
            <ShapeCard
              shape={currentShape}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-3xl sm:text-4xl md:text-5xl"
              animate={!showFeedback}
              hideName={true}
            />
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="w-full max-w-3xl px-2 animate-fade-in-up flex-shrink-0" style={{ animationDelay: "0.4s" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 justify-items-center">
          {options.map((option) => (
            <GameButton
              key={option.id}
              variant="shape"
              size="shape-answer"
              onClick={() => handleAnswerSelect(option.id)}
              className={cn(
                "transition-all duration-300 h-14 sm:h-16 w-full",
                selectedAnswer === option.id && (
                  isCorrect ? "ring-4 ring-success bg-success/20" : "ring-4 ring-destructive bg-destructive/20"
                ),
                showFeedback && selectedAnswer !== option.id && "opacity-50"
              )}
              disabled={showFeedback}
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-base sm:text-lg">{option.emoji}</span>
                <span className="font-semibold text-xs uppercase">{option.name}</span>
              </div>
            </GameButton>
          ))}
        </div>
      </div>

      {/* Next Button */}
      {showFeedback && (
        <div className="animate-fade-in-up flex-shrink-0">
          <button
            onClick={handleNext}
            className="animate-gentle-bounce hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={isCorrect ? proximaFormaBtn : tentarNovamenteBtn} 
              alt={isCorrect ? "Próxima Forma" : "Tentar Novamente"}
              className="h-auto w-36 sm:w-44"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default IdentificationGame;