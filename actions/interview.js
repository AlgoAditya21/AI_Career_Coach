"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const fallbackQuizQuestions = [
  {
    question: "What is the main benefit of using prepared statements in SQL?",
    options: [
      "They automatically generate indexes",
      "They prevent SQL injection",
      "They increase file system performance",
      "They convert SQL to NoSQL",
    ],
    correctAnswer: "They prevent SQL injection",
    explanation:
      "Prepared statements keep user input separate from SQL logic, which helps prevent SQL injection attacks.",
  },
  {
    question: "Which data structure provides O(1) average time complexity for insertions and lookups?",
    options: ["Array", "Linked List", "Hash Table", "Binary Tree"],
    correctAnswer: "Hash Table",
    explanation:
      "Hash tables offer average constant-time insert and lookup operations through hashing.",
  },
  {
    question: "What is the primary purpose of a REST API?",
    options: [
      "To manage database transactions",
      "To provide a standardized web service interface",
      "To compress network traffic",
      "To render UI components",
    ],
    correctAnswer: "To provide a standardized web service interface",
    explanation:
      "REST APIs standardize how clients and servers exchange data over HTTP.",
  },
  {
    question: "Which of the following is a characteristic of ACID transactions?",
    options: ["Availability", "Consistency", "Decentralization", "Lazy loading"],
    correctAnswer: "Consistency",
    explanation:
      "Consistency ensures a transaction brings the database from one valid state to another.",
  },
  {
    question: "What is the best use case for a NoSQL document database?",
    options: [
      "Strongly consistent financial transactions",
      "Rapidly changing schema data",
      "Fixed-schema relational data",
      "Low-level memory management",
    ],
    correctAnswer: "Rapidly changing schema data",
    explanation:
      "Document databases are ideal when the data schema evolves frequently and is semi-structured.",
  },
  {
    question: "Which event loop phase processes timers in Node.js?",
    options: ["Poll", "Timers", "Check", "Close callbacks"],
    correctAnswer: "Timers",
    explanation:
      "The Timers phase processes callbacks scheduled by setTimeout and setInterval.",
  },
  {
    question: "What does the term 'idempotent' mean for HTTP methods?",
    options: [
      "Can be cached indefinitely",
      "Can be repeated without changing the result",
      "Requires authentication",
      "Returns HTML only",
    ],
    correctAnswer: "Can be repeated without changing the result",
    explanation:
      "Idempotent methods produce the same result even if called multiple times.",
  },
  {
    question: "Which algorithmic time complexity is best for a balanced binary search tree lookup?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    explanation:
      "A balanced BST lookup requires logarithmic time relative to the number of nodes.",
  },
  {
    question: "In CSS, which property is used to create a flex container?",
    options: ["display: grid", "display: inline", "display: flex", "position: absolute"],
    correctAnswer: "display: flex",
    explanation:
      "The display: flex property makes an element a flex container for flexible layout.",
  },
  {
    question: "What does the acronym OOP stand for?",
    options: [
      "Object-Oriented Programming",
      "Open-source Operational Planning",
      "Optimized Output Processing",
      "Organized Object Persistence",
    ],
    correctAnswer: "Object-Oriented Programming",
    explanation:
      "OOP is a programming paradigm based on objects and classes.",
  },
];

function getFallbackQuiz() {
  return fallbackQuizQuestions
    .map((question) => ({ ...question }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
}

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set, using fallback quiz questions.");
    return getFallbackQuiz();
  }

  const uniqueToken = Date.now() + Math.floor(Math.random() * 10000);
  const prompt = `
    Generate 10 unique technical interview questions for a ${user.industry} professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.

    Make sure these questions are different from any previous quiz, vary the wording, and include a unique quiz token: ${uniqueToken}.

    Each question should be multiple choice with 4 options.

    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    if (!quiz?.questions?.length) {
      console.warn("AI returned no quiz questions, using fallback.");
      return getFallbackQuiz();
    }

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return getFallbackQuiz(user);
  }
}


export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}


export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}