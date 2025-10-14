import React, { useState, useEffect, useRef } from "react";
import { gameMessages } from "@/data/gameData";
import ShapeCard, { GeometricShape } from "./ShapeCard";
import VitorCharacter from "./VitorCharacter";
import { GameButton } from "./GameButton";
import { cn } from "@/lib/utils";
import proximoDesafioBtn from "@/assets/buttons/proximo-desafio.png";

interface MatchingGameProps {
  shapes: GeometricShape[];
  onCorrectAnswer: () => void;
  onErrorAnswer: () => void;
  onNext: () => void;
  className?: string;
}

interface DraggedShape extends GeometricShape {
  position: { x: number; y: number };
  isDragging: boolean;
  isMatched: boolean;
}

interface DropZone {
  id: string;
  shape: GeometricShape;
  position: { x: number; y: number };
  isOccupied: boolean;
}

const MatchingGame: React.FC<MatchingGameProps> = ({
  shapes,
  onCorrectAnswer,
  onErrorAnswer,
  onNext,
  className,
}) => {
  const [gameShapes, setGameShapes] = useState<DraggedShape[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [draggedShapeId, setDraggedShapeId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [vitorMessage, setVitorMessage] = useState(gameMessages.instructions.matching);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateMatchingGame = () => {
    // Select 4 random shapes for the game
    const selectedShapes = shapes
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // Create draggable shapes positioned on the left side (will be positioned by CSS)
    const newGameShapes: DraggedShape[] = selectedShapes.map((shape, index) => ({
      ...shape,
      position: { x: 0, y: index * 100 }, // Relative positioning
      isDragging: false,
      isMatched: false,
    }));

    // Create drop zones positioned on the right side (will be positioned by CSS)
    const newDropZones: DropZone[] = selectedShapes
      .sort(() => Math.random() - 0.5) // Randomize drop zone order
      .map((shape, index) => ({
        id: `drop-${shape.id}`,
        shape,
        position: { x: 0, y: index * 100 }, // Relative positioning
        isOccupied: false,
      }));

    setGameShapes(newGameShapes);
    setDropZones(newDropZones);
    setMatchedPairs(0);
    setShowCelebration(false);
    setVitorMessage(gameMessages.instructions.matching);
  };

  const handleMouseDown = (shapeId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const shape = gameShapes.find(s => s.id === shapeId);
    if (shape && !shape.isMatched && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const shapeElement = event.currentTarget.getBoundingClientRect();
      const x = shapeElement.left - rect.left;
      const y = shapeElement.top - rect.top;
      
      setDraggedShapeId(shapeId);
      setGameShapes(prev => prev.map(s => 
        s.id === shapeId ? { ...s, isDragging: true, position: { x, y } } : s
      ));
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggedShapeId && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - 48; // Center the shape (half of 96px)
      const y = event.clientY - rect.top - 48;

      const maxX = rect.width - 96;
      const maxY = rect.height - 96;

      setGameShapes(prev => prev.map(s => 
        s.id === draggedShapeId 
          ? { ...s, position: { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) } }
          : s
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedShapeId && gameAreaRef.current) {
      const draggedShape = gameShapes.find(s => s.id === draggedShapeId);
      if (draggedShape) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        
        // Get all drop zone elements
        const dropZoneElements = Array.from(gameAreaRef.current.querySelectorAll('[data-drop-zone]'));
        
        // Check if shape is dropped on a matching drop zone
        let targetZone = null;
        let targetZoneIndex = -1;
        
        for (let i = 0; i < dropZoneElements.length; i++) {
          const element = dropZoneElements[i] as HTMLElement;
          const zoneRect = element.getBoundingClientRect();
          const zoneId = element.getAttribute('data-drop-zone');
          const zone = dropZones.find(z => z.id === zoneId);
          
          if (zone && !zone.isOccupied) {
            const distance = Math.sqrt(
              Math.pow((zoneRect.left + zoneRect.width / 2) - (draggedShape.position.x + rect.left + 48), 2) +
              Math.pow((zoneRect.top + zoneRect.height / 2) - (draggedShape.position.y + rect.top + 48), 2)
            );
            
            if (distance < 100 && zone.shape.id === draggedShape.id) {
              targetZone = zone;
              targetZoneIndex = i;
              break;
            }
          }
        }

        if (targetZone) {
          // Successful match - keep the shape at its dropped position
          setGameShapes(prev => prev.map(s => 
            s.id === draggedShapeId 
              ? { ...s, isDragging: false, isMatched: true }
              : s
          ));
          setDropZones(prev => prev.map(z => 
            z.id === targetZone!.id ? { ...z, isOccupied: true } : z
          ));
          setMatchedPairs(prev => prev + 1);
          onCorrectAnswer();
          
          if (matchedPairs + 1 === gameShapes.length) {
            setShowCelebration(true);
            setVitorMessage("EXCELENTE TRABALHO! VOCÊ DOMINOU O RECONHECIMENTO DE FORMAS GEOMÉTRICAS!");
          }
        } else {
          // Return to original position
          setGameShapes(prev => prev.map(s => 
            s.id === draggedShapeId 
              ? { ...s, isDragging: false }
              : s
          ));
          onErrorAnswer();
        }
      }
      setDraggedShapeId(null);
    }
  };

  const handleTouchStart = (shapeId: string, event: React.TouchEvent) => {
    event.preventDefault();
    const shape = gameShapes.find(s => s.id === shapeId);
    if (shape && !shape.isMatched && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const shapeElement = event.currentTarget.getBoundingClientRect();
      const x = shapeElement.left - rect.left;
      const y = shapeElement.top - rect.top;
      
      setDraggedShapeId(shapeId);
      setGameShapes(prev => prev.map(s => 
        s.id === shapeId ? { ...s, isDragging: true, position: { x, y } } : s
      ));
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (draggedShapeId && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left - 48;
      const y = touch.clientY - rect.top - 48;

      const maxX = rect.width - 96;
      const maxY = rect.height - 96;

      setGameShapes(prev => prev.map(s => 
        s.id === draggedShapeId 
          ? { ...s, position: { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) } }
          : s
      ));
    }
  };

  const handleNext = () => {
    onNext();
    generateMatchingGame();
  };

  useEffect(() => {
    generateMatchingGame();
  }, [shapes]);

  return (
    <div className={cn("flex flex-col items-center justify-start h-screen overflow-hidden p-2 sm:p-3 space-y-2", className)}>
      {/* Vitor with Instructions */}
      <div className="animate-fade-in-up flex-shrink-0">
        <VitorCharacter 
          message={vitorMessage}
          animate={!showCelebration}
        />
      </div>

      {/* Instructions */}
      <div className="text-center animate-fade-in-up px-2 flex-shrink-0" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-foreground uppercase">
          Arraste as formas para seus contornos!
        </h2>
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="relative w-full max-w-3xl h-[280px] sm:h-[320px] md:h-[380px] bg-white/50 rounded-2xl border-2 border-dashed border-accent/30 overflow-hidden animate-fade-in-up flex items-center justify-center flex-shrink"
        style={{ animationDelay: "0.4s" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div className="relative w-full h-full max-w-[90%] mx-auto flex items-center justify-between px-2 sm:px-4">
          {/* Left Column - Draggable Shapes */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {gameShapes.map((shape, index) => (
              <div
                key={shape.id}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 cursor-grab active:cursor-grabbing transition-transform duration-200 select-none",
                  shape.isDragging && "scale-110 z-10 rotate-3 fixed",
                  shape.isMatched && "cursor-default animate-celebration opacity-50"
                )}
                style={
                  shape.isDragging || shape.isMatched
                    ? {
                        left: shape.position.x,
                        top: shape.position.y,
                        touchAction: 'none',
                        position: 'absolute'
                      }
                    : { touchAction: 'none' }
                }
                onMouseDown={(e) => handleMouseDown(shape.id, e)}
                onTouchStart={(e) => handleTouchStart(shape.id, e)}
              >
                <ShapeCard
                  shape={shape}
                  className={cn(
                    "w-full h-full shadow-shape",
                    shape.isDragging && "shadow-lg ring-2 ring-accent",
                    shape.isMatched && "ring-2 ring-success"
                  )}
                  hideName={true}
                />
              </div>
            ))}
          </div>

          {/* Right Column - Drop Zones */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {dropZones.map((zone, index) => (
              <div
                key={zone.id}
                data-drop-zone={zone.id}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 border-3 border-dashed rounded-xl flex items-center justify-center transition-all duration-300",
                  zone.isOccupied 
                    ? "border-success bg-success/10" 
                    : "border-muted-foreground/50 bg-muted/30",
                  "hover:border-accent hover:bg-accent/10"
                )}
              >
                {!zone.isOccupied && (
                  <span className="text-xl sm:text-2xl opacity-40">{zone.shape.emoji}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Helper Text */}
      {gameShapes.length > 0 && matchedPairs === 0 && (
        <div className="text-center animate-fade-in-up px-2 flex-shrink-0" style={{ animationDelay: "0.6s" }}>
          <p className="text-[10px] sm:text-xs text-muted-foreground bg-white/80 px-3 py-1 rounded-full inline-block uppercase">
            👆 Arraste as formas coloridas para os contornos
          </p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex space-x-1.5 animate-fade-in-up flex-shrink-0" style={{ animationDelay: "0.8s" }}>
        {Array.from({ length: gameShapes.length }, (_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-colors duration-300",
              index < matchedPairs ? "bg-success" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Next Button */}
      {showCelebration && (
        <div className="animate-fade-in-up flex-shrink-0 pb-2">
          <button
            onClick={handleNext}
            className="animate-gentle-bounce hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={proximoDesafioBtn} 
              alt="Próximo Desafio"
              className="h-auto w-48 sm:w-56"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;