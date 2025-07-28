"use client"

import type React from "react"

import { useState, useEffect } from "react"
import LoadingScreen from "@/components/loading-screen"
import { ThemeProvider } from "@/components/theme-provider"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (hasVisited) {
      setIsFirstLoad(false)
      setShowLoading(false)
    } else {
      sessionStorage.setItem("hasVisited", "true")
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 5500)

      return () => clearTimeout(timer)
    }
  }, [])

  if (isFirstLoad && showLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    )
  }

  return <ThemeProvider>{children}</ThemeProvider>
}
