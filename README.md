# Juno - AI-Powered Journaling Application

## 🌟 Overview

Juno is a modern, AI-powered journaling application designed to help users reflect, release, and reconnect with themselves. It provides a supportive space for emotional exploration, mood tracking, and personal growth through intelligent insights and personalized guidance.

## ✨ Features

### 🖊️ Daily Journaling

- **Rich Text Editor**: Write and organize your thoughts with a clean, intuitive interface
- **Mood Tracking**: Select and track your daily emotions with emoji-based mood indicators
- **AI-Powered Analysis**: Get personalized insights and sentiment analysis for your entries
- **Word Count Tracking**: Monitor your writing progress with automatic word counting

### 📊 Analytics & Insights

- **Sentiment Analysis**: Visualize emotional patterns over time with interactive charts
- **Mood Trends**: Track weekly and monthly mood patterns
- **AI Counseling**: Receive gentle guidance and suggestions based on your journal entries
- **Personal Growth Metrics**: Monitor your journaling consistency and emotional well-being

### 🏆 Gamification

- **Achievement Badges**: Earn badges for consistent journaling habits
- **Progress Tracking**: Celebrate milestones and writing streaks
- **Motivational Rewards**: Stay engaged with a rewarding achievement system

### 🤖 AI Assistant

- **Interactive Chat**: Communicate with an AI companion for reflection and guidance
- **Personalized Suggestions**: Receive tailored prompts and writing suggestions
- **Emotional Support**: Get empathetic responses and coping strategies

### 🔐 Privacy & Security

- **Secure Authentication**: User authentication and session management
- **Data Privacy**: Your journal entries remain private and secure
- **Personal Space**: A safe environment for honest self-reflection

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 6.26.2
- **Charts & Visualization**: Recharts 2.12.7
- **Form Handling**: React Hook Form 7.53.0 with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React 0.462.0
- **Testing**: Vitest 3.2.4 with coverage support

## 📁 Project Structure

```
src/
├── api/                 # API client and types
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AIChat.tsx      # AI chat interface
│   ├── JournalEntry.tsx # Journal entry component
│   ├── MoodSelector.tsx # Mood selection interface
│   └── ...
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Application pages/routes
│   ├── Dashboard.tsx   # Main dashboard
│   ├── AddJournal.tsx  # Journal entry creation
│   ├── Index.tsx       # Landing page
│   └── ...
└── integrations/       # Third-party integrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: install with [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd Juno-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or with bun
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or with bun
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code linting
- `npm run test` - Run test suite with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run deploy` - Build and deploy to AWS S3

## 🏗️ Development

### Code Style & Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (configured via editor)
- **Component Architecture**: Functional components with hooks
- **State Management**: React Query for server state, React Context for global client state

### Key Development Patterns

- **Custom Hooks**: Encapsulate complex logic and API interactions
- **Component Composition**: Build complex UIs from simple, reusable components
- **Type Safety**: Full TypeScript coverage with strict mode
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation support

## 🔌 API Integration

The application integrates with a custom FastAPI backend for:

- User authentication and session management
- Journal entry storage and retrieval
- AI-powered sentiment analysis
- Mood tracking and analytics

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalist interface with thoughtful spacing
- **Dark/Light Mode**: Automatic theme switching support
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Accessibility**: WCAG-compliant design with proper contrast ratios


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
