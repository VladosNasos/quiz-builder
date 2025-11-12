import { Quiz } from "@/types/quiz";

export async function getQuizzes(): Promise<Quiz[]> {
  const res = await fetch('http://localhost:4000/quizzes');
  return await res.json();
}
