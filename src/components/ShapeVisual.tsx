import React from "react";
import { cn } from "@/lib/utils";

// Import shape images
import squareImg from "@/assets/shapes/square.png";
import circleImg from "@/assets/shapes/circle.png";
import triangleImg from "@/assets/shapes/triangle.png";
import rectangleImg from "@/assets/shapes/rectangle.png";
import pentagonImg from "@/assets/shapes/pentagon.png";
import hexagonImg from "@/assets/shapes/hexagon.png";
import octagonImg from "@/assets/shapes/octagon.png";
import diamondImg from "@/assets/shapes/diamond.png";
import ovalImg from "@/assets/shapes/oval.png";
import starImg from "@/assets/shapes/star.png";
import trapezoidImg from "@/assets/shapes/trapezoid.png";
import parallelogramImg from "@/assets/shapes/parallelogram.png";

interface ShapeVisualProps {
  shapeId: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ShapeVisual: React.FC<ShapeVisualProps> = ({
  shapeId,
  color,
  size = "md",
  className,
}) => {
  const sizeMap = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-40 h-40",
  };

  // Map shape IDs to imported images
  const shapeImages: Record<string, string> = {
    square: squareImg,
    circle: circleImg,
    triangle: triangleImg,
    rectangle: rectangleImg,
    pentagon: pentagonImg,
    hexagon: hexagonImg,
    octagon: octagonImg,
    diamond: diamondImg,
    oval: ovalImg,
    star: starImg,
    trapezoid: trapezoidImg,
    parallelogram: parallelogramImg,
  };

  const shapeImage = shapeImages[shapeId] || shapeImages.square;

  return (
    <div className="flex items-center justify-center">
      <img 
        src={shapeImage} 
        alt={shapeId}
        className={cn(sizeMap[size], "object-contain", className)}
      />
    </div>
  );
};

export default ShapeVisual;