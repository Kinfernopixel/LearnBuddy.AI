# LearningTutor.AI 🎓🤖

**Your Personalized AI Learning Tutor**

---

## Table of Contents

- [About LearningTutor.AI](#about-learningtutorai)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Prompt Engineering](#prompt-engineering)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

---

## About LearningTutor.AI

**LearningTutor.AI** is a full-stack web app that brings the power of modern AI to your learning journey.  
Type in any topic or question (e.g., "REST APIs", "Machine Learning Basics", "How to write a resume"), and your AI tutor will:

- Generate a structured learning path in clear bullet points
- Create a daily study schedule
- Build interactive quizzes to reinforce your knowledge

You can create multiple chats—each saved separately—making it easy to keep your learning organized.

---

## Features

- **Personalized Learning Paths:** Get step-by-step guidance for any topic
- **Multiple Chat Sessions:** Start new chats for different topics—just like ChatGPT!
- **Clean, Responsive UI:** Modern interface with light blue themes and custom branding
- **AI-Generated Quizzes:** Check your understanding with custom quizzes
- **User Authentication:** (Coming soon—via Supabase Auth)
- **Persistent Storage:** (Coming soon—save your chats and progress to the cloud)
- **Free & Open Source:** Built using technologies with generous free tiers

---

## Tech Stack

**Frontend:**
- [React.js](https://react.dev/) (UI)
- [Vite](https://vitejs.dev/) (fast dev/build)
- [Tailwind CSS](https://tailwindcss.com/) (modern styling)

**Backend:**
- [Python 3 + Flask](https://flask.palletsprojects.com/) (API)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs) (AI engine)
- [python-dotenv](https://pypi.org/project/python-dotenv/) (env vars)
- [requests](https://docs.python-requests.org/en/master/) (HTTP)

**Database & Auth (coming soon):**
- [Supabase](https://supabase.com/) (PostgreSQL + Auth)

**Deployment:**
- [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/) (frontend)
- [Render](https://render.com/) / [Railway](https://railway.app/) (backend)
- [Supabase](https://supabase.com/) (DB/Auth)

---

## Architecture

```text
+------------------+     HTTP     +-------------------+      API      +-------------+
|   User Browser   | <----------> | Frontend (React)  | <----------> | Backend     |
|                  |              | (Vite/Vercel)     |              | (Flask/API) |
+------------------+              +-------------------+              +-------------+
           | (Supabase JS client)           | (requests)
           |                                |
           V                                V
    +-------------------+            +-------------------+
    | Supabase (DB/Auth)|            | Gemini API (AI)   |
    +-------------------+            +-------------------+
