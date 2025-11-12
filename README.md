# 📝 Quiz Builder

> A modern, full-stack web application for creating, managing, and viewing interactive quizzes with multiple question types. Built with React/Next.js and Express.js.
<img width="3829" height="1985" alt="image" src="https://github.com/user-attachments/assets/1dd8dc16-5584-4fde-b636-f4f39b09abb7" />
<img width="1950" height="1295" alt="image" src="https://github.com/user-attachments/assets/7e6fdfa9-5c73-44f4-9f5d-6c42a138a21b" />

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node Version](https://img.shields.io/badge/Node-18%2B-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## ✨ Features

- **Create Interactive Quizzes** with three question types:
  - 🔵 **Boolean** - True/False questions
  - ✍️ **Text Input** - Short answer questions
  - ☑️ **Checkbox** - Multiple choice with multiple correct answers
- **Quiz Management** - View, delete, and organize quizzes
- **Beautiful UI** - Modern design with smooth animations
- **Fully Responsive** - Works on desktop, tablet, and mobile
- **Enterprise Security** - Input validation, rate limiting, XSS protection
- **Type-Safe** - 100% TypeScript codebase

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | RESTful API server |
| TypeScript | Type safety |
| Prisma ORM | Database management |
| SQLite | Lightweight database |
| Express Validator | Input validation |
| Helmet | Security headers |
| Express Rate Limit | API rate limiting |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Custom Animations | Enhanced UX |

## 📂 Project Structure
quiz-builder/
├── backend/
│ ├── src/
│ │ └── app.ts # Express server with all endpoints
│ ├── prisma/
│ │ ├── schema.prisma # Database schema
│ │ └── dev.db # SQLite database (gitignored)
│ ├── package.json
│ ├── tsconfig.json
│ └── .env # Environment variables (gitignored)
│
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ │ ├── page.tsx # Landing page
│ │ │ ├── create/page.tsx # Quiz creation form
│ │ │ ├── quizzes/page.tsx # Quiz list
│ │ │ ├── quizzes/[id]/page.tsx # Quiz details
│ │ │ ├── layout.tsx # Root layout
│ │ │ ├── globals.css # Global styles
│ │ │ ├── ThemeProvider.tsx # Dark mode logic
│ │ │ └── ThemeToggle.tsx # Dark mode button
│ │ └── types/quiz.ts # TypeScript interfaces
│ ├── package.json
│ ├── tailwind.config.ts
│ └── next.config.js
│
└── README.md


## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Backend Setup

cd backend

1. Install dependencies
npm install

2. Create .env file
cat > .env << EOF
DATABASE_URL="file:./dev.db"
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

3. Initialize database
npx prisma migrate dev --name init

4. (Optional) Seed with sample data
npx prisma db seed

5. Start server
npm run dev

Backend runs on: `http://localhost:4000`

### Frontend Setup

cd frontend

1. Install dependencies
npm install

2. Start development server
npm run dev

Frontend runs on: `http://localhost:3000`

## 📚 API Documentation

### Base URL
http://localhost:4000


## 🔒 Security Features

✅ **SQL Injection Prevention** - Prisma ORM parameterized queries  
✅ **XSS Protection** - Input sanitization and HTML escaping  
✅ **CSRF Protection** - Secure headers with Helmet  
✅ **Rate Limiting** - 100 requests/15min globally, 20 creates/deletes/15min  
✅ **Input Validation** - Strict server-side validation with express-validator  
✅ **Request Size Limits** - Maximum 1MB payload  
✅ **CORS Protection** - Restricted to configured frontend domain  
✅ **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.

## 📋 Usage Examples

### Creating a Quiz (Frontend)
1. Navigate to `/create`
2. Enter quiz title
3. Add questions by clicking "+ Add Question"
4. Select question type: Text, True/False, or Multiple Choice
5. Fill in correct answers
6. Click "Create Quiz"

### Viewing Quizzes
1. Go to `/quizzes` to see all quizzes
2. Each quiz shows title and question count
3. Click "View Details" to see full quiz with answers

### Deleting a Quiz
1. Click the delete button (🗑️) next to any quiz
2. Confirm deletion
3. Quiz is removed from database

## 🎨 Theme Support

Dark mode is can be supported, but it's beta-version so unfortunatelly it's not working properly and persists via localStorage:
- Click the theme toggle (☀️/🌙) in top-right
- Theme preference is saved automatically
- Smooth transitions between light/dark modes

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create quiz with all three question types
- [ ] Verify quiz appears in list with correct question count
- [ ] View quiz details and confirm all questions display
- [ ] Delete quiz and verify it's removed
- [ ] Test on mobile device (responsive design)

### Security Testing
- [ ] Try creating quiz with `<script>alert('XSS')</script>` → should be escaped
- [ ] Try adding 100+ questions → should reject after 50
- [ ] Try rapid-fire requests → should be rate limited after 20

## 📦 Build for Production

### Backend


