"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Film, Tv, Zap, List, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const categories = [
  {
    id: "anime",
    title: "Anime",
    description: "Discover amazing anime series and movies",
    icon: Zap,
  },
  {
    id: "movies",
    title: "Movies",
    description: "Find your next favorite movie",
    icon: Film,
  },
  {
    id: "web-series",
    title: "Web Series",
    description: "Explore trending web series and K-dramas",
    icon: Tv,
  },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50" />
        <div className="relative container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">EntertainBot</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                onClick={() => router.push("/watchlist")}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
              >
                <List className="h-4 w-4 mr-2" />
                My Watchlist
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Discover Your Next
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {" "}
              Obsession
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
            Get personalized recommendations for anime, movies, and web series powered by AI. Tell us what you love, and
            we'll find your perfect match!
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 pb-16 lg:pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                onClick={() => router.push(`/chat/${category.id}`)}
              >
                <CardContent className="p-6 lg:p-8 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm lg:text-base">{category.description}</p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border-0 shadow-md">
                    Get Recommendations
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-gray-800 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose EntertainBot?
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2">AI-Powered</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                Advanced AI understands your preferences and suggests perfect matches
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <List className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Personal Watchlist
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                Keep track of shows you want to watch and organize your entertainment
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2">Instant Results</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                Get recommendations in seconds with our fast and responsive chatbot
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
