import React, { useState } from "react";
import { Question } from "../types/quiz";
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, BookOpen, ChevronDown, ChevronUp, Filter, AlertTriangle } from "lucide-react";

interface ResultScreenProps {
  questions: Question[];
  selectedAnswers: Record<string | number, "a" | "b" | "c" | "d" | "e">;
  onRestart: () => void;
  onPracticeMistakes: () => void;
  onOpenAIGenerator: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  selectedAnswers,
  onRestart,
  onPracticeMistakes,
  onOpenAIGenerator,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "wrong" | "correct">("wrong");
  const [expandedQuestion, setExpandedQuestion] = useState<string | number | null>(null);

  // Stats calculation
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  const subjectStats: Record<string, { total: number; correct: number }> = {
    "Língua Portuguesa": { total: 0, correct: 0 },
    "Matemática": { total: 0, correct: 0 },
    "Ciências": { total: 0, correct: 0 },
  };

  questions.forEach((q) => {
    const discipline = q.discipline || "Geral";
    if (!subjectStats[discipline]) {
      subjectStats[discipline] = { total: 0, correct: 0 };
    }
    subjectStats[discipline].total++;

    const ans = selectedAnswers[q.id];
    if (!ans) {
      unansweredCount++;
    } else if (ans === q.correctOption) {
      correctCount++;
      subjectStats[discipline].correct++;
    } else {
      wrongCount++;
    }
  });

  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  const filteredQuestions = questions.filter((q) => {
    const ans = selectedAnswers[q.id];
    if (filterMode === "wrong") return ans !== q.correctOption;
    if (filterMode === "correct") return ans === q.correctOption;
    return true;
  });

  const hasMistakes = wrongCount > 0 || unansweredCount > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Resultado Oficial do Simulado
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {percentage >= 70 ? "Excelente Desempenho!" : percentage >= 50 ? "Bom Progresso!" : "Precisa de Reforço!"}
            </h1>
            <p className="text-slate-300 text-sm max-w-lg">
              {percentage >= 70
                ? "Você atingiu pontuação compatível com aprovação nas melhores vagas do SENAI Aprendizagem Industrial!"
                : "Revise com atenção as questões que você errou abaixo. A inteligência artificial preparou explicações detalhadas para cada uma delas."}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[150px]">
            <span className="text-4xl sm:text-5xl font-black text-amber-400">{percentage}%</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 mt-1">
              {correctCount} de {total} Acertos
            </span>
          </div>
        </div>

        {/* Subjects breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-6 border-t border-white/10">
          {Object.entries(subjectStats).map(([subj, data]) => {
            const subjPercent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={subj} className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-slate-200">{subj}</span>
                  <span className="text-amber-300 font-bold">{subjPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      subjPercent >= 70 ? "bg-emerald-400" : subjPercent >= 50 ? "bg-amber-400" : "bg-rose-400"
                    }`}
                    style={{ width: `${subjPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {data.correct} de {data.total} questões certas
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Refazer Simulado
          </button>

          {hasMistakes && (
            <button
              type="button"
              onClick={onPracticeMistakes}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              Treinar Apenas as Questões que Errei ({wrongCount + unansweredCount})
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenAIGenerator}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer ml-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Gerar Novas Questões com IA
        </button>
      </div>

      {/* Review Questions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Revisão Detalhada das Questões</h2>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setFilterMode("wrong")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === "wrong" ? "bg-white text-rose-600 shadow-xs font-bold" : "hover:text-slate-900"
              }`}
            >
              Apenas Onde Errei ({wrongCount + unansweredCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("correct")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === "correct" ? "bg-white text-emerald-600 shadow-xs font-bold" : "hover:text-slate-900"
              }`}
            >
              Acertos ({correctCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === "all" ? "bg-white text-blue-600 shadow-xs font-bold" : "hover:text-slate-900"
              }`}
            >
              Todas ({total})
            </button>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Nenhuma questão para exibir neste filtro!</h3>
            <p className="text-xs text-slate-500 mt-1">
              {filterMode === "wrong"
                ? "Sensacional! Você não errou nenhuma questão filtrada."
                : "Alterne os filtros acima para conferir as questões."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const ans = selectedAnswers[q.id];
              const isCorrect = ans === q.correctOption;
              const isExpanded = expandedQuestion === q.id;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border bg-white transition shadow-xs overflow-hidden ${
                    isCorrect ? "border-emerald-200" : "border-rose-200 ring-1 ring-rose-200"
                  }`}
                >
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-800">
                            Questão {q.originalNumber || q.id}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                            {q.discipline}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700">
                            {q.topic}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">
                          {q.prompt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs">
                        <span className="text-slate-500 block">Sua: {ans ? ans.toUpperCase() : "Em branco"}</span>
                        <span className="font-bold text-emerald-600 block">
                          Correta: {q.correctOption.toUpperCase()}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50">
                      {q.contextText && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 whitespace-pre-line font-mono max-h-48 overflow-y-auto">
                          {q.contextText}
                        </div>
                      )}

                      {/* Alternatives list */}
                      <div className="space-y-1.5 text-xs">
                        {(["a", "b", "c", "d", "e"] as const).map((opt) => {
                          const isSelected = ans === opt;
                          const isOptionCorrect = q.correctOption === opt;

                          let rowClass = "border-slate-200 bg-white text-slate-700";
                          if (isOptionCorrect) {
                            rowClass = "border-emerald-300 bg-emerald-50 text-emerald-900 font-bold";
                          } else if (isSelected) {
                            rowClass = "border-rose-300 bg-rose-50 text-rose-900 font-medium";
                          }

                          return (
                            <div
                              key={opt}
                              className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${rowClass}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold uppercase text-[10px] shrink-0 ${
                                  isOptionCorrect
                                    ? "bg-emerald-600 text-white"
                                    : isSelected
                                    ? "bg-rose-600 text-white"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {opt}
                              </span>
                              <span>{q.options[opt]}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-800 space-y-1">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          Explicação Detalhada:
                        </span>
                        <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
