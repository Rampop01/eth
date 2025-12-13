"use client"

import { cn } from "@/lib/utils"

interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizCardProps {
  question: Question
  questionNumber: number
  selectedAnswer: number
  onAnswer: (answerIndex: number) => void
}

export function QuizCard({ question, questionNumber, selectedAnswer, onAnswer }: QuizCardProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border-2 border-glow-amber/30 rounded-lg p-6 md:p-8 shadow-2xl">
      {/* Question number */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-glow-amber to-primary flex items-center justify-center shadow-lg shadow-glow-amber/50">
          <span className="font-[family-name:var(--font-cinzel-decorative)] text-2xl font-black text-primary-foreground">
            {questionNumber}
          </span>
        </div>
        <p className="font-[family-name:var(--font-cinzel)] text-sm text-muted-foreground">
          Question {questionNumber} of 10
        </p>
      </div>

      {/* Question text */}
      <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className={cn(
              "w-full text-left p-4 md:p-5 rounded-lg border-2 transition-all duration-200",
              "font-[family-name:var(--font-cinzel)] text-base md:text-lg",
              "hover:scale-[1.02] active:scale-[0.98]",
              selectedAnswer === index
                ? "bg-glow-amber/20 border-glow-amber text-foreground shadow-lg shadow-glow-amber/30"
                : "bg-secondary/50 border-border text-foreground/80 hover:border-glow-amber/50 hover:bg-secondary/70",
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-[family-name:var(--font-cinzel-decorative)] font-bold text-sm",
                  selectedAnswer === index ? "bg-glow-amber text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
