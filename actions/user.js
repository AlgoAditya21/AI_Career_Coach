"use server"

import {db} from "@/lib/prisma"
import {auth} from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { generateAIInsights } from "@/actions/dashboard";

export async function updateUser(data){
    const {userId}=await auth();
    if(!userId) throw new Error("unauthrized")
    const user=await db.user.findUnique({
    where:{clerkUserId:userId},
  });
  if(!user) throw new Error("User not found");

  try{
    // Start a transaction to handle both operations
    const result=await db.$transaction(
      async(tx)=>{
        // First, check if IndustryInsight exists for this industry
        let industryInsight=await tx.industryInsight.findUnique({
          where:{
            industry:data.industry,
          },
        });

        // If it doesn't exist, create it with default values
        if(!industryInsight){
          const fallbackIndustry = data.industry || user.industry || "General";
          const insights = await generateAIInsights(fallbackIndustry);
          
              industryInsight = await db.industryInsight.create({
                data: {
                  ...insights,
                  industry: fallbackIndustry,
                  nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              });
        }

        // Now update the user
        const updatedUser=await tx.user.update({
          where:{
            id:user.id,
          },
          data:{
            industry:data.industry,
            experience:data.experience,
            bio:data.bio,
            skills:data.skills,
          },
        });

        return updatedUser;
      },
      {
        timeout: 10000, // default: 5000
      }
    );

    revalidatePath("/");
    console.log("User profile updated successfully:", result);
    return {success:true,...result};
  }
  catch(error){
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile: "+error.message);
  }
}



export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      // Not signed in — treat as not onboarded so the app can redirect to sign-in/onboarding flow client-side
      return { isOnboarded: false };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return { isOnboarded: !!user?.industry };
  } catch (error) {
    // Log error but avoid throwing to prevent server-component rendering crash in production
    console.error("Error checking onboarding status:", error?.message || error);
    return { isOnboarded: false };
  }
}