'use client';

import { useEffect, useState } from 'react';
import type { Quiz } from '@/types/quiz';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('http://localhost:4000/quizzes');
      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/quizzes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from UI immediately
        setQuizzes(quizzes.filter(q => q.id !== id));
      } else {
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10 animate-slide-down">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
              Quiz Collection
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Manage and explore all your quizzes in one place
            </p>
          </div>
          <a
            href="/create"
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-500 dark:hover:to-pink-500 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105 text-center overflow-hidden"
          >
            <span className="relative z-10">+ Create New Quiz</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-500 dark:to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Quiz List */}
        {!loading && (
          <ul className="space-y-5">
            {quizzes.length === 0 && (
              <li className="text-center py-16 animate-fade-in">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No quizzes yet. Create your first one to get started!
                </p>
              </li>
            )}
            {quizzes.map((q, idx) => (
              <li
                key={q.id}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-600 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex-1">
                  <a
                    href={`/quizzes/${q.id}`}
                    className="block text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-1"
                  >
                    {q.title}
                  </a>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{q.questionCount} questions</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/quizzes/${q.id}`}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 hover:from-purple-500 hover:to-pink-500 dark:hover:from-purple-400 dark:hover:to-pink-400 text-white rounded-xl px-6 py-2.5 font-semibold shadow-lg transition-all duration-300 group-hover:scale-105 text-center"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() => handleDelete(q.id!, q.title)}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-rose-500 hover:to-red-500 text-white rounded-xl px-4 py-2.5 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                    title="Delete quiz"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
