'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Quiz, Question } from '@/types/quiz';

export default function QuizDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    fetch(`http://localhost:4000/quizzes/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Quiz not found');
        }
        return res.json();
      })
      .then(data => {
        setQuiz(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching quiz:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!quiz?.id) return;
    
    if (!confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/quizzes/${quiz.id}`, {
        method: 'DELETE',
      });

      if (res.ok || res.status === 204) {
        window.location.href = '/quizzes';
      } else if (res.status === 404) {
        alert('Quiz not found. It may have already been deleted.');
        window.location.href = '/quizzes';
      } else {
        alert('Failed to delete quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-purple-600 dark:text-purple-400 text-xl font-semibold">
            Loading quiz...
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-red-600 dark:text-red-400 text-xl font-semibold mb-4">
            {error || 'Quiz not found'}
          </div>
          <a
            href="/quizzes"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >
            ← Back to Quizzes
          </a>
        </div>
      </div>
    );
  }

  const renderQuestionDetails = (q: Question) => {
    switch (q.type) {
      case 'boolean':
        return (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Options:</span>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                  True
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                  False
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Correct Answer:</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-bold">
                {String(q.answers)}
              </span>
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Correct Answer:</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-bold">
                {String(q.answers)}
              </span>
            </div>
          </div>
        );

      case 'checkbox':
        const options = (q.options as string[]) || [];
        const correctAnswers = (q.answers as string[]) || [];
        return (
          <div className="mt-3 space-y-2">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Options:
            </div>
            <div className="space-y-1">
              {options.map((option, idx) => {
                const isCorrect = correctAnswers.includes(option);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      isCorrect
                        ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCorrect}
                      disabled
                      className="w-4 h-4"
                    />
                    <span className={`text-sm font-medium ${
                      isCorrect
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option}
                    </span>
                    {isCorrect && (
                      <span className="ml-auto text-xs font-bold text-green-700 dark:text-green-300">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 animate-zoom-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {quiz.questions?.length || 0} questions in this quiz
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-110"
            onClick={handleDelete}
          >
            🗑️ Delete Quiz
          </button>
        </div>

        {/* Questions List */}
        {quiz.questions && quiz.questions.length > 0 ? (
          <ul className="space-y-6">
            {quiz.questions.map((q, i) => (
              <li
                key={i}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-l-4 border-purple-500 rounded-lg p-5 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                        Question {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        {q.type === 'boolean' ? 'True/False' : q.type === 'input' ? 'Text Answer' : 'Multiple Choice'}
                      </span>
                    </div>
                    <div className="text-blue-900 dark:text-blue-300 text-lg font-semibold">
                      {q.prompt}
                    </div>
                  </div>
                </div>

                {/* Question Details */}
                {renderQuestionDetails(q)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No questions in this quiz.
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <a
            href="/quizzes"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >
            ← Back to All Quizzes
          </a>
        </div>
      </div>
    </main>
  );
}
