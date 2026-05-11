"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateAIInsights = async (industry) => {
  try {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const parsed = JSON.parse(cleanedText);

    // Normalize enum fields to match Prisma enums
    if (parsed.demandLevel && typeof parsed.demandLevel === "string") {
      const dl = parsed.demandLevel.trim().toLowerCase();
      if (dl.includes("high")) parsed.demandLevel = "HIGH";
      else if (dl.includes("low")) parsed.demandLevel = "LOW";
      else parsed.demandLevel = "MEDIUM";
    }

    if (parsed.marketOutlook && typeof parsed.marketOutlook === "string") {
      const mo = parsed.marketOutlook.trim().toLowerCase();
      if (mo.includes("positive")) parsed.marketOutlook = "POSITIVE";
      else if (mo.includes("negative")) parsed.marketOutlook = "NEGATIVE";
      else parsed.marketOutlook = "NEUTRAL";
    }

    return parsed;
  } catch (error) {
    console.error("AI Insights generation failed, using defaults:", error.message);
    // Return default insights if API call fails
    return {
      salaryRanges: [
        { role: "Junior Professional", min: 40000, max: 60000, median: 50000, location: "USA" },
        { role: "Mid-Level Professional", min: 70000, max: 100000, median: 85000, location: "USA" },
        { role: "Senior Professional", min: 110000, max: 150000, median: 130000, location: "USA" }
      ],
      growthRate: 5.0,
      demandLevel: "MEDIUM",
      topSkills: ["Communication", "Problem Solving", "Leadership", "Technical Skills", "Adaptability"],
      marketOutlook: "NEUTRAL",
      keyTrends: ["Digital Transformation", "Remote Work", "Automation", "Skill Development", "Industry 4.0"],
      recommendedSkills: ["Data Analysis", "Project Management", "Critical Thinking", "Collaboration", "Technical Expertise"]
    };
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}