import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "jarai", // Unique app ID
  name: "jarai",
  credentials: {
    groq: {
      apiKey: process.env.GROQ_API_KEY,
    },
  },
});