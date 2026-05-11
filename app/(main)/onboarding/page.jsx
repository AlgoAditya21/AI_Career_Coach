import React from 'react'
import {industries} from "@/data/industries"
import OnboardingForm from "./_components/onboarding-form";


const OnboardingPage =async () => {
  return (
    <main>
      <OnboardingForm industries={industries}/>
    </main>
  )
}

export default OnboardingPage
