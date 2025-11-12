import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const prisma = new PrismaClient();
dotenv.config();
const app = express();

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security

// CORS - restrict to your frontend only
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '1mb' })); // Limit request body size

// Rate limiting - prevent spam/DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/quizzes', limiter); // Apply to all quiz endpoints

// More strict rate limit for create/delete
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Only 20 creates/deletes per 15 minutes
  message: 'Too many create/delete requests, please slow down.',
});

// Validation middleware
const validateQuizId = [
  param('id').isInt({ min: 1 }).withMessage('Invalid quiz ID'),
];

const validateCreateQuiz = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Quiz title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .escape(), // Prevent XSS
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('questions.*.type')
    .isIn(['boolean', 'input', 'checkbox'])
    .withMessage('Invalid question type'),
  body('questions.*.prompt')
    .trim()
    .notEmpty()
    .withMessage('Question prompt is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Prompt must be between 5 and 500 characters')
    .escape(),
  body('questions.*.answers')
    .notEmpty()
    .withMessage('Answer is required'),
  body('questions.*.options')
    .optional()
    .custom((value, { req }) => {
      if (req.body.questions && Array.isArray(value)) {
        if (value.length > 20) {
          throw new Error('Too many options (max 20)');
        }
        value.forEach((opt: any) => {
          if (typeof opt === 'string' && opt.length > 200) {
            throw new Error('Option text too long (max 200 characters)');
          }
        });
      }
      return true;
    }),
];

// Helper to check validation errors
const checkValidation = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

interface QuestionInput {
  type: 'boolean' | 'input' | 'checkbox';
  prompt: string;
  options?: unknown[];
  answers: unknown;
}

interface QuizInput {
  title: string;
  questions: QuestionInput[];
}

// GET /quizzes - List all quizzes
app.get('/quizzes', async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { questions: true },
      take: 100, // Limit to prevent massive queries
    });

    const list = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz.questions.length,
    }));

    res.json(list);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET /quizzes/:id - Get single quiz
app.get('/quizzes/:id', validateQuizId, checkValidation, async (req: Request, res: Response) => {
  try {
    const quizId = Number(req.params.id);

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// POST /quizzes - Create quiz
app.post(
  '/quizzes',
  strictLimiter,
  validateCreateQuiz,
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const { title, questions }: QuizInput = req.body;

      // Additional validation
      if (questions.length > 50) {
        return res.status(400).json({ error: 'Too many questions (max 50)' });
      }

      const newQuiz = await prisma.quiz.create({
        data: {
          title,
          questions: {
            create: questions.map((q) => {
              const questionData: any = {
                type: q.type,
                prompt: q.prompt,
                answers: q.answers,
              };
              if (q.options !== undefined) {
                questionData.options = q.options;
              }
              return questionData;
            }),
          },
        },
        include: { questions: true },
      });

      res.status(201).json(newQuiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(400).json({ error: 'Failed to create quiz' });
    }
  }
);

// DELETE /quizzes/:id - Delete quiz
app.delete(
  '/quizzes/:id',
  strictLimiter,
  validateQuizId,
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const quizId = Number(req.params.id);

      const existingQuiz = await prisma.quiz.findUnique({
        where: { id: quizId },
      });

      if (!existingQuiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      await prisma.quiz.delete({
        where: { id: quizId },
      });

      res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ error: 'Failed to delete quiz' });
    }
  }
);

app.get('/', (req: Request, res: Response) => {
  res.send('Quiz API running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
