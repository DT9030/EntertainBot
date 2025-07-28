# EntertainBot - AI-Powered Entertainment Recommendations

An AI-powered chatbot that provides personalized recommendations for anime, movies, and web series.

## Features

- 🤖 AI-powered recommendations using Groq's Llama 3.1 model
- 🎬 Support for anime, movies, and web series
- 📱 Responsive design with dark/light mode
- 📝 Personal watchlist functionality
- 🎨 Beautiful purple-themed UI

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

### 2. Getting Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### 3. Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

### 4. Usage

1. Open [http://localhost:3000](http://localhost:3000)
2. Choose a category (Anime, Movies, or Web Series)
3. Chat with the AI to get personalized recommendations
4. Add recommendations to your watchlist

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI recommendations | Yes |

## Security

- API keys are stored securely in environment variables
- Never commit `.env.local` files to version control
- The `.gitignore` file is configured to exclude environment files

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Groq API (Llama 3.1)
- Shadcn/ui Components
