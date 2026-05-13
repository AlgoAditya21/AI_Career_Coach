"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq();

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

  const result = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });
  const text = result.choices[0].message?.content || "";
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
  try {
    const { userId } = await auth();
    if (!userId) {
      // Not authenticated — return default insights so the dashboard can render gracefully
      return await generateAIInsights("General");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) {
      return await generateAIInsights("General");
    }

    // If no insights exist, generate them
    if (!user.industryInsight) {
      const insights = await generateAIInsights(user.industry || "General");

      const industryInsight = await db.industryInsight.create({
        data: {
          ...insights,
          industry: user.industry || "General",
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return industryInsight;
    }

    return user.industryInsight;
  } catch (error) {
    // Log error and return default insights to avoid server rendering failure
    console.error("Error getting industry insights:", error?.message || error);
    return await generateAIInsights("General");
  }
}