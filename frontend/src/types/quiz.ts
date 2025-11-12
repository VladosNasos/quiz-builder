export interface Question {
  id?: number;
  type: 'boolean' | 'input' | 'checkbox';
  prompt: string;
  options?: unknown[];
  answers: unknown;
}

export interface Quiz {
  id?: number;
  title: string;
  questions?: Question[];
  questionCount?: number; // For list view
}
