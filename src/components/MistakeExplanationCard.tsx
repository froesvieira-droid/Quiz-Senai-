import React, { useState } from "react";
import { Question } from "../types/quiz";
import { AlertCircle, CheckCircle2, Sparkles, BookOpen, HelpCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface MistakeExplanationCardProps {
  question: Question;
  selectedOption: "a" | "b" | "c" | "d" | "e" | null;
  onPracticeSimilar?: (newQuestion: Question) => void;
}

export const MistakeExplanationCard: React.FC<MistakeExplanationCardProps> = ({
  question,
  selectedOption,
  onPracticeSimilar,
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [similarError, setSimilarError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!selectedOption) return null;

  const isCorrect = selectedOption === question.correctOption;

  const handleAskAITutor = async () => {
    try {
      setLoadingAi(true);
      const res = await fetch("/api/gemini/explain-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          selectedOption,
        }),
      });

      if (!res.ok) throw new Error("Erro na resposta do servidor.");
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (err: any) {
      setAiExplanation("Não foi possível carregar a explicação da IA no momento: " + (err.message || "Erro de conexão"));
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGetHint = async () => {
    try {
      setLoadingAi(true);
      const res = await fetch("/api/gemini/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Erro ao obter dica.");
      const data = await res.json();
      setAiHint(data.hint);
    } catch (err: any) {
      setAiHint("Dica rápida: Releia atentamente os dados do enunciado e elimine alternativas com termos absolutos.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerateSimilar = async () => {
    if (!onPracticeSimilar) return;
    try {
      setLoadingSimilar(true);
      setSimilarError(null);
      const res = await fetch("/api/gemini/generate-similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Falha ao gerar questão similar.");
      const data = await res.json();
      if (data.question) {
        onPracticeSimilar(data.question);
      }
    } catch (err: any) {
      setSimilarError("Erro ao gerar questão parecida com IA. Tente novamente.");
    } finally {
      setLoadingSimilar(false);
    }
  };

  return (
    <div
      className={`mt-6 rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
        isCorrect
          ? "border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white"
          : "border-rose-300 bg-gradient-to-b from-rose-50/80 to-white ring-2 ring-rose-200/50"
      }`}
    >
      {/* Header Banner */}
      <div
        className={`px-5 py-3.5 flex items-center justify-between cursor-pointer border-b ${
          isCorrect ? "bg-emerald-100/60 border-emerald-200 text-emerald-900" : "bg-rose-100/80 border-rose-200 text-rose-950"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 animate-pulse" />
          )}
          <div>
            <h3 className="font-bold text-base leading-tight">
              {isCorrect ? "Parabéns! Você acertou a questão!" : "Ops! Você errou esta questão."}
            </h3>
            <p className="text-xs opacity-90">
              {isCorrect
                ? "Confira a justificativa oficial e reforce seu aprendizado."
                : "Veja abaixo a explicação completa em detalhes para entender onde você errou."}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-lg hover:bg-black/5 text-slate-700 transition"
          aria-label="Expandir ou recolher explicação"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-4 text-slate-800">
          {/* Comparison summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div
              className={`p-3 rounded-xl border ${
                isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider block text-slate-500 mb-1">
                Sua Resposta:
              </span>
              <div className="flex items-start gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                  }`}
                >
                  {selectedOption.toUpperCase()}
                </span>
                <span className="font-medium text-slate-800 line-clamp-2">
                  {question.options[selectedOption]}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider block text-emerald-700 mb-1">
                Gabarito Oficial SENAI:
              </span>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-emerald-600 text-white">
                  {question.correctOption.toUpperCase()}
                </span>
                <span className="font-medium text-slate-800 line-clamp-2">
                  {question.options[question.correctOption]}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed explanation */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Explicação Detalhada do Conteúdo:</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line font-normal">
              {question.explanation}
            </p>
          </div>

          {/* AI Hint if loaded */}
          {aiHint && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-sm text-amber-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Dica de Fixação do Professor IA:</span>
              </div>
              <p className="text-sm leading-relaxed">{aiHint}</p>
            </div>
          )}

          {/* AI Full Explanation if loaded */}
          {aiExplanation && (
            <div className="bg-blue-50/60 rounded-xl border border-blue-200 p-4 text-sm text-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Análise Completa do Professor Tutor IA (Gemini):</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line text-slate-700 font-normal">
                {aiExplanation}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            {!aiExplanation && (
              <button
                type="button"
                onClick={handleAskAITutor}
                disabled={loadingAi}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {loadingAi ? "Professor IA pensando..." : "Explicar Passo a Passo com Professor IA"}
              </button>
            )}

            {!aiHint && (
              <button
                type="button"
                onClick={handleGetHint}
                disabled={loadingAi}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition disabled:opacity-60 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Pedir Dica da IA
              </button>
            )}

            {onPracticeSimilar && !isCorrect && (
              <button
                type="button"
                onClick={handleGenerateSimilar}
                disabled={loadingSimilar}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition disabled:opacity-60 shadow-xs cursor-pointer ml-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSimilar ? "animate-spin" : ""}`} />
                {loadingSimilar ? "Criando questão similar..." : "Praticar Questão Similar Gerada por IA"}
              </button>
            )}
          </div>

          {similarError && <p className="text-xs text-rose-600">{similarError}</p>}
        </div>
      )}
    </div>
  );
};
