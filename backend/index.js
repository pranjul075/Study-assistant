import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all requests (since this is a public API without session cookies)
app.use(cors());

// Serve built frontend static files (production)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use(express.json());

// Helper function to sleep (to simulate network latency for loading states)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Pre-made rich mock data for key topics to make testing without API key incredibly realistic
const PREMADE_MOCKS = {
  photosynthesis: {
    topic: "Photosynthesis",
    summary: "Photosynthesis is the biological process by which green plants, algae, and some bacteria convert light energy, usually from the Sun, into chemical energy (glucose) using water and carbon dioxide, releasing oxygen as a byproduct.",
    flashcards: [
      { id: "fc1", question: "What is the primary pigment involved in photosynthesis?", answer: "Chlorophyll a, which absorbs light mostly in the blue-violet and red regions." },
      { id: "fc2", question: "Where do the light-dependent reactions take place?", answer: "In the thylakoid membranes of the chloroplasts." },
      { id: "fc3", question: "What are the main products of the light-dependent reactions?", answer: "ATP, NADPH, and Oxygen (O2) as a byproduct." },
      { id: "fc4", question: "Where does the Calvin Cycle (light-independent reactions) occur?", answer: "In the stroma of the chloroplast." },
      { id: "fc5", question: "What enzyme catalyzes the first step of carbon fixation in the Calvin Cycle?", answer: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase)." }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which of the following is NOT required for photosynthesis to occur?",
        options: ["Carbon dioxide", "Oxygen", "Water", "Light energy"],
        correctAnswerIndex: 1,
        explanation: "Oxygen is a byproduct (output) of photosynthesis, not a reactant. Carbon dioxide, water, and light energy are all necessary inputs."
      },
      {
        id: "q2",
        question: "During which phase of photosynthesis is water split (photolysis)?",
        options: ["Calvin Cycle", "Light-dependent reactions", "Glycolysis", "Krebs Cycle"],
        correctAnswerIndex: 1,
        explanation: "Water photolysis occurs in the thylakoid membrane during the light-dependent reactions to replace the electrons lost by Photosystem II."
      },
      {
        id: "q3",
        question: "What is the primary role of RuBisCO in the Calvin Cycle?",
        options: ["Splitting water molecules", "Absorbing light energy", "Fixing carbon dioxide onto RuBP", "Synthesizing ATP"],
        correctAnswerIndex: 2,
        explanation: "RuBisCO catalyzes carbon fixation, attaching carbon dioxide to the 5-carbon compound Ribulose bisphosphate (RuBP)."
      }
    ],
    checklist: [
      { id: "ch1", item: "Understand the differences between Light-Dependent and Light-Independent Reactions.", completed: false },
      { id: "ch2", item: "Memorize the chemical equation: 6CO2 + 6H2O + light -> C6H12O6 + 6O2", completed: false },
      { id: "ch3", item: "Trace the path of electrons from H2O to NADPH through Photosystems I & II.", completed: false }
    ]
  },
  react_hooks: {
    topic: "React Hooks",
    summary: "React Hooks are functions that let you 'hook into' React state and lifecycle features from function components. Introduced in React 16.8, they allow you to write components without using classes.",
    flashcards: [
      { id: "fc1", question: "What are the two main rules of React Hooks?", answer: "1. Only call hooks at the top level (not in loops or conditions). 2. Only call hooks from React function components or custom hooks." },
      { id: "fc2", question: "What hook would you use to cache the result of an expensive calculation?", answer: "useMemo. It returns a memoized value that only recalculates when dependencies change." },
      { id: "fc3", question: "What is the purpose of useEffect's cleanup function?", answer: "It runs before the component unmounts or before the effect runs again, letting you clean up subscriptions, timers, or event listeners to prevent memory leaks." },
      { id: "fc4", question: "How does useRef differ from useState?", answer: "Mutating the .current property of a ref does not trigger a re-render, whereas setting state via useState does." }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which hook should be used to perform side effects like fetching data or setting up event listeners?",
        options: ["useState", "useContext", "useEffect", "useCallback"],
        correctAnswerIndex: 2,
        explanation: "useEffect is specifically designed for side effects in React functional components."
      },
      {
        id: "q2",
        question: "What does calling a Hook inside an 'if' statement violate?",
        options: ["The Rule of Hooks: Only call hooks at the top level", "The Rule of Hooks: Only call hooks from React functions", "The Single Responsibility Principle", "The Virtual DOM lifecycle"],
        correctAnswerIndex: 0,
        explanation: "Hooks must be called at the top level of your React function, before any early returns, to ensure that they are called in the exact same order on every render."
      },
      {
        id: "q3",
        question: "Which of the following is true about useCallback?",
        options: ["It returns a memoized value", "It returns a memoized callback function", "It triggers a re-render on dependency change", "It is used to access the DOM directly"],
        correctAnswerIndex: 1,
        explanation: "useCallback returns a memoized version of the callback function itself, whereas useMemo returns a memoized value."
      }
    ],
    checklist: [
      { id: "ch1", item: "Master state hooks: useState and useReducer.", completed: false },
      { id: "ch2", item: "Understand dependency arrays in useEffect, useMemo, and useCallback.", completed: false },
      { id: "ch3", item: "Learn how to write custom hooks for stateful logic extraction.", completed: false }
    ]
  }
};

// Generates dynamic fallback data if user inputs a topic not in PREMADE_MOCKS
const generateDynamicMock = (promptText) => {
  const cleanPrompt = promptText.trim();
  const topicTitle = cleanPrompt.length > 30 ? cleanPrompt.substring(0, 30) + "..." : cleanPrompt;

  return {
    topic: topicTitle,
    summary: `This is a study set generated dynamically in Mock AI mode for your topic: "${cleanPrompt}". Set a valid GEMINI_API_KEY in backend/.env to unlock real AI generation.`,
    flashcards: [
      { id: "mfc1", question: `Key Term 1 about ${topicTitle}?`, answer: `This is the answer for Key Term 1. It is a mock definition.` },
      { id: "mfc2", question: `Key Term 2 about ${topicTitle}?`, answer: `This is the answer for Key Term 2. You can test card flipping and review status.` },
      { id: "mfc3", question: `Key Term 3 about ${topicTitle}?`, answer: `This is the answer for Key Term 3. Mark this as 'Mastered' to see metrics update!` }
    ],
    quiz: [
      {
        id: "mq1",
        question: `Question 1: What is the main characteristic of ${topicTitle}?`,
        options: ["Option A: The correct option", "Option B: Incorrect choice 1", "Option C: Incorrect choice 2", "Option D: Incorrect choice 3"],
        correctAnswerIndex: 0,
        explanation: `Option A is correct because this is a simulated explanation of ${topicTitle}.`
      },
      {
        id: "mq2",
        question: `Question 2: Which concept is crucial when studying ${topicTitle}?`,
        options: ["Option A: Irrelevant choice", "Option B: The correct choice", "Option C: Another incorrect choice", "Option D: Distractor"],
        correctAnswerIndex: 1,
        explanation: "Option B is correct. In Mock mode, this question illustrates how selection states change color and toggle explanations."
      }
    ],
    checklist: [
      { id: "mch1", item: `Review general definitions of ${topicTitle}.`, completed: false },
      { id: "mch2", item: `Take the mock quiz and re-test wrong answers.`, completed: false }
    ]
  };
};

const SYSTEM_INSTRUCTION = `
You are an expert AI Study Assistant.
You take notes or a topic and generate structured educational study content:
1. A summary of the topic.
2. An array of 4-6 flashcards containing a question and answer.
3. An array of 3-5 quiz questions with exactly 4 unique options, correctAnswerIndex (0-3), and detailed explanation.
4. An array of 3-5 checklist items (concepts/tasks to cover).

You MUST output valid, pure JSON matching this exact structure:
{
  "topic": "String title of the topic",
  "summary": "String concise explanation of the topic",
  "flashcards": [{ "question": "String question", "answer": "String answer" }],
  "quiz": [{ "question": "String question", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "correctAnswerIndex": 0, "explanation": "String explanation of the correct choice" }],
  "checklist": [{ "item": "String specific study item" }]
}
DO NOT wrap your response in markdown code blocks like \`\`\`json. Return ONLY the raw JSON string.
`;

app.get('/api/status', (req, res) => {
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here';
  const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_api_key_here';
  res.json({ 
    isMockMode: !hasGemini && !hasGroq,
    provider: hasGroq ? 'groq' : (hasGemini ? 'gemini' : 'mock')
  });
});

app.post('/api/generate', async (req, res) => {
  const { prompt, existingData, refinementFeedback } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here';
  const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_api_key_here';
  const isMockMode = !hasGemini && !hasGroq;

  // Handle Mock Mode
  if (isMockMode) {
    console.log(`[Mock Mode] Generating mock data for prompt: "${prompt}"`);
    await sleep(1500); // Simulate network delay

    // If refinement exists, modify mock slightly
    if (existingData && refinementFeedback) {
      const refinedData = JSON.parse(JSON.stringify(existingData));
      refinedData.summary = `[Refined based on: "${refinementFeedback}"]\n` + refinedData.summary;
      refinedData.checklist.unshift({
        id: `ref-${Date.now()}`,
        item: `Refined task: Address feedback "${refinementFeedback}"`,
        completed: false
      });
      return res.json(refinedData);
    }

    // Try to match premade topics
    const normalizedPrompt = prompt.toLowerCase();
    let mockResult;
    if (normalizedPrompt.includes('photo') || normalizedPrompt.includes('plant')) {
      mockResult = JSON.parse(JSON.stringify(PREMADE_MOCKS.photosynthesis));
    } else if (normalizedPrompt.includes('hook') || normalizedPrompt.includes('react')) {
      mockResult = JSON.parse(JSON.stringify(PREMADE_MOCKS.react_hooks));
    } else {
      mockResult = generateDynamicMock(prompt);
    }

    // Assign unique client-side IDs
    mockResult.flashcards = mockResult.flashcards.map((f, i) => ({ ...f, id: `fc-${Date.now()}-${i}`, status: 'new' }));
    mockResult.quiz = mockResult.quiz.map((q, i) => ({ ...q, id: `q-${Date.now()}-${i}` }));
    mockResult.checklist = mockResult.checklist.map((c, i) => ({ ...c, id: `ch-${Date.now()}-${i}`, completed: false }));

    return res.json(mockResult);
  }

  // Generate full prompt
  let fullPrompt = "";
  if (existingData && refinementFeedback) {
    // Refinement prompt engineering
    fullPrompt = `
Here is the existing study guide we generated:
${JSON.stringify(existingData, null, 2)}

The user wants to refine/modify this study guide with the following feedback:
"${refinementFeedback}"

Please update the study guide to incorporate this feedback. Keep unchanged components exactly as they were if they still apply, but modify, add, or delete cards, quiz questions, and checklists to reflect the request. Ensure the output format is identical.
`;
  } else {
    fullPrompt = `Please generate a study guide for the following text or topic: "${prompt}"`;
  }

  // Handle Real AI Generation
  try {
    let text = "";

    if (hasGroq) {
      console.log(`[Groq AI Mode] Generating study guide via llama-3.3-70b-versatile for: "${prompt}"`);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: fullPrompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API returned status ${response.status}: ${errText}`);
      }

      const resData = await response.json();
      text = resData.choices[0].message.content;
      console.log("Raw Groq API Output:", text);
    } else {
      console.log(`[Gemini AI Mode] Generating study guide via gemini-2.0-flash for: "${prompt}"`);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      text = response.response.text();
      console.log("Raw Gemini API Output:", text);
    }

    // Robust JSON parsing
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      const cleanedText = text
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();
      parsedData = JSON.parse(cleanedText);
    }

    // Shape validation
    if (!parsedData.topic || typeof parsedData.topic !== 'string') {
      parsedData.topic = prompt.substring(0, 30);
    }
    if (!parsedData.summary || typeof parsedData.summary !== 'string') {
      parsedData.summary = "Study guide generated for " + parsedData.topic;
    }
    if (!Array.isArray(parsedData.flashcards)) parsedData.flashcards = [];
    if (!Array.isArray(parsedData.quiz)) parsedData.quiz = [];
    if (!Array.isArray(parsedData.checklist)) parsedData.checklist = [];

    // Normalize with unique IDs and state fields
    parsedData.flashcards = parsedData.flashcards.map((f, i) => ({
      id: f.id || `fc-${Date.now()}-${i}`,
      question: f.question || "Empty Question",
      answer: f.answer || "Empty Answer",
      status: 'new'
    }));

    parsedData.quiz = parsedData.quiz.map((q, i) => ({
      id: q.id || `q-${Date.now()}-${i}`,
      question: q.question || "Empty Question",
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ["True", "False"],
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' && q.correctAnswerIndex >= 0 && q.correctAnswerIndex < (q.options?.length || 2) ? q.correctAnswerIndex : 0,
      explanation: q.explanation || "No explanation provided."
    }));

    parsedData.checklist = parsedData.checklist.map((c, i) => ({
      id: c.id || `ch-${Date.now()}-${i}`,
      item: c.item || "Review notes",
      completed: false
    }));

    res.json(parsedData);
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({
      error: "Failed to generate study guide. The AI service returned an error or malformed output.",
      details: err.message
    });
  }
});

// Catch-all: serve React app for any non-API route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here';
  const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_api_key_here';
  if (!hasGemini && !hasGroq) {
    console.warn("⚠️  Warning: Neither GEMINI_API_KEY nor GROQ_API_KEY is defined in the environment. Server is running in Mock Mode.");
  } else {
    console.log(`Server is running with ${hasGroq ? 'Groq (llama-3.3-70b-versatile)' : 'Gemini (gemini-2.0-flash)'} as the active AI provider.`);
  }
});
