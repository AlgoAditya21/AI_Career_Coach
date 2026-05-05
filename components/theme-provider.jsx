"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({children,...props}){
  const [isMounted, setIsMounted] = React.useState(false)
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) return children
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}