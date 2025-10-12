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
  level?: number;
}

const IdentificationGame: React.FC<IdentificationGameProps> = ({
  shapes,
  onCorrectAnswer,
  onErrorAnswer,
  onNext,
  className,
  level = 1,
}) => {
  const [currentShape, setCurrentShape] = useState<GeometricShape | null>(null);
  const [options, setOptions] = useState<GeometricShape[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [vitorMessage, setVitorMessage] = useState(gameMessages.instructions.identification);

  const getDifficultyShapes = () => {
    // Níveis 1-3: Formas básicas (6-8 anos)
    if (level <= 3) {
      return shapes.filter(s => ['square', 'rectangle', 'triangle', 'circle'].includes(s.id));
    }
    // Níveis 4-6: Adicionar formas intermediárias (9-10 anos)
    if (level <= 6) {
      return shapes.filter(s => !['star', 'parallelogram'].includes(s.id));
    }
    // Níveis 7+: Todas as formas (11-12 anos)
    return shapes;
  };

  const getNumberOfOptions = () => {
    // Níveis 1-2: 3 opções (mais fácil)
    if (level <= 2) return 3;
    // Níveis 3-5: 4 opções
    if (level <= 5) return 4;
    // Níveis 6+: 5 opções (mais difícil)
    return 5;
  };

  const generateQuestion = () => {
    const availableShapes = getDifficultyShapes();
    const numOptions = getNumberOfOptions();
    
    if (availableShapes.length < numOptions) return;
    
    // Select random shape as correct answer
    const correctShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    
    // Get wrong answers
    const wrongShapes = availableShapes
      .filter(s => s.id !== correctShape.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, numOptions - 1);
    
    // Shuffle all options
    const allOptions = [correctShape, ...wrongShapes].sort(() => Math.random() - 0.5);
    
    setCurrentShape(correctShape);
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
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showFeedback}
        />
      </div>

      {/* Current Shape Display */}
      <div className="animate-fade-in-up w-full max-w-3xl" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 px-4 text-center uppercase">
            Qual é o nome desta forma?
          </h2>
          <div className="flex justify-center w-full">
            <ShapeCard
              shape={currentShape}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-5xl sm:text-6xl md:text-8xl"
              animate={!showFeedback}
              hideName={true}
            />
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="w-full max-w-3xl px-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <div className={cn(
          "grid gap-3 sm:gap-4 md:gap-6 justify-items-center",
          options.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : options.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-5"
        )}>
          {options.map((option) => (
            <GameButton
              key={option.id}
              variant="shape"
              size="shape-answer"
              onClick={() => handleAnswerSelect(option.id)}
              className={cn(
                "transition-all duration-300 h-20 sm:h-24 w-full",
                selectedAnswer === option.id && (
                  isCorrect ? "ring-4 ring-success bg-success/20" : "ring-4 ring-destructive bg-destructive/20"
                ),
                showFeedback && selectedAnswer !== option.id && "opacity-50"
              )}
              disabled={showFeedback}
            >
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
                <span className="text-xl sm:text-2xl">{option.emoji}</span>
                <span className="font-semibold text-sm sm:text-base uppercase">{option.name}</span>
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
              className="h-auto w-64 sm:w-72"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default IdentificationGame;