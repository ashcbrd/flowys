<p align="center">
  <h1 align="center">Flowys</h1>
  <p align="center">
    <strong>Visual AI Workflow Automation Platform</strong>
  </p>
  <p align="center">
    Build, execute, and manage AI-powered workflows with a node-based visual editor
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#node-types">Node Types</a> •
  <a href="#webhooks">Webhooks</a> •
  <a href="#configuration">Configuration</a>
</p>

---

## Overview

Flowys is a full-stack workflow automation platform that enables you to design, execute, and monitor AI-driven workflows through an intuitive drag-and-drop interface. Connect nodes to build complex data pipelines that integrate external APIs, process data with AI models, apply logic transformations, and deliver structured outputs.

**Tech Stack:** Next.js 16 • React 19 • MongoDB • TypeScript • Tailwind CSS • Zustand

---

## Features

### Visual Workflow Builder

- **Drag-and-drop canvas** powered by React Flow
- **6 node types** — Input, API, AI/LLM, Logic, Output, Webhook
- **Real-time execution** with live status updates
- **Undo/Redo** support with full history tracking
- **Collapsible sidebar** for node library

### AI Integration

- **OpenAI** — GPT-4o, GPT-4o-mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic** — Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Structured outputs** with JSON Schema validation
- **Prompt templates** with `{{variable}}` injection

### Workflow Management

- **Version control** — Save, restore, and compare workflow versions
- **Duplicate workflows** — Clone existing workflows instantly
- **Execution history** — Track all runs with detailed logs
- **Error analysis** — AI-powered error diagnostics

### Developer API

- **RESTful API v1** with Bearer token authentication
- **Scoped API keys** — Fine-grained access control
- **Webhook triggers** — Incoming and outgoing webhooks
- **Async execution** — Background workflow processing

### AI Assistant

- **Built-in chat widget** for workflow assistance
- **Context-aware suggestions** and troubleshooting

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI and/or Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/flowys.git
cd flowys

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Environment Setup

```env
# Database
MONGODB_URI=mongodb://localhost:27017/flowys

# LLM Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the workflow editor.

---

## Project Structure

```
flowys/
├── app/
│   ├── api/                    # API routes
│   │   ├── v1/                 # Public API v1
│   │   │   ├── workflows/      # Workflow CRUD + trigger
│   │   │   └── executions/     # Execution status
│   │   ├── workflows/          # Internal workflow API
│   │   ├── executions/         # Execution history
│   │   ├── webhooks/           # Webhook management
│   │   ├── api-keys/           # API key management
│   │   └── chat/               # AI chat endpoint
│   ├── workflow/               # Workflow editor pages
│   │   ├── [id]/               # Edit workflow by ID
│   │   └── [id]/version/       # View workflow versions
│   └── docs/                   # Documentation page
├── components/
│   ├── canvas/                 # Workflow canvas
│   ├── nodes/                  # Node type components
│   ├── panels/                 # UI panels (sidebar, header, etc.)
│   ├── chat/                   # AI chat widget
│   └── ui/                     # Primitives (button, input, etc.)
├── lib/
│   ├── engine/                 # Workflow execution engine
│   ├── nodes/                  # Node handlers
│   ├── providers/              # LLM provider implementations
│   ├── db/                     # MongoDB schemas & models
│   ├── middleware/             # Auth middleware
│   └── services/               # Webhook service
└── store/                      # Zustand state management
```

---

## Node Types

### Input Node

Entry point for workflow data. Define input fields with types and defaults.

```json
{
  "fields": [
    { "name": "text", "type": "string", "required": true },
    { "name": "count", "type": "number", "default": 10 }
  ]
}
```

### API Node

HTTP requests to external services with template variable support.

```json
{
  "url": "https://api.example.com/search?q={{query}}",
  "method": "GET",
  "headers": { "Authorization": "Bearer {{apiKey}}" },
  "responseMapping": { "results": "data.items" }
}
```

### AI Node

LLM inference with structured JSON output.

```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "systemPrompt": "You are a data analyst.",
  "userPromptTemplate": "Analyze: {{text}}",
  "temperature": 0.7,
  "outputSchema": {
    "type": "object",
    "properties": {
      "summary": { "type": "string" },
      "sentiment": { "type": "string" }
    }
  }
}
```

### Logic Node

Data transformation and filtering operations.

| Operation   | Description                      |
| ----------- | -------------------------------- |
| `filter`    | Filter array items by condition  |
| `map`       | Transform each item              |
| `reduce`    | Aggregate values                 |
| `condition` | Branch based on expression       |
| `transform` | Custom JavaScript transformation |

### Output Node

Format and return final workflow results.

### Webhook Node

Trigger outgoing HTTP requests on workflow events.

---

## API Reference

### Authentication

All API v1 endpoints require Bearer token authentication:

```bash
curl -H "Authorization: Bearer ask_YOUR_API_KEY" \
     https://your-domain.com/api/v1/workflows
```

### Workflows

| Method | Endpoint                        | Description      |
| ------ | ------------------------------- | ---------------- |
| GET    | `/api/v1/workflows`             | List workflows   |
| GET    | `/api/v1/workflows/:id`         | Get workflow     |
| PUT    | `/api/v1/workflows/:id`         | Update workflow  |
| DELETE | `/api/v1/workflows/:id`         | Delete workflow  |
| POST   | `/api/v1/workflows/:id/trigger` | Execute workflow |

### Trigger Workflow

```bash
# Synchronous execution
curl -X POST /api/v1/workflows/{id}/trigger \
     -H "Authorization: Bearer ask_..." \
     -H "Content-Type: application/json" \
     -d '{"input": {"text": "Hello world"}}'

# Asynchronous execution
curl -X POST /api/v1/workflows/{id}/trigger \
     -H "Authorization: Bearer ask_..." \
     -H "X-Async: true" \
     -d '{"input": {...}}'
```

**Response (sync):**

```json
{
  "data": {
    "executionId": "uuid",
    "status": "completed",
    "output": { ... },
    "duration": 1234
  }
}
```

**Response (async):**

```json
{
  "data": {
    "executionId": "uuid",
    "status": "running",
    "statusUrl": "/api/v1/executions/{id}"
  }
}
```

### Executions

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| GET    | `/api/v1/executions/:id` | Get execution status |

### Workflow Versions

| Method | Endpoint                                 | Description     |
| ------ | ---------------------------------------- | --------------- |
| GET    | `/api/workflows/:id/versions`            | List versions   |
| POST   | `/api/workflows/:id/versions`            | Create version  |
| GET    | `/api/workflows/:id/versions/:versionId` | Get version     |
| POST   | `/api/workflows/:id/versions/:versionId` | Restore version |
| DELETE | `/api/workflows/:id/versions/:versionId` | Delete version  |

---

## Webhooks

### Incoming Webhooks

Trigger workflows via HTTP POST to a unique webhook URL.

```bash
POST /api/webhooks/incoming/{slug}
X-Webhook-Signature: sha256=...
Content-Type: application/json

{ "event": "user.created", "data": { ... } }
```

### Outgoing Webhooks

Subscribe to workflow events and receive HTTP callbacks.

**Events:**

- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `node.started`
- `node.completed`
- `node.failed`

---

## API Key Scopes

| Scope               | Description                    |
| ------------------- | ------------------------------ |
| `workflows:read`    | Read workflow definitions      |
| `workflows:write`   | Create/update/delete workflows |
| `workflows:execute` | Trigger workflow execution     |
| `executions:read`   | Read execution history         |
| `webhooks:read`     | Read webhook configurations    |
| `webhooks:write`    | Create/update/delete webhooks  |
| `full_access`       | All permissions                |

---

## Configuration

### Environment Variables

| Variable            | Description               | Required |
| ------------------- | ------------------------- | -------- |
| `MONGODB_URI`       | MongoDB connection string | Yes      |
| `OPENAI_API_KEY`    | OpenAI API key            | No\*     |
| `ANTHROPIC_API_KEY` | Anthropic API key         | No\*     |

\* At least one LLM provider key is required for AI nodes.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

<p align="center">
  Built with Next.js, React Flow, and MongoDB
</p>
