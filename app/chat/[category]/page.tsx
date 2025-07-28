"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, Bot, User, Plus, Sparkles, AlertCircle } from "lucide-react"
import { streamRecommendations } from "@/app/actions"
import { ThemeToggle } from "@/components/theme-toggle"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isFromAPI?: boolean
}

interface ParsedRecommendation {
  title: string
  genre: string
  year?: string
  platform?: string
  rating: string
  description: string
  poster?: string
}

const categoryInfo = {
  anime: {
    title: "Anime Recommendations",
    description: "Tell me about your anime preferences!",
    examples: [
      "I love action anime like Attack on Titan",
      "Recommend romantic anime series",
      "I want something similar to Death Note",
    ],
  },
  movies: {
    title: "Movie Recommendations",
    description: "What kind of movies do you enjoy?",
    examples: [
      "I love sci-fi movies like Interstellar",
      "Recommend comedy movies",
      "I want thriller movies like Gone Girl",
    ],
  },
  "web-series": {
    title: "Web Series & K-Drama",
    description: "Share your web series and K-drama preferences!",
    examples: [
      "I love K-dramas like Crash Landing on You",
      "Recommend mystery web series",
      "I want something like Stranger Things",
    ],
  },
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const categoryData = categoryInfo[category as keyof typeof categoryInfo]

  useEffect(() => {
    if (categoryData) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hello! I'm your ${categoryData.title.toLowerCase()} assistant. ${categoryData.description} I'll provide you with one perfect recommendation with detailed information. What are you in the mood for?`,
          timestamp: new Date(),
          isFromAPI: false,
        },
      ])
    }
  }, [categoryData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const parseRecommendation = (content: string): ParsedRecommendation | null => {
    const lines = content.split("\n").filter((line) => line.trim())
    const recommendation: Partial<ParsedRecommendation> = {}

    for (const line of lines) {
      const [key, ...valueParts] = line.split(":")
      const value = valueParts.join(":").trim()

      switch (key.trim().toUpperCase()) {
        case "TITLE":
          recommendation.title = value
          break
        case "GENRE":
          recommendation.genre = value
          break
        case "YEAR":
          recommendation.year = value
          break
        case "PLATFORM":
          recommendation.platform = value
          break
        case "RATING":
          recommendation.rating = value
          break
        case "DESCRIPTION":
          recommendation.description = value
          break
        case "POSTER":
          recommendation.poster = value
          break
      }
    }

    if (recommendation.title && recommendation.genre && recommendation.description && recommendation.rating) {
      return recommendation as ParsedRecommendation
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const response = await streamRecommendations(currentInput, category)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        isFromAPI: !response.includes("POSTER: /placeholder.svg"),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting recommendations:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I'm having technical difficulties right now. However, I can still provide you with an excellent ${category} recommendation! Let me know what specific genres or themes you're interested in.`,
        timestamp: new Date(),
        isFromAPI: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const addToWatchlist = (title: string) => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
    if (!watchlist.includes(title)) {
      watchlist.push(title)
      localStorage.setItem("watchlist", JSON.stringify(watchlist))
      alert(`Added "${title}" to your watchlist!`)
    } else {
      alert(`"${title}" is already in your watchlist!`)
    }
  }

  if (!categoryData) {
    return <div>Category not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">{categoryData.title}</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-4 lg:py-6 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 lg:mb-6">
            {messages.length === 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {categoryData.examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-3 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-xs lg:text-sm"
                    onClick={() => setInput(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            )}

            {messages.map((message) => {
              const parsedRec = message.role === "assistant" ? parseRecommendation(message.content) : null

              return (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <Card
                    className={`max-w-[85%] lg:max-w-[80%] ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-purple-700 border-0"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                    }`}
                  >
                    <CardContent className="p-3 lg:p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${
                            message.role === "user" ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {parsedRec ? (
                            // Structured recommendation display without poster
                            <div className="space-y-4">
                              {/* Title */}
                              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                                {parsedRec.title}
                              </h3>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                  {parsedRec.genre}
                                </span>
                                {parsedRec.year && (
                                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                    {parsedRec.year}
                                  </span>
                                )}
                                {parsedRec.platform && (
                                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                    {parsedRec.platform}
                                  </span>
                                )}
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                  {parsedRec.rating}
                                </span>
                              </div>

                              {/* Description */}
                              <div className="pt-2">
                                <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base leading-relaxed">
                                  {parsedRec.description}
                                </p>
                              </div>

                              {/* Add to Watchlist button */}
                              <div className="pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600 bg-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:bg-gray-800 text-xs lg:text-sm"
                                  onClick={() => addToWatchlist(parsedRec.title)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add to Watchlist
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Regular text message
                            <p
                              className={`${
                                message.role === "user" ? "text-white" : "text-gray-800 dark:text-gray-200"
                              } whitespace-pre-wrap text-sm lg:text-base break-words`}
                            >
                              {message.content}
                            </p>
                          )}

                          {message.role === "assistant" &&
                            message.isFromAPI === false &&
                            message.content.includes("💡") && (
                              <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Curated recommendation
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="p-3 lg:p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask for a ${category} recommendation...`}
              className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
