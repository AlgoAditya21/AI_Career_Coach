# AI Career Coach

![AI Career Coach](/public/image.png)

An intelligent career development platform that leverages AI to help professionals build resumes, generate cover letters, and practice for interviews.

**🚀 Live Demo:** [https://ai-career-coach-three-beta.vercel.app/](https://ai-career-coach-three-beta.vercel.app/)

## Features

- **AI Resume Builder** – Create professional resumes with AI-powered suggestions and formatting
- **Cover Letter Generator** – Generate customized cover letters using AI for any job position
- **Mock Interviews** – Practice interviews with AI and get performance analytics
- **Dashboard** – Track your career progress and application insights
- **Dark/Light Theme** – Seamless theme switching for better user experience
- **User Authentication** – Secure authentication with Clerk

## Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org/) • [React 19](https://react.dev/) • [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend:** Next.js API Routes • [Prisma ORM](https://www.prisma.io/)
- **AI/LLM:** [Groq SDK](https://groq.com/)
- **Database:** PostgreSQL
- **Authentication:** [Clerk](https://clerk.com/)
- **Task Queue:** [Inngest](https://www.inngest.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) • [Radix UI](https://www.radix-ui.com/)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-career
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

## Deployment

This project is deployed on [Vercel](https://vercel.com/). Any push to the main branch automatically triggers a deployment.

Visit: [https://ai-career-coach-three-beta.vercel.app/](https://ai-career-coach-three-beta.vercel.app/)
