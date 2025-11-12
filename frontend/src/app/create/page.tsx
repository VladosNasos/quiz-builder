'use client';

import { useState } from 'react';
import type { Question } from '@/types/quiz';

type QuestionType = 'boolean' | 'input' | 'checkbox';
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};
export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        type: 'input',
        prompt: '',
        answers: '',
        options: undefined,
      },
    ]);
  }

  function removeQuestion(idx: number) {
    setQuestions(questions.filter((_, i) => i !== idx));
  }

  function updateQuestionType(idx: number, type: QuestionType) {
    const updated = [...questions];
    updated[idx].type = type;

    // Set default values based on type
    if (type === 'boolean') {
      updated[idx].options = ['True', 'False'];
      updated[idx].answers = 'True';
    } else if (type === 'checkbox') {
      updated[idx].options = [''];
      updated[idx].answers = [];
    } else {
      updated[idx].options = undefined;
      updated[idx].answers = '';
    }

    setQuestions(updated);
  }

  function updateQuestionPrompt(idx: number, prompt: string) {
    const updated = [...questions];
    updated[idx].prompt = prompt;
    setQuestions(updated);
  }

  function updateQuestionAnswer(idx: number, answer: string) {
    const updated = [...questions];
    updated[idx].answers = answer;
    setQuestions(updated);
  }

  // For checkbox: add option
  function addCheckboxOption(idx: number) {
    const updated = [...questions];
    const options = (updated[idx].options as string[]) || [];
    options.push('');
    updated[idx].options = options;
    setQuestions(updated);
  }

  // For checkbox: update specific option
  function updateCheckboxOption(qIdx: number, optIdx: number, value: string) {
    const updated = [...questions];
    const options = (updated[qIdx].options as string[]) || [];
    options[optIdx] = value;
    updated[qIdx].options = options;
    setQuestions(updated);
  }

  // For checkbox: remove option
  function removeCheckboxOption(qIdx: number, optIdx: number) {
    const updated = [...questions];
    const options = (updated[qIdx].options as string[]) || [];
    options.splice(optIdx, 1);
    updated[qIdx].options = options;
    setQuestions(updated);
  }

  // For checkbox: toggle answer
  function toggleCheckboxAnswer(qIdx: number, option: string) {
    const updated = [...questions];
    let answers = updated[qIdx].answers as string[];
    if (!Array.isArray(answers)) {
      answers = [];
    }

    if (answers.includes(option)) {
      answers = answers.filter(a => a !== option);
    } else {
      answers.push(option);
    }

    updated[qIdx].answers = answers;
    setQuestions(updated);
  }

async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  // Trim and validate title
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    alert('Please enter a quiz title');
    return;
  }

  if (trimmedTitle.length < 3) {
    alert('Quiz title must be at least 3 characters long');
    return;
  }

  if (trimmedTitle.length > 200) {
    alert('Quiz title is too long (max 200 characters)');
    return;
  }

  if (questions.length === 0) {
    alert('Please add at least one question');
    return;
  }

  if (questions.length > 50) {
    alert('Too many questions (max 50)');
    return;
  }

  // Validate all questions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    
    if (!q.prompt.trim()) {
      alert(`Question #${i + 1}: Please enter a question prompt`);
      return;
    }

    if (q.prompt.trim().length < 5) {
      alert(`Question #${i + 1}: Question prompt is too short (min 5 characters)`);
      return;
    }

    if (q.prompt.trim().length > 500) {
      alert(`Question #${i + 1}: Question prompt is too long (max 500 characters)`);
      return;
    }

    if (q.type === 'checkbox') {
      const options = (q.options as string[]) || [];
      
      if (options.length === 0) {
        alert(`Question #${i + 1}: Please add at least one option for checkbox question`);
        return;
      }

      if (options.length > 20) {
        alert(`Question #${i + 1}: Too many options (max 20)`);
        return;
      }

      if (options.some(opt => !opt.trim())) {
        alert(`Question #${i + 1}: All options must have text`);
        return;
      }

      if (options.some(opt => opt.length > 200)) {
        alert(`Question #${i + 1}: Option text too long (max 200 characters)`);
        return;
      }

      const answers = (q.answers as string[]) || [];
      if (answers.length === 0) {
        alert(`Question #${i + 1}: Please select at least one correct answer`);
        return;
      }
    } else if (q.type === 'input' || q.type === 'boolean') {
      if (!q.answers || (typeof q.answers === 'string' && !q.answers.trim())) {
        alert(`Question #${i + 1}: Please provide a correct answer`);
        return;
      }
    }
  }

  setLoading(true);

  try {
    // Sanitize all inputs before sending
    const sanitizedTitle = sanitizeInput(trimmedTitle);
    
    const sanitizedQuestions = questions.map(q => {
      const sanitizedQuestion: any = {
        type: q.type,
        prompt: sanitizeInput(q.prompt.trim()),
      };

      // Sanitize answers based on type
      if (q.type === 'checkbox') {
        sanitizedQuestion.answers = (q.answers as string[]).map(a => sanitizeInput(a));
        sanitizedQuestion.options = (q.options as string[]).map(opt => sanitizeInput(opt.trim()));
      } else if (q.type === 'input') {
        sanitizedQuestion.answers = sanitizeInput(String(q.answers).trim());
        sanitizedQuestion.options = undefined;
      } else if (q.type === 'boolean') {
        sanitizedQuestion.answers = String(q.answers); 
        sanitizedQuestion.options = ['True', 'False'];
      }

      return sanitizedQuestion;
    });

    const res = await fetch('http://localhost:4000/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: sanitizedTitle, 
        questions: sanitizedQuestions 
      }),
    });

    if (res.ok) {
      alert('Quiz created successfully!');
      window.location.href = '/quizzes';
    } else {
      const error = await res.json();
      
      // Handle validation errors from backend
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map((e: any) => e.msg).join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert(`Failed to create quiz: ${error.error || 'Unknown error'}`);
      }
      
      setLoading(false);
    }
  } catch (error) {
    console.error('Error creating quiz:', error);
    alert('Network error. Please check your connection and try again.');
    setLoading(false);
  }
}
  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8 animate-slide-down">
          Create New Quiz
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 animate-zoom-in"
        >
          {/* Quiz Title */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Quiz Title *
            </label>
            <input
              type="text"
              value={title}
              required
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Questions ({questions.length})
              </label>
              <button
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                onClick={addQuestion}
              >
                + Add Question
              </button>
            </div>

            <ul className="space-y-6">
              {questions.map((q, idx) => (
                <li
                  key={idx}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-l-4 border-purple-500 rounded-lg p-5 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      Question #{idx + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Question Type */}
                  <div className="mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Question Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={q.type}
                      onChange={e => updateQuestionType(idx, e.target.value as QuestionType)}
                    >
                      <option value="input">Text Answer</option>
                      <option value="boolean">True / False</option>
                      <option value="checkbox">Multiple Choice</option>
                    </select>
                  </div>

                  {/* Question Prompt */}
                  <div className="mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Question Prompt *
                    </label>
                    <input
                      type="text"
                      value={q.prompt}
                      onChange={e => updateQuestionPrompt(idx, e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 transition"
                      placeholder="Enter your question"
                    />
                  </div>

                  {/* Type-specific inputs */}
                  {q.type === 'input' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Correct Answer *
                      </label>
                      <input
                        type="text"
                        value={String(q.answers ?? '')}
                        onChange={e => updateQuestionAnswer(idx, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Enter correct answer"
                      />
                    </div>
                  )}

                  {q.type === 'boolean' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Correct Answer *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={String(q.answers)}
                        onChange={e => updateQuestionAnswer(idx, e.target.value)}
                      >
                        <option value="True">True</option>
                        <option value="False">False</option>
                      </select>
                    </div>
                  )}

                  {q.type === 'checkbox' && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Options *
                      </label>
                      <div className="space-y-2 mb-3">
                        {((q.options as string[]) || []).map((option, optIdx) => (
                          <div key={optIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={option}
                              onChange={e => updateCheckboxOption(idx, optIdx, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeCheckboxOption(idx, optIdx)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 font-semibold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addCheckboxOption(idx)}
                        className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold"
                      >
                        + Add Option
                      </button>

                      <div className="mt-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Correct Answers * (select one or more)
                        </label>
                        <div className="space-y-2">
                          {((q.options as string[]) || []).map((option, optIdx) => (
                            <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={((q.answers as string[]) || []).includes(option)}
                                onChange={() => toggleCheckboxAnswer(idx, option)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <span className="text-gray-900 dark:text-gray-100">{option || `Option ${optIdx + 1}`}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}

              {questions.length === 0 && (
                <li className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No questions yet. Click "Add Question" to get started.
                </li>
              )}
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-teal-600 hover:to-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </main>
  );
}
