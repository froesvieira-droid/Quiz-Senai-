import React, { useState, useEffect, useMemo } from "react";
import { SENAI_QUESTIONS } from "./data/senaiQuestions";
import { Question, ExamMode, Discipline } from "./types/quiz";
import { DiagramRenderer } from "./components/DiagramRenderer";
import { MistakeExplanationCard } from "./components/MistakeExplanationCard";
import { GabaritoDrawer } from "./components/GabaritoDrawer";
import { AIGeneratorModal } from "./components/AIGeneratorModal";
import { ResultScreen } from "./components/ResultScreen";
import {
  BookOpen,
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ListOrdered,
  Layers,
  GraduationCap,
  Award,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export default function App() {
  // Question pool and filtering
  const [allQuestions, setAllQuestions] = useState<Question[]>(SENAI_QUESTIONS);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("Todas");
  const [examMode, setExamMode] = useState<ExamMode>("practice"); // "practice" = immediate feedback; "simulated" = exam mode

  // Navigation and answer states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string | number, "a" | "b" | "c" | "d" | "e">>({});
  const [bookmarked, setBookmarked] = useState<Record<string | number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mistakes tracker for "Caderno de Erros"
  const [mistakesList, setMistakesList] = useState<Question[]>([]);

  // Modals & Drawers
  const [isGabaritoOpen, setIsGabaritoOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  // Timer for simulated exam
  const [timerSeconds, setTimerSeconds] = useState(60 * 60); // 60 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Active question list according to filter and mode
  const activeQuestions = useMemo(() => {
    let list = allQuestions;
    if (examMode === "mistakes_notebook") {
      return mistakesList.length > 0 ? mistakesList : allQuestions;
    }
    if (selectedDiscipline !== "Todas") {
      list = list.filter((q) => q.discipline === selectedDiscipline);
    }
    return list;
  }, [allQuestions, selectedDiscipline, examMode, mistakesList]);

  // Current question safety
  const currentQuestion: Question | undefined = activeQuestions[currentIndex] || activeQuestions[0];

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !isSubmitted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsSubmitted(true);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted, timerSeconds]);

  // Track mistakes whenever user answers
  const handleSelectOption = (option: "a" | "b" | "c" | "d" | "e") => {
    if (!currentQuestion) return;

    // Record answer
    const newAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: option,
    };
    setSelectedAnswers(newAnswers);

    // If incorrect, add to mistakes list if not already there
    if (option !== currentQuestion.correctOption) {
      setMistakesList((prev) => {
        if (!prev.some((item) => item.id === currentQuestion.id)) {
          return [...prev, currentQuestion];
        }
        return prev;
      });
    }
  };

  const toggleBookmark = (qId: string | number) => {
    setBookmarked((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setTimerSeconds(60 * 60);
    setTimerActive(examMode === "simulated");
  };

  const handleStartMistakesNotebook = () => {
    if (mistakesList.length === 0) {
      alert("Você ainda não tem erros registrados! Continue praticando.");
      return;
    }
    setExamMode("mistakes_notebook");
    setSelectedDiscipline("Todas");
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  const handleQuestionsGenerated = (newQuestions: Question[], mode: "replace" | "append") => {
    if (mode === "replace") {
      setAllQuestions(newQuestions);
      setSelectedDiscipline("Todas");
      setExamMode("practice");
      setSelectedAnswers({});
      setCurrentIndex(0);
      setIsSubmitted(false);
    } else {
      setAllQuestions((prev) => [...prev, ...newQuestions]);
    }
  };

  const handlePracticeSimilar = (newQuestion: Question) => {
    // Insert new similar question right after current question
    setAllQuestions((prev) => {
      const copy = [...prev];
      copy.splice(currentIndex + 1, 0, newQuestion);
      return copy;
    });
    // Move to that question
    setCurrentIndex((prev) => prev + 1);
  };

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : null;
  const isAnswered = selectedAnswer !== null && selectedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-xl tracking-tighter">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">SENAI</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                  CGE 2233
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Aprendizagem Industrial • 2º Semestre</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setExamMode("practice");
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                examMode === "practice"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Treino (Explicação Imediata)
            </button>
            <button
              type="button"
              onClick={() => {
                setExamMode("simulated");
                setTimerActive(true);
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                examMode === "simulated"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-blue-600" />
              Simulado Oficial
            </button>
            <button
              type="button"
              onClick={handleStartMistakesNotebook}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                examMode === "mistakes_notebook"
                  ? "bg-white text-rose-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Caderno de Erros ({mistakesList.length})
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* AI Generator CTA button */}
            <button
              type="button"
              onClick={() => setIsAIGeneratorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Gerar com</span> IA
            </button>

            {/* Gabarito Drawer toggle */}
            <button
              type="button"
              onClick={() => setIsGabaritoOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition cursor-pointer"
            >
              <ListOrdered className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Gabarito</span>
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-800">
                {Object.keys(selectedAnswers).length}
              </span>
            </button>
          </div>
        </div>

        {/* Subheader: Discipline Filter Tabs */}
        {!isSubmitted && examMode !== "mistakes_notebook" && (
          <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-2 overflow-x-auto">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mr-1">
                  Filtrar por:
                </span>
                {(["Todas", "Língua Portuguesa", "Matemática", "Ciências"] as const).map((disc) => (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => {
                      setSelectedDiscipline(disc);
                      setCurrentIndex(0);
                    }}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      selectedDiscipline === disc
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>

              {examMode === "simulated" && (
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-100/70 px-3 py-1 rounded-full shrink-0">
                  <Timer className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formatTime(timerSeconds)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isSubmitted ? (
          <ResultScreen
            questions={activeQuestions}
            selectedAnswers={selectedAnswers}
            onRestart={handleRestart}
            onPracticeMistakes={handleStartMistakesNotebook}
            onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
          />
        ) : currentQuestion ? (
          <div className="space-y-6">
            {/* Progress & Question Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  Questão {currentQuestion.originalNumber || currentIndex + 1}
                </span>
                <span className="text-xs text-slate-400 font-medium">de {activeQuestions.length}</span>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    currentQuestion.discipline === "Língua Portuguesa"
                      ? "bg-purple-100 text-purple-800"
                      : currentQuestion.discipline === "Matemática"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {currentQuestion.discipline}
                </span>

                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                  {currentQuestion.topic}
                </span>

                {currentQuestion.isAIGenerated && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Gerada por IA
                  </span>
                )}
              </div>

              {/* Bookmark button */}
              <button
                type="button"
                onClick={() => toggleBookmark(currentQuestion.id)}
                className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  bookmarked[currentQuestion.id]
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${bookmarked[currentQuestion.id] ? "fill-amber-500 text-amber-500" : ""}`}
                />
                <span className="hidden sm:inline">
                  {bookmarked[currentQuestion.id] ? "Marcada" : "Marcar para Revisão"}
                </span>
              </button>
            </div>

            {/* Question Card */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Context text if available */}
              {currentQuestion.contextText && (
                <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Texto de Apoio:</span>
                  </div>
                  <div className="text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line font-serif italic pl-2 border-l-2 border-blue-400">
                    {currentQuestion.contextText}
                  </div>
                  {currentQuestion.source && (
                    <div className="text-[11px] text-slate-400 text-right font-medium">
                      {currentQuestion.source}
                    </div>
                  )}
                </div>
              )}

              {/* Visual Diagram if available */}
              <DiagramRenderer
                type={currentQuestion.diagramType}
                equation={currentQuestion.equation}
                tableData={currentQuestion.tableData}
              />

              {/* Question Prompt */}
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.prompt}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {(["a", "b", "c", "d", "e"] as const).map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = currentQuestion.correctOption === opt;
                  const showFeedback = examMode === "practice" && isAnswered;

                  let buttonStyle = "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-slate-700";

                  if (showFeedback) {
                    if (isCorrect) {
                      buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 shadow-xs font-semibold";
                    } else if (isSelected) {
                      buttonStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30 shadow-xs font-semibold";
                    } else {
                      buttonStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-70";
                    }
                  } else if (isSelected) {
                    buttonStyle = "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/40 font-semibold shadow-xs";
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer active:scale-[0.99] ${buttonStyle}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 mt-0.5 transition ${
                          showFeedback && isCorrect
                            ? "bg-emerald-600 text-white"
                            : showFeedback && isSelected
                            ? "bg-rose-600 text-white"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt}
                      </div>
                      <div className="text-sm sm:text-base leading-normal flex-1">
                        {currentQuestion.options[opt]}
                      </div>
                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* DETAILED EXPLANATION CARD (User Requirement: "Quando eu erra a resposta explica a questão com detalhes.") */}
              {examMode === "practice" && isAnswered && (
                <MistakeExplanationCard
                  question={currentQuestion}
                  selectedOption={selectedAnswer}
                  onPracticeSimilar={handlePracticeSimilar}
                />
              )}
            </div>

            {/* Bottom Navigation controls */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <div className="text-xs font-semibold text-slate-500">
                {currentIndex + 1} de {activeQuestions.length}
              </div>

              {currentIndex < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  Finalizar & Ver Resultado
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <GraduationCap className="w-16 h-16 text-blue-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">Nenhuma questão encontrada</h3>
            <p className="text-sm text-slate-500">
              Alterne a disciplina selecionada ou crie novas questões com o Gerador de Inteligência Artificial.
            </p>
            <button
              type="button"
              onClick={() => {
                setAllQuestions(SENAI_QUESTIONS);
                setSelectedDiscipline("Todas");
                setExamMode("practice");
                setCurrentIndex(0);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
            >
              Restaurar Prova Completa SENAI (60 Questões)
            </button>
          </div>
        )}
      </main>

      {/* Floating Gabarito Drawer */}
      <GabaritoDrawer
        isOpen={isGabaritoOpen}
        onClose={() => setIsGabaritoOpen(false)}
        questions={activeQuestions}
        currentIndex={currentIndex}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
        selectedAnswers={selectedAnswers}
        bookmarked={bookmarked}
      />

      {/* AI Question Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onQuestionsGenerated={handleQuestionsGenerated}
      />
    </div>
  );
}
