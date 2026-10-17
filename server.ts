import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint: Generate custom SENAI exam questions
app.post("/api/gemini/generate-questions", async (req, res) => {
  try {
    const { discipline = "Misto", topic = "", difficulty = "Médio", count = 3, referenceContext = "" } = req.body;

    const prompt = `Você é um elaborador sênior de provas oficiais do SENAI (Processo Seletivo Cursos de Aprendizagem Industrial - CGE).
Gere ${count} questão(ões) inédita(s) de múltipla escolha com exatamente 5 alternativas (a, b, c, d, e), no mesmo padrão exato da prova SENAI CGE 2233.
Parâmetros da geração:
- Disciplina: ${discipline} (Língua Portuguesa, Matemática ou Ciências)
${topic ? `- Tópico específico: ${topic}` : "- Tópico: Conforme a matriz curricular do processo seletivo SENAI"}
- Nível de dificuldade: ${difficulty}
${referenceContext ? `- Inspirar-se no tema/contexto: ${referenceContext}` : ""}

Diretrizes essenciais:
1. Para Língua Portuguesa: inclua um pequeno texto base realista (crônica, trecho de notícia, fábula ou poema curto) com fonte atribuída, e faça perguntas sobre interpretação, figuras de linguagem, concordância, crase, regência, classes de palavras ou pontuação.
2. Para Matemática: inclua situações cotidianas ou técnicas (frações, porcentagem, regra de três, teorema de tales, pitágoras, equações do 2º grau, áreas, escalas ou leitura de gráficos/tabelas).
3. Para Ciências: contextualize fenômenos físicos, químicos ou biológicos (eletricidade, estados da matéria, acústica, reações, ecossistema, corpo humano, termometria).
4. Todas as questões devem ter enunciados claros, 5 alternativas e exatamente 1 alternativa correta.
5. Forneça uma explicação pedagógica completa do porquê da alternativa correta.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um especialista em exames oficiais do SENAI e educação técnica profissional.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              discipline: {
                type: Type.STRING,
                description: "Língua Portuguesa, Matemática ou Ciências",
              },
              topic: {
                type: Type.STRING,
                description: "Assunto específico abordado",
              },
              contextText: {
                type: Type.STRING,
                description: "Texto-base de apoio, citação ou dados (se aplicável)",
              },
              prompt: {
                type: Type.STRING,
                description: "O enunciado da questão",
              },
              options: {
                type: Type.OBJECT,
                properties: {
                  a: { type: Type.STRING },
                  b: { type: Type.STRING },
                  c: { type: Type.STRING },
                  d: { type: Type.STRING },
                  e: { type: Type.STRING },
                },
                required: ["a", "b", "c", "d", "e"],
              },
              correctOption: {
                type: Type.STRING,
                description: "Letra da alternativa correta (a, b, c, d ou e)",
              },
              explanation: {
                type: Type.STRING,
                description: "Explicação pedagógica detalhada passo a passo da resolução",
              },
              difficulty: {
                type: Type.STRING,
                description: "Fácil, Médio ou Difícil",
              },
            },
            required: ["discipline", "topic", "prompt", "options", "correctOption", "explanation", "difficulty"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    const formatted = parsed.map((q: any, idx: number) => ({
      ...q,
      id: `ai-gen-${Date.now()}-${idx + 1}`,
      isAIGenerated: true,
    }));

    res.json({ questions: formatted });
  } catch (error: any) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: error?.message || "Falha ao gerar questões com IA." });
  }
});

// Endpoint: AI Tutor explains a question in depth
app.post("/api/gemini/explain-question", async (req, res) => {
  try {
    const { question, selectedOption } = req.body;

    const prompt = `Você é o Professor Tutor IA especializado na prova do SENAI CGE 2233.
O aluno está respondendo a seguinte questão:
Enunciado: ${question.prompt}
${question.contextText ? `Texto Base: ${question.contextText}` : ""}
Alternativas:
a) ${question.options.a}
b) ${question.options.b}
c) ${question.options.c}
d) ${question.options.d}
e) ${question.options.e}

Gabarito Oficial: ${question.correctOption.toUpperCase()}
Opção marcada pelo aluno: ${selectedOption ? selectedOption.toUpperCase() : "Nenhuma (pediu explicação direta)"}

Explique de maneira didática, empática e clara em português do Brasil:
1. Análise do Enunciado e Conceito Central
2. Resolução Passo a Passo que leva ao Gabarito (${question.correctOption.toUpperCase()})
3. Análise da alternativa assinalada pelo aluno (se errou, mostre a pegadinha ou onde ocorreu o equívoco; se acertou, parabenize e reforce o motivo)
4. Dica de Ouro do SENAI para não errar questões desse padrão no vestibular.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um professor tutor atencioso, claro e motivador para alunos prestando vestibulinho do SENAI.",
      },
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Error explaining question:", error);
    res.status(500).json({ error: error?.message || "Falha ao obter explicação com o Professor IA." });
  }
});

// Endpoint: AI provides a hint
app.post("/api/gemini/hint", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `Dê uma dica curta (2 a 4 frases) para guiar o aluno na resolução desta questão do SENAI, SEM REVELAR A RESPOSTA OU A LETRA:
Enunciado: ${question.prompt}
${question.contextText ? `Texto Base: ${question.contextText}` : ""}
Alternativa correta (segredo): ${question.correctOption}

Dica focada em relembrar a fórmula, conceito gramatical, regra física ou estratégia de raciocínio.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ hint: response.text });
  } catch (error: any) {
    console.error("Error generating hint:", error);
    res.status(500).json({ error: error?.message || "Falha ao obter dica da IA." });
  }
});

// Endpoint: Generate similar remediation question for a question missed
app.post("/api/gemini/generate-similar", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `Crie UMA questão inédita no formato SENAI CGE 2233 baseada no mesmo conceito e competência da questão a seguir:
Disciplina: ${question.discipline}
Tópico: ${question.topic || "Geral"}
Questão original: ${question.prompt}
Texto base original: ${question.contextText || "Nenhum"}

Gere uma nova questão alternativa com novos valores/novo texto, 5 alternativas (a, b, c, d, e), 1 correta e explicação completa.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            discipline: { type: Type.STRING },
            topic: { type: Type.STRING },
            contextText: { type: Type.STRING },
            prompt: { type: Type.STRING },
            options: {
              type: Type.OBJECT,
              properties: {
                a: { type: Type.STRING },
                b: { type: Type.STRING },
                c: { type: Type.STRING },
                d: { type: Type.STRING },
                e: { type: Type.STRING },
              },
              required: ["a", "b", "c", "d", "e"],
            },
            correctOption: { type: Type.STRING },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING },
          },
          required: ["discipline", "topic", "prompt", "options", "correctOption", "explanation", "difficulty"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const questionObj = {
      ...parsed,
      id: `ai-similar-${Date.now()}`,
      isAIGenerated: true,
    };

    res.json({ question: questionObj });
  } catch (error: any) {
    console.error("Error generating similar question:", error);
    res.status(500).json({ error: error?.message || "Falha ao gerar questão similar." });
  }
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const isProduction = process.env.NODE_ENV === "production";
const PORT = isProduction ? Number(process.env.PORT) || 8080 : 3000;

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProduction ? "production" : "development"})`);
  });
}

startServer();
