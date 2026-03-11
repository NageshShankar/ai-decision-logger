## AI Decision Logger
## Short Description

AI Decision Logger is a full-stack web application that helps users record important decisions, track outcomes, and analyze them using AI. The platform allows users to organize decisions, receive AI-generated feedback, and identify patterns to improve future decision-making.

## Features

User authentication with Supabase (Email/Password + Google Sign-In)
Create, edit, and manage personal decisions
Categorize decisions and track outcomes
AI-powered feedback on decisions
AI pattern analysis to identify trends in past decisions
General AI question assistant
Secure user-specific data using Row Level Security (RLS)
Responsive dashboard UI

## Tech Stack

Frontend

Next.js
React
Tailwind CSS

## Backend

Supabase
PostgreSQL

## AI Integration
Hugging Face Inference API

## Deployment
Vercel

## Architecture
Frontend (Next.js + Tailwind)
        |
        | API Requests
        v
Next.js API Routes
        |
        |---- Supabase (Auth + Database)
        |
        |---- Hugging Face API (AI Responses)

## Flow:

User logs in via Supabase authentication.
Decisions are stored in PostgreSQL through Supabase.
AI requests are processed through Hugging Face API.
The dashboard displays insights and analytics.

## Installation
1. Clone the repository
git clone https://github.com/yourname/ai-decision-logger.git
cd ai-decision-logger
2. Install dependencies
npm install
3. Setup environment variables

Create .env.local

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
HF_API_KEY=
4. Run the development server
npm run dev

Open:
http://localhost:3000

## ScreenShots
![image alt](https://github.com/NageshShankar/ai-decision-logger/blob/main/Screenshot%202026-03-11%20124626.png?raw=true)

