"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Trash2, Plus, Search, List } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function WatchlistPage() {
  const router = useRouter()
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [newItem, setNewItem] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("watchlist")
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
  }, [])

  const addToWatchlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return

    const updatedWatchlist = [...watchlist, newItem.trim()]
    setWatchlist(updatedWatchlist)
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist))
    setNewItem("")
  }

  const removeFromWatchlist = (index: number) => {
    const updatedWatchlist = watchlist.filter((_, i) => i !== index)
    setWatchlist(updatedWatchlist)
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist))
  }

  const filteredWatchlist = watchlist.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

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
                  <List className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">My Watchlist</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
        {/* Add new item form */}
        <Card className="mb-6 lg:mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-4">Add to Watchlist</h2>
            <form onSubmit={addToWatchlist} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter anime, movie, or series name..."
                className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md sm:w-auto w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search */}
        {watchlist.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your watchlist..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>
        )}

        {/* Watchlist items */}
        {filteredWatchlist.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-8 lg:p-12 text-center">
              <List className="h-12 w-12 lg:h-16 lg:w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {watchlist.length === 0 ? "Your watchlist is empty" : "No items found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                {watchlist.length === 0
                  ? "Add some shows, movies, or anime to get started!"
                  : "Try adjusting your search terms."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredWatchlist.map((item, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-sm lg:text-base flex-1 min-w-0 break-words">
                      {item}
                    </span>
                    <Button
                      onClick={() => removeFromWatchlist(watchlist.indexOf(item))}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {watchlist.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
              {watchlist.length} item{watchlist.length !== 1 ? "s" : ""} in your watchlist
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
