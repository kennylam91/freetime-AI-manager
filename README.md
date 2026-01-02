# FreeTime AI Manager

A web-based application that helps users manage their free time with AI-powered assistance. The app features a chat interface where users can allocate time to different categories, log activities, and track their time spending.

![FreeTime Manager](https://github.com/user-attachments/assets/53e5dbd4-471b-4907-8797-e479318b7dc5)

## Features

- **Chat Interface**: Natural language interaction with an AI assistant for time management
- **Time Allocation**: Allocate your free time into different categories (Learning, Health, Entertainment, Social, Creative, etc.)
- **Activity Logging**: Log time spent on activities with descriptions
- **Real-time Statistics**: Visual progress tracking with charts and progress bars
- **Local Storage**: All data is stored locally in your browser
- **LLM Integration**: Connect to free external LLM APIs like Groq or HuggingFace

## Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **UI Library**: PrimeVue 4
- **Package Manager**: pnpm
- **Runtime**: Node.js 20+

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (will be installed if not available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kennylam91/freetime-AI-manager.git
cd freetime-AI-manager
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## Usage

### Basic Commands

The chat assistant understands natural language commands for managing your time:

#### Allocate Time
```
allocate 60 minutes to Learning
allocate 30 minutes to Health
```

#### Log Activities
```
log 30 minutes for Health - Morning workout
log 45 minutes for Learning - Reading a book
```

#### Check Status
```
How much time do I have remaining?
Show my spending allocation
```

### Configuring LLM API

1. Click the **Settings** button in the top-right corner
2. Enter your API configuration:
   - **API Base URL**: Default is `https://api.groq.com/openai/v1` (Groq API)
   - **Model Name**: Default is `llama-3.3-70b-versatile` (Llama 3.3 70B)
   - **API Key**: Your API key from the LLM provider

#### Recommended Free LLM Providers

- **Groq** (https://groq.com): Fast inference with Llama models
  - Base URL: `https://api.groq.com/openai/v1`
  - Model: `llama-3.3-70b-versatile`
  
- **HuggingFace** (https://huggingface.co): Various open-source models
  - Base URL: `https://api-inference.huggingface.co/models/{model-name}`

### Default Categories

The application comes with 5 default categories:

- 🔵 **Learning** (120 minutes) - Educational activities, courses, reading
- 🟢 **Health** (90 minutes) - Exercise, meditation, health activities
- 🟠 **Entertainment** (60 minutes) - Movies, games, leisure
- 🟣 **Social** (60 minutes) - Social interactions, family time
- 🔴 **Creative** (60 minutes) - Creative projects, hobbies

You can create new categories through the chat interface.

## Project Structure

```
freetime-AI-manager/
├── src/
│   ├── components/          # Vue components
│   │   ├── ChatInterface.vue
│   │   ├── StatsPanel.vue
│   │   └── SettingsDialog.vue
│   ├── composables/         # Vue composables
│   │   └── useFreeTimeManager.ts
│   ├── services/            # Business logic
│   │   ├── timeService.ts
│   │   └── llmService.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.vue              # Main application component
│   ├── main.ts              # Application entry point
│   └── style.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Privacy & Data

All data is stored locally in your browser's localStorage. No data is sent to external servers except for LLM API calls when configured. Your API keys are stored securely in localStorage and never shared.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
