import { LLMEngine } from 'vllm';

// Конфигурация VLLM
export const vllmConfig = {
  model: "Qwen/Qwen-7B-Chat", // или другая версия Qwen
  tensor_parallel_size: 1, // количество GPU
  gpu_memory_utilization: 0.9, // использование GPU памяти
  max_num_batched_tokens: 4096, // максимальное количество токенов в батче
  max_num_seqs: 256, // максимальное количество последовательностей
  quantization: "awq", // тип квантизации (опционально)
};

// Инициализация VLLM
export const initializeVLLM = async () => {
  try {
    const llm = new LLMEngine(vllmConfig);
    await llm.initialize();
    return llm;
  } catch (error) {
    console.error("Error initializing VLLM:", error);
    throw error;
  }
};

// Функция для генерации ответов
export const generateWithVLLM = async (
  llm: LLMEngine,
  prompt: string,
  systemPrompt: string
) => {
  try {
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    const response = await llm.generate(fullPrompt, {
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95,
      stop: ["</s>", "Human:", "Assistant:"],
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating with VLLM:", error);
    throw error;
  }
}; 
