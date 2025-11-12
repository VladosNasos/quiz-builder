import './globals.css';
import { ThemeProvider } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased overflow-x-hidden">
        <ThemeProvider>
          {/* Animated gradient background layer */}
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-700">
            {/* Floating animated orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-1/3 right-20 w-40 h-40 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-1/2 left-1/2 w-44 h-44 bg-rose-300/20 dark:bg-rose-600/10 rounded-full blur-3xl animate-float-delayed" />
          </div>

          <ThemeToggle />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
