import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(10, "Please provide a professional summary"),
  skills: z.string().min(10, "Please list your skills"),
  experience: z.array(
    z.object({
      company: z.string().min(1, "Company is required"),
      role: z.string().min(1, "Role is required"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      school: z.string().min(1, "School is required"),
      degree: z.string().min(1, "Degree is required"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string().min(1, "Project title is required"),
      link: z.string().url("Project link must be a valid URL").optional(),
      description: z.string().optional(),
    })
  ),
});