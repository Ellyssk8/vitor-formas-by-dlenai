import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Game-specific colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        "play-button": {
          DEFAULT: "hsl(var(--play-button))",
          foreground: "hsl(var(--play-button-foreground))",
        },
        // Shape colors for the geometric forms
        shape: {
          pink: "hsl(var(--shape-pink))",
          purple: "hsl(var(--shape-purple))",
          green: "hsl(var(--shape-green))",
          red: "hsl(var(--shape-red))",
          turquoise: "hsl(var(--shape-turquoise))",
          orange: "hsl(var(--shape-orange))",
          blue: "hsl(var(--shape-blue))",
          yellow: "hsl(var(--shape-yellow))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Existing accordion animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Game-specific animations
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "shape-dance": {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "25%": { transform: "rotate(-5deg) scale(1.05)" },
          "75%": { transform: "rotate(5deg) scale(1.05)" },
        },
        "celebration": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.1) rotate(-5deg)" },
          "50%": { transform: "scale(1.2) rotate(5deg)" },
          "75%": { transform: "scale(1.1) rotate(-2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gentle": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.02)", opacity: "0.9" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gentle-bounce": "gentle-bounce 1s ease-in-out infinite",
        "shape-dance": "shape-dance 0.8s ease-in-out",
        "celebration": "celebration 0.6s ease-in-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
      },
      boxShadow: {
        game: "var(--game-shadow)",
        shape: "var(--shape-shadow)",
        "play-button": "var(--button-shadow)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
