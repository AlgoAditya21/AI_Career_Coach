"use client"

import ThemeProvider from "./theme-provider";

export default function ThemeProviderClient({ children, ...props }) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
