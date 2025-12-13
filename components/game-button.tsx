import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary"
}

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, size = "md", variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-[family-name:var(--font-cinzel-decorative)] font-bold uppercase tracking-wider",
          "relative overflow-hidden transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transform hover:scale-105 active:scale-95",
          variant === "primary" && [
            "bg-gradient-to-r from-glow-amber via-primary to-glow-amber",
            "text-primary-foreground",
            "shadow-lg shadow-glow-amber/50",
            "hover:shadow-xl hover:shadow-glow-amber/70",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
            "before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
            "animate-glow-pulse",
          ],
          variant === "secondary" && [
            "bg-secondary border-2 border-border",
            "text-secondary-foreground",
            "hover:bg-secondary/80 hover:border-glow-cyan/50",
          ],
          size === "sm" && "px-4 py-2 text-sm rounded-md",
          size === "md" && "px-6 py-3 text-base rounded-lg",
          size === "lg" && "px-8 py-4 text-lg rounded-xl",
          className,
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    )
  },
)

GameButton.displayName = "GameButton"
