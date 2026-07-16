export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  status: 'new' | 'review' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  completed: boolean;
}

export interface StudySession {
  id: string;
  topic: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  checklist: ChecklistItem[];
  createdAt: string;
}
