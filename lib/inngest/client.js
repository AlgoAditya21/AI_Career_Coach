import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "jarai", // Unique app ID
  name: "jarai",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});