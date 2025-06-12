// Пример использования API для тестирования

// 1. Генерация вопросов
const generateQuestions = async () => {
  const response = await fetch('/api/test-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'generate_questions',
      data: {
        name: 'Техническое интервью для Python разработчика',
        objective: 'Оценка навыков Python и опыта работы с базами данных',
        number: 5,
        context: 'Кандидат на позицию Python разработчика с опытом работы с Django и PostgreSQL'
      }
    })
  });

  const result = await response.json();
  console.log('Сгенерированные вопросы:', result);
  return result;
};

// 2. Анализ коммуникации
const analyzeCommunication = async (transcript: string) => {
  const response = await fetch('/api/test-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'analyze_communication',
      data: {
        transcript: transcript
      }
    })
  });

  const result = await response.json();
  console.log('Анализ коммуникации:', result);
  return result;
};

// Пример использования
const test = async () => {
  // 1. Сначала генерируем вопросы
  const questions = await generateQuestions();
  
  // 2. Затем анализируем коммуникацию
  const transcript = `
    Интервьюер: Расскажите о вашем опыте работы с Python.
    Кандидат: Я работал с Python около 3 лет, в основном с Django и Flask.
    Интервьюер: Как вы решаете проблемы с производительностью в Django?
    Кандидат: Я использую профилирование, оптимизацию запросов и кэширование.
  `;
  
  const analysis = await analyzeCommunication(transcript);
};

// Запуск теста
test().catch(console.error); 
