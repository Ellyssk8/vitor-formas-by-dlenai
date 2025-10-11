import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gameButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        play: "bg-play-button text-play-button-foreground hover:bg-play-button/90 shadow-play-button hover:shadow-none transform hover:scale-105 transition-all duration-200",
        shape: "bg-card text-card-foreground border-2 border-border hover:bg-muted/50 hover:scale-105 transition-all duration-200",
        success: "bg-success text-success-foreground hover:bg-success/90 animate-celebration",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        mute: "bg-muted text-muted-foreground hover:bg-muted/80 rounded-full w-12 h-12 p-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-16 rounded-lg px-12 text-lg font-bold",
        icon: "h-10 w-10",
        "game-large": "h-20 w-48 rounded-2xl text-xl font-bold",
        "shape-answer": "h-24 w-32 rounded-xl text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {
  asChild?: boolean;
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(gameButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GameButton.displayName = "GameButton";

export { GameButton, gameButtonVariants };