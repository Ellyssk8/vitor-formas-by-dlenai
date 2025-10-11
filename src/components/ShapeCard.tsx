import React from "react";
import { cn } from "@/lib/utils";
import ShapeVisual from "./ShapeVisual";

interface ShapeCardProps {
  shape: GeometricShape;
  onClick?: () => void;
  isSelected?: boolean;
  showAnswer?: boolean;
  className?: string;
  animate?: boolean;
  hideName?: boolean;
}

export interface GeometricShape {
  id: string;
  name: string;
  color: string;
  sides: number;
  emoji: string;
  description: string;
}

const ShapeCard: React.FC<ShapeCardProps> = ({
  shape,
  onClick,
  isSelected = false,
  showAnswer = false,
  className,
  animate = false,
  hideName = false,
}) => {
  const bgColorMap: Record<string, string> = {
    "blue": "bg-gradient-to-br from-blue-400 to-blue-600",
    "green": "bg-gradient-to-br from-green-400 to-green-600",
    "red": "bg-gradient-to-br from-red-400 to-red-600",
    "orange": "bg-gradient-to-br from-orange-400 to-orange-600",
    "purple": "bg-gradient-to-br from-purple-400 to-purple-600",
    "yellow": "bg-gradient-to-br from-yellow-400 to-yellow-600",
    "turquoise": "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "pink": "bg-gradient-to-br from-pink-400 to-pink-600",
  };

  const bgColor = bgColorMap[shape.color] || "bg-gradient-to-br from-blue-400 to-blue-600";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-shape hover:shadow-lg",
        !hideName && bgColor,
        isSelected && "ring-4 ring-accent scale-105",
        showAnswer && "animate-celebration",
        animate && "animate-shape-dance",
        "hover:scale-105 active:scale-95",
        className
      )}
    >
      {/* Shape Visual */}
      <div className="mb-4 drop-shadow-lg">
        <ShapeVisual 
          shapeId={shape.id} 
          color={shape.color} 
          size="lg" 
          className="filter drop-shadow-md"
        />
      </div>
      
      {/* Shape Name */}
      {!hideName && (
        <h3 className="text-lg font-bold text-white text-center drop-shadow-md">
          {shape.name}
        </h3>
      )}
      
      {/* Sides Count (if showing answer) */}
      {showAnswer && (
        <p className="text-sm text-white/90 mt-1 font-medium">
          {shape.sides} lados
        </p>
      )}

      {/* Selection Ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl ring-4 ring-success animate-pulse-gentle" />
      )}
    </div>
  );
};

export default ShapeCard;