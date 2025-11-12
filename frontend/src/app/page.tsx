'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      {/* Floating Particles Background */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 bg-white/30 dark:bg-white/10 rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Main Content Card */}
      <div className="relative z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 sm:p-16 flex flex-col items-center animate-zoom-in border border-gray-200/50 dark:border-gray-700/50">
        {/* Animated Icon/Logo */}
        <div className="w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-spin-slow">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3 animate-slide-down">
          Welcome to Quiz App
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg text-center animate-fade-in-delayed">
          Build, manage, and share interactive quizzes with a sleek, modern interface.
        </p>
        <a
          href="/quizzes"
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-400/50 dark:hover:shadow-purple-600/50 animate-bounce-in overflow-hidden"
        >
          <span className="relative z-10">Get Started &rarr;</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-30px); opacity: 0.8; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in { animation: zoom-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 1s 0.3s cubic-bezier(0.5, 0.05, 0.1, 1) both; }

        @keyframes fade-in-delayed {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-delayed { animation: fade-in-delayed 1.5s 0.7s both; }

        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 1.2s 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) both; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </main>
  );
}
