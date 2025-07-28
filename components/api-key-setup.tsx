"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, AlertCircle, CheckCircle } from "lucide-react"

interface ApiKeySetupProps {
  onApiKeySet?: () => void
}

export function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<"success" | "error" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) return

    setIsValidating(true)
    setValidationResult(null)

    try {
      // Test the API key by making a simple request
      const response = await fetch("/api/test-groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      if (response.ok) {
        setValidationResult("success")
        localStorage.setItem("groq_api_key", apiKey.trim())
        setTimeout(() => {
          onApiKeySet?.()
        }, 1500)
      } else {
        setValidationResult("error")
      }
    } catch (error) {
      console.error("API key validation error:", error)
      setValidationResult("error")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">API Key Setup</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Enter your Groq API key to enable AI-powered recommendations
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-gray-700 dark:text-gray-300">
                Groq API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                disabled={isValidating}
              />
            </div>

            {validationResult === "success" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  API key validated successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            {validationResult === "error" && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  Invalid API key. Please check your key and try again.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!apiKey.trim() || isValidating}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            >
              {isValidating ? "Validating..." : "Save API Key"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">How to get your API key:</h4>
            <ol className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <li>1. Visit console.groq.com</li>
              <li>2. Sign up or log in to your account</li>
              <li>3. Navigate to API Keys section</li>
              <li>4. Create a new API key</li>
              <li>5. Copy and paste it above</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
