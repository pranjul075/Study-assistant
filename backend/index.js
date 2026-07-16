import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const SYSTEM_INSTRUCTION = `
You are an expert AI Study Assistant.
You take notes or a topic and generate structured educational study content:
1. A summary of the topic.
2. An array of 4-6 flashcards containing a question and answer.
3. An array of 3-5 quiz questions with exactly 4 options, correctAnswerIndex (0-3), and explanation.
4. An array of 3-5 checklist items (concepts/tasks to cover).

You MUST output valid, pure JSON matching this exact structure:
{
  "topic": "String",
  "summary": "String",
  "flashcards": [{ "question": "String", "answer": "String" }],
  "quiz": [{ "question": "String", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "String" }],
  "checklist": [{ "item": "String" }]
}
DO NOT wrap in markdown. Return ONLY raw JSON.
`;

app.get('/api/status', (req, res) => {
  const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here';
  res.json({ isMockMode: isMock });
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Generate a study guide for: "${prompt}"` }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    const text = response.response.text();
    const parsedData = JSON.parse(text);

    // Validate shape - assign IDs
    parsedData.flashcards = (parsedData.flashcards || []).map((f, i) => ({
      id: `fc-${Date.now()}-${i}`, question: f.question || '', answer: f.answer || '', status: 'new'
    }));
    parsedData.quiz = (parsedData.quiz || []).map((q, i) => ({
      id: `q-${Date.now()}-${i}`, question: q.question || '', options: q.options || [],
      correctAnswerIndex: q.correctAnswerIndex ?? 0, explanation: q.explanation || ''
    }));
    parsedData.checklist = (parsedData.checklist || []).map((c, i) => ({
      id: `ch-${Date.now()}-${i}`, item: c.item || '', completed: false
    }));

    res.json(parsedData);
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Failed to generate study guide.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
