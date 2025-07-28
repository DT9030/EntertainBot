"use server"

interface RecommendationData {
  title: string
  genre: string
  description: string
  rating: string
  year?: string
  platform?: string
  poster?: string
}

export async function streamRecommendations(userInput: string, category: string) {
  // Get API key from environment variables
  const GROQ_API_KEY = process.env.GROQ_API_KEY

  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables")
    throw new Error("API configuration error")
  }

  const categoryPrompts = {
    anime: `You are an anime recommendation expert. Based on the user's preferences, provide exactly ONE specific anime recommendation with detailed explanation. Format your response EXACTLY as follows:

TITLE: [Anime Name]
GENRE: [Genres]
YEAR: [Release Year]
RATING: [Rating/10]
DESCRIPTION: [Detailed description explaining why it matches their taste, what makes it special, and what to expect. Make this 3-4 sentences long.]

User preference: ${userInput}

Provide only ONE recommendation that best matches their request. Make sure to include all fields exactly as shown above.`,

    movies: `You are a movie recommendation expert. Based on the user's preferences, provide exactly ONE specific movie recommendation with detailed explanation. Format your response EXACTLY as follows:

TITLE: [Movie Name]
GENRE: [Genres]
YEAR: [Release Year]
RATING: [Rating/10]
DESCRIPTION: [Detailed description explaining why it matches their taste, what makes it special, and what to expect. Make this 3-4 sentences long.]

User preference: ${userInput}

Provide only ONE recommendation that best matches their request. Make sure to include all fields exactly as shown above.`,

    "web-series": `You are a web series and K-drama recommendation expert. Based on the user's preferences, provide exactly ONE specific recommendation with detailed explanation. Format your response EXACTLY as follows:

TITLE: [Series Name]
GENRE: [Genres]
YEAR: [Release Year]
PLATFORM: [Where to watch]
RATING: [Rating/10]
DESCRIPTION: [Detailed description explaining why it matches their taste, what makes it special, and what to expect. Make this 3-4 sentences long.]

User preference: ${userInput}

Provide only ONE recommendation that best matches their request. Make sure to include all fields exactly as shown above.`,
  }

  // Enhanced single recommendation fallbacks with poster URLs
  const generateSingleFallback = (userInput: string, category: string): RecommendationData => {
    const singleRecommendations = {
      anime: {
        action: {
          title: "Demon Slayer: Kimetsu no Yaiba",
          genre: "Action, Supernatural, Historical",
          year: "2019",
          rating: "9/10",
          description:
            "A visually stunning anime with breathtaking animation and compelling characters. Follows Tanjiro's journey to save his demon-turned sister while fighting other demons. The fight scenes are absolutely incredible and the emotional depth makes every battle meaningful. Perfect for fans of action-packed stories with heart.",
          poster: "/placeholder.svg?height=400&width=300&text=Demon+Slayer+Poster",
        },
        romance: {
          title: "Your Name",
          genre: "Romance, Supernatural, Drama",
          year: "2016",
          rating: "9/10",
          description:
            "A beautiful and emotionally powerful film about two teenagers who mysteriously swap bodies. The animation is gorgeous and the story is deeply moving, exploring themes of connection, fate, and love across time and space. This masterpiece will leave you emotionally invested and thinking about it long after the credits roll.",
          poster: "/placeholder.svg?height=400&width=300&text=Your+Name+Poster",
        },
        default: {
          title: "Attack on Titan",
          genre: "Action, Drama, Dark Fantasy",
          year: "2013",
          rating: "9.5/10",
          description:
            "A gripping and intense series that keeps you on the edge of your seat. The story evolves dramatically with each season, featuring complex characters and shocking plot twists that will leave you questioning everything. Known for its mature themes, incredible world-building, and one of the most satisfying conclusions in anime history.",
          poster: "/placeholder.svg?height=400&width=300&text=Attack+on+Titan+Poster",
        },
      },
      movies: {
        scifi: {
          title: "Everything Everywhere All at Once",
          genre: "Sci-Fi, Comedy, Drama",
          year: "2022",
          rating: "9.5/10",
          description:
            "A mind-bending multiverse adventure that perfectly balances absurd humor with genuine emotion. It's creative, heartfelt, and visually spectacular, exploring themes of family, identity, and infinite possibilities. This film manages to be both the most ridiculous and most touching movie you'll ever see, with incredible performances and groundbreaking visual effects.",
          poster: "/placeholder.svg?height=400&width=300&text=Everything+Everywhere+All+at+Once+Poster",
        },
        thriller: {
          title: "Parasite",
          genre: "Thriller, Drama, Dark Comedy",
          year: "2019",
          rating: "9.5/10",
          description:
            "A masterful social thriller that examines class inequality with sharp wit and unexpected turns. Bong Joon-ho's direction is flawless, creating a film that's both entertaining and deeply thought-provoking. The movie builds tension masterfully while delivering biting social commentary, making it both a thrilling watch and an important cultural statement.",
          poster: "/placeholder.svg?height=400&width=300&text=Parasite+Poster",
        },
        default: {
          title: "Inception",
          genre: "Sci-Fi, Action, Thriller",
          year: "2010",
          rating: "9/10",
          description:
            "Christopher Nolan's complex and visually stunning exploration of dreams within dreams. The action sequences and concept are equally impressive, creating a unique cinematic experience that rewards multiple viewings. With its intricate plot, stunning practical effects, and Hans Zimmer's iconic score, this film redefined what blockbuster cinema could achieve.",
          poster: "/placeholder.svg?height=400&width=300&text=Inception+Poster",
        },
      },
      "web-series": {
        kdrama: {
          title: "Crash Landing on You",
          genre: "Romance, Drama, Comedy",
          year: "2019",
          platform: "Netflix",
          rating: "9.5/10",
          description:
            "One of the best K-dramas ever made, telling the unlikely love story between a South Korean heiress and North Korean officer. Perfect mix of romance, comedy, and cultural exploration with outstanding performances. The show beautifully balances humor and heart while providing insight into Korean culture and the divide between North and South Korea.",
          poster: "/placeholder.svg?height=400&width=300&text=Crash+Landing+on+You+Poster",
        },
        mystery: {
          title: "Stranger Things",
          genre: "Sci-Fi, Horror, Drama",
          year: "2016",
          platform: "Netflix",
          rating: "9/10",
          description:
            "A perfect blend of 80s nostalgia, supernatural horror, and heartfelt friendship. The characters are lovable and the mysteries are compelling, creating an addictive viewing experience. With its perfect mix of horror, humor, and heart, plus incredible performances from both adult and child actors, this series captures the magic of childhood adventure stories.",
          poster: "/placeholder.svg?height=400&width=300&text=Stranger+Things+Poster",
        },
        default: {
          title: "The Queen's Gambit",
          genre: "Drama, Coming-of-age",
          year: "2020",
          platform: "Netflix",
          rating: "9.5/10",
          description:
            "A beautifully crafted series about a chess prodigy's rise to fame while battling addiction. Anya Taylor-Joy's performance is exceptional, and the show makes chess surprisingly thrilling. The series combines stunning period details with compelling character development, creating a story that's both visually gorgeous and emotionally resonant.",
          poster: "/placeholder.svg?height=400&width=300&text=The+Queens+Gambit+Poster",
        },
      },
    }

    const categoryRecs = singleRecommendations[category as keyof typeof singleRecommendations]
    const lowerInput = userInput.toLowerCase()

    let selectedRec
    if (category === "anime") {
      if (lowerInput.includes("action") || lowerInput.includes("fight")) {
        selectedRec = categoryRecs.action
      } else if (lowerInput.includes("romance") || lowerInput.includes("love")) {
        selectedRec = categoryRecs.romance
      } else {
        selectedRec = categoryRecs.default
      }
    } else if (category === "movies") {
      if (lowerInput.includes("sci-fi") || lowerInput.includes("science")) {
        selectedRec = categoryRecs.scifi
      } else if (lowerInput.includes("thriller") || lowerInput.includes("suspense")) {
        selectedRec = categoryRecs.thriller
      } else {
        selectedRec = categoryRecs.default
      }
    } else {
      if (lowerInput.includes("k-drama") || lowerInput.includes("korean")) {
        selectedRec = categoryRecs.kdrama
      } else if (lowerInput.includes("mystery") || lowerInput.includes("thriller")) {
        selectedRec = categoryRecs.mystery
      } else {
        selectedRec = categoryRecs.default
      }
    }

    return selectedRec
  }

  try {
    console.log("Attempting to get recommendation from Groq API...")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.movies,
          },
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      }),
    })

    console.log("Groq API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API Error:", response.status, errorText)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Groq API Response received successfully")

    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content
    } else {
      console.error("Unexpected API response structure:", data)
      throw new Error("Invalid response structure from API")
    }
  } catch (error) {
    console.error("Error calling Groq API:", error)
    console.log("Using single personalized fallback recommendation...")

    // Return structured fallback content
    const fallbackData = generateSingleFallback(userInput, category)

    let response = `TITLE: ${fallbackData.title}\n`
    response += `GENRE: ${fallbackData.genre}\n`
    if (fallbackData.year) response += `YEAR: ${fallbackData.year}\n`
    if (fallbackData.platform) response += `PLATFORM: ${fallbackData.platform}\n`
    response += `RATING: ${fallbackData.rating}\n`
    response += `DESCRIPTION: ${fallbackData.description}\n`
    if (fallbackData.poster) response += `POSTER: ${fallbackData.poster}`

    return response
  }
}
