"use client"

import { useState, useEffect } from "react"
import { Film, Tv, Zap, Play } from "lucide-react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Simple animated icons */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <div className="animate-bounce" style={{ animationDelay: "0s", animationDuration: "1s" }}>
            <Film className="h-10 w-10 text-purple-500" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "1s" }}>
            <Tv className="h-10 w-10 text-purple-600" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1s" }}>
            <Zap className="h-10 w-10 text-purple-700" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: "0.6s", animationDuration: "1s" }}>
            <Play className="h-10 w-10 text-purple-800" />
          </div>
        </div>

        {/* App name and loading text */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">EntertainBot</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading your entertainment experience...</p>

          {/* Simple progress bar */}
          <div className="w-80 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xl text-purple-600 dark:text-purple-400 font-semibold">{progress}%</p>
        </div>

        {/* Simple pulsing dots */}
        <div className="flex justify-center space-x-3 mt-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDuration: "1.5s" }} />
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.3s", animationDuration: "1.5s" }}
          />
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.6s", animationDuration: "1.5s" }}
          />
        </div>
      </div>
    </div>
  )
}
