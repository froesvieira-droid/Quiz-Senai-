import React, { useState } from "react";
import { Question } from "../types/quiz";
import { Sparkles, X, Wand2, BookOpen, Layers, Check, AlertCircle } from "lucide-react";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: Question[], mode: "replace" | "append") => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onQuestionsGenerated,
}) => {
  const [discipline, setDiscipline] = useState<"Língua Portuguesa" | "Matemática" | "Ciências" | "Misto">("Misto");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Fácil" | "Médio" | "Difícil">("Médio");
  const [count, setCount] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickTopics: Record<string, string[]> = {
    "Língua Portuguesa": [
      "Crase e Regência",
      "Interpretação de Texto e Crônica",
      "Vozes Verbais e Sintaxe",
      "Figuras de Linguagem e Metáfora",
      "Pontuação e Uso da Vírgula",
    ],
    "Matemática": [
      "Frações e Porcentagem",
      "Teorema de Tales e Pitágoras",
      "Equação do 2º Grau e Bhaskara",
      "Geometria Plana e Áreas",
      "Razão, Proporção e Regra de Três",
    ],
    "Ciências": [
      "Reações Químicas e Substâncias",
      "Eletricidade e Circuitos",
      "Ondulatória e Acústica",
      "Fisiologia Humana e Sistema Urinário/Cardíaco",
      "Termometria e Pressão",
    ],
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discipline,
          topic,
          difficulty,
          count,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Falha na geração via Gemini API");
      }

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Nenhuma questão foi retornada pela IA.");
      }

      onQuestionsGenerated(data.questions, "replace");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar perguntas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Gerador de Questões IA</h3>
              <p className="text-xs text-blue-100">Criar simulados sob medida no padrão SENAI CGE 2233</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Discipline Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Disciplina:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["Misto", "Língua Portuguesa", "Matemática", "Ciências"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDiscipline(d);
                    setTopic("");
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                    discipline === d
                      ? "border-blue-600 bg-blue-50 text-blue-800 shadow-xs ring-1 ring-blue-600"
                      : "border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Topics */}
          {discipline !== "Misto" && quickTopics[discipline] && (
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-1.5">
                Sugestões de tópicos frequentes na prova:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickTopics[discipline].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      topic === t
                        ? "bg-blue-600 text-white border-blue-600 font-medium"
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tópico ou Conteúdo Específico (Opcional):
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Teorema de Pitágoras, Crase, Eletricidade, etc."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dificuldade:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Fácil", "Médio", "Difícil"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      difficulty === diff
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quantidade de Questões:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 3, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      count === num
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {num} {num === 1 ? "Questão" : "Questões"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>Gerando com Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Gerar Questões com IA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
