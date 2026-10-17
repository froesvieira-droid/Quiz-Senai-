import React from "react";
import { Question } from "../types/quiz";
import { X, Bookmark, CheckCircle2, XCircle } from "lucide-react";

interface GabaritoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  selectedAnswers: Record<string | number, "a" | "b" | "c" | "d" | "e">;
  bookmarked: Record<string | number, boolean>;
}

export const GabaritoDrawer: React.FC<GabaritoDrawerProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  onSelectQuestion,
  selectedAnswers,
  bookmarked,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Cartão de Respostas & Navegação</h3>
            <p className="text-xs text-slate-500">
              {Object.keys(selectedAnswers).length} de {questions.length} respondidas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-4 text-xs font-medium text-slate-600 bg-white">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shrink-0"></span>
            <span>Acerto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shrink-0"></span>
            <span>Erro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300 shrink-0"></span>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Marcada</span>
          </div>
        </div>

        {/* Grid of question buttons */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
            {questions.map((q, idx) => {
              const answer = selectedAnswers[q.id];
              const isAnswered = answer !== undefined;
              const isCorrect = isAnswered && answer === q.correctOption;
              const isCurrent = idx === currentIndex;
              const isMarked = bookmarked[q.id];

              let bgClass = "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
              if (isAnswered) {
                if (isCorrect) {
                  bgClass = "bg-emerald-600 text-white border-emerald-600 shadow-xs";
                } else {
                  bgClass = "bg-rose-600 text-white border-rose-600 shadow-xs";
                }
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  className={`relative flex flex-col items-center justify-center h-12 rounded-xl text-sm font-bold border transition active:scale-95 cursor-pointer ${bgClass} ${
                    isCurrent ? "ring-2 ring-blue-500 ring-offset-2" : ""
                  }`}
                >
                  <span>{q.originalNumber || idx + 1}</span>
                  {answer && (
                    <span className="text-[10px] uppercase font-semibold opacity-90 -mt-0.5">
                      {answer}
                    </span>
                  )}
                  {isMarked && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-900 transition cursor-pointer"
          >
            Continuar Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
