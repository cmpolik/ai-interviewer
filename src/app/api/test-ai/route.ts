import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  SYSTEM_PROMPT as questionsSystemPrompt,
  generateQuestionsPrompt,
} from "@/lib/prompts/generate-questions";
import {
  SYSTEM_PROMPT as communicationSystemPrompt,
  getCommunicationAnalysisPrompt,
} from "@/lib/prompts/communication-analysis";
import { initializeVLLM, generateWithVLLM } from "./vllm-config";

// Инициализация VLLM при старте сервера
let vllmInstance: any = null;

const getVLLMInstance = async () => {
  if (!vllmInstance) {
    vllmInstance = await initializeVLLM();
  }
  return vllmInstance;
};

export async function POST(req: Request) {
  logger.info("test-ai request received");

  try {
    const body = await req.json();
    const { mode, data } = body;
    const llm = await getVLLMInstance();

    // Режим 1: Генерация вопросов
    if (mode === "generate_questions") {
      const prompt = generateQuestionsPrompt({
        name: data.name || "Тестовое интервью",
        objective: data.objective || "Оценка технических навыков",
        number: data.number || 5,
        context: data.context || "Техническое интервью для позиции разработчика"
      });

      const response = await generateWithVLLM(llm, prompt, questionsSystemPrompt);
      
      return NextResponse.json(
        { 
          mode: "generate_questions",
          response: JSON.parse(response)
        },
        { status: 200 }
      );
    }

    // Режим 2: Анализ коммуникации
    if (mode === "analyze_communication") {
      const prompt = getCommunicationAnalysisPrompt(data.transcript);
      
      const response = await generateWithVLLM(llm, prompt, communicationSystemPrompt);
      
      return NextResponse.json(
        { 
          mode: "analyze_communication",
          response: JSON.parse(response)
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid mode" },
      { status: 400 }
    );

  } catch (error) {
    logger.error("Error in test-ai endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
