export type Discipline = "Língua Portuguesa" | "Matemática" | "Ciências" | "Todas";

export type ExamMode = "practice" | "simulated" | "custom_ai" | "mistakes_notebook";

export interface QuestionOption {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
}

export interface Question {
  id: string | number;
  originalNumber?: number;
  discipline: "Língua Portuguesa" | "Matemática" | "Ciências";
  subArea?: string; // e.g. "Física", "Química", "Biologia", "Gramática", "Geometria"
  topic: string;
  contextText?: string;
  source?: string;
  prompt: string;
  options: QuestionOption;
  correctOption: "a" | "b" | "c" | "d" | "e";
  explanation: string;
  difficulty?: "Fácil" | "Médio" | "Difícil";
  diagramType?: string; // id for custom SVG rendering if applicable
  tableData?: { headers: string[]; rows: string[][] };
  equation?: string;
  isAIGenerated?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string | number, "a" | "b" | "c" | "d" | "e">;
  answeredAt: Record<string | number, number>;
  bookmarked: Record<string | number, boolean>;
  isSubmitted: boolean;
  score: number;
  timeRemainingSeconds: number;
  mode: ExamMode;
}

export interface ExamHistoryItem {
  id: string;
  date: string;
  mode: ExamMode;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  disciplineBreakdown: Record<string, { correct: number; total: number }>;
}
