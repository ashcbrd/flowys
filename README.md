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
- **7 node types** — Input, API, AI/LLM, Logic, Integration, Webhook, Output
- **Real-time execution** with live status updates
- **Undo/Redo** support with full history tracking
- **Auto-layout** for automatic node arrangement
- **Export/Import** workflows as JSON files

### AI Integration

- **OpenAI** — GPT-4o, GPT-4o-mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic** — Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Structured outputs** with JSON Schema validation
- **Prompt templates** with `{{variable}}` injection

### AI Assistant (Flux)

- **Built-in chat widget** for workflow assistance
- **Workflow generation** — Describe what you want, Flux builds it
- **Error analysis** — AI-powered diagnostics and auto-fix suggestions
- **Context-aware** — Understands your current workflow state

### Workflow Management

- **Version control** — Save, restore, and compare workflow versions
- **Duplicate workflows** — Clone existing workflows instantly
- **Execution history** — Track all runs with detailed logs and output drawer
- **Scheduled runs** — Automate workflows on a schedule
- **Export/Import** — Share workflows as JSON files

### Developer API

- **RESTful API v1** with Bearer token authentication
- **Scoped API keys** — Fine-grained access control
- **Webhook triggers** — Incoming and outgoing webhooks
- **Async execution** — Background workflow processing

### Subscription & Billing

- **Tiered plans** — Free, Builder, and Team
- **Credit-based usage** with real-time tracking
- **Plan-based feature gating** — Node types, limits, and features
- **In-app subscription management** — Upgrade, downgrade, and cancel
- **Enterprise contact** — Custom plans for large organizations

---

## Subscription Plans

### Plan Comparison

| Feature | Free | Builder | Team |
| ------- | ---- | ------- | ---- |
| Workflows | 3 | 10 | Unlimited |
| Nodes per workflow | 4 | 25 | Unlimited |
| Monthly credits | 100 | 500 - 50,000 | 500 - 50,000 |
| Input, Logic, API, Output nodes | Yes | Yes | Yes |
| AI nodes | No | Yes | Yes |
| Webhook nodes | No | Yes | Yes |
| Integration nodes | No | Yes | Yes |
| Export/Import | No | Yes | Yes |
| Flux AI assistant | No | Yes | Yes |
| Team collaboration | No | No | Yes |
| Priority support | No | No | Yes |

### Credit Costs per Node

| Node Type | Credit Cost |
| --------- | ----------- |
| Input | Free |
| Output | Free |
| Logic | 1 credit |
| API | 1 credit |
| Webhook | 1 credit |
| Integration | 1 credit |
| AI | 10 credits |

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
│   │   ├── billing/            # Subscription & checkout
│   │   ├── contact/            # Enterprise contact form
│   │   └── flux/               # AI assistant endpoint
│   ├── workflow/               # Workflow editor pages
│   │   ├── [id]/               # Edit workflow by ID
│   │   └── [id]/version/       # View workflow versions
│   ├── settings/               # Settings pages
│   │   ├── subscription/       # Subscription management
│   │   ├── webhooks/           # Webhook configuration
│   │   └── api-keys/           # API key management
│   ├── contact/                # Enterprise contact page
│   ├── pricing/                # Pricing page
│   └── docs/                   # Documentation page
├── components/
│   ├── canvas/                 # Workflow canvas
│   ├── nodes/                  # Node type components
│   ├── panels/                 # UI panels (sidebar, header, etc.)
│   ├── flux/                   # AI chat widget
│   ├── shared/                 # Shared components (PricingSection, UpgradeModal)
│   └── ui/                     # Primitives (button, input, etc.)
├── lib/
│   ├── engine/                 # Workflow execution engine
│   ├── nodes/                  # Node handlers
│   ├── providers/              # LLM provider implementations
│   ├── payments/               # DodoPayments integration
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

LLM inference with structured JSON output. **Requires Builder or Team plan.**

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

### Integration Node

Connect to third-party apps. **Requires Builder or Team plan.**

- Slack
- GitHub
- Gmail
- Google Sheets
- And more...

### Webhook Node

Trigger outgoing HTTP requests on workflow events. **Requires Builder or Team plan.**

### Output Node

Format and return final workflow results.

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

## Payments & Subscriptions

Flowys uses [DodoPayments](https://dodopayments.com) for subscription billing with a credit-based system.

### Subscription Features

- **Real-time credits display** in header
- **In-app upgrade modal** — Upgrade without leaving the editor
- **Cancel subscription** — Cancel at period end or immediately
- **Usage tracking** — Monitor credit consumption

### Credit Tiers

Each paid plan offers 7 credit tiers:

| Tier | Credits | Builder Price | Team Price |
| ---- | ------- | ------------- | ---------- |
| 0    | 500     | $9/mo         | $19/mo     |
| 1    | 1,000   | $15/mo        | $29/mo     |
| 2    | 2,500   | $29/mo        | $49/mo     |
| 3    | 5,000   | $49/mo        | $79/mo     |
| 4    | 10,000  | $79/mo        | $129/mo    |
| 5    | 25,000  | $149/mo       | $229/mo    |
| 6    | 50,000  | $249/mo       | $399/mo    |

### DodoPayments Setup

1. Create an account at [DodoPayments](https://dodopayments.com)
2. Get your API keys from the dashboard (both test and live modes)
3. Create 14 subscription products (7 Builder tiers + 7 Team tiers)
4. Copy the auto-generated product IDs to your `.env` file
5. Configure webhook endpoints

### Creating Products in DodoPayments

For each tier in both plans, create a subscription product in DodoPayments:

**Builder Plan Products:**
- Name: `Builder - 500 Credits`, Price: $9/mo, Billing: Monthly
- Name: `Builder - 1,000 Credits`, Price: $15/mo, Billing: Monthly
- ... (repeat for all 7 tiers)

**Team Plan Products:**
- Name: `Team - 500 Credits`, Price: $19/mo, Billing: Monthly
- Name: `Team - 1,000 Credits`, Price: $29/mo, Billing: Monthly
- ... (repeat for all 7 tiers)

After creating each product, copy its auto-generated product ID to your environment variables:

```env
# Test Mode Product IDs
DODO_PRODUCT_TEST_BUILDER_0=pdt_xxxxx  # 500 credits
DODO_PRODUCT_TEST_BUILDER_1=pdt_xxxxx  # 1,000 credits
# ... etc

DODO_PRODUCT_TEST_TEAM_0=pdt_xxxxx     # 500 credits
DODO_PRODUCT_TEST_TEAM_1=pdt_xxxxx     # 1,000 credits
# ... etc

# Live Mode Product IDs (same pattern)
DODO_PRODUCT_LIVE_BUILDER_0=pdt_xxxxx
# ... etc
```

### Running in Test Mode

For development and testing:

```env
# Set environment to test mode
DODO_PAYMENTS_ENVIRONMENT=test_mode

# Test mode credentials (from DodoPayments test dashboard)
DODO_PAYMENTS_API_KEY_TEST=your_test_api_key
DODO_WEBHOOK_SECRET_TEST=your_test_webhook_secret
```

**Webhook Setup for Testing:**

1. Start your local server: `npm run dev`
2. Expose localhost with ngrok: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)
4. In DodoPayments **test mode** dashboard, add webhook endpoint:
   ```
   https://abc123.ngrok-free.app/api/webhooks/dodo
   ```
5. Subscribe to events:
   - `subscription.active`
   - `subscription.renewed`
   - `subscription.on_hold`
   - `subscription.failed`
   - `subscription.cancelled`
   - `subscription.updated`
   - `payment.succeeded`
   - `payment.failed`

### Running in Live Mode

For production:

```env
# Set environment to live mode
DODO_PAYMENTS_ENVIRONMENT=live_mode

# Live mode credentials (from DodoPayments live dashboard)
DODO_PAYMENTS_API_KEY_LIVE=your_live_api_key
DODO_WEBHOOK_SECRET_LIVE=your_live_webhook_secret
```

**Webhook Setup for Production:**

In DodoPayments **live mode** dashboard, add webhook endpoint:
```
https://your-domain.com/api/webhooks/dodo
```

### Billing API Endpoints

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/subscription`     | Get subscription & usage info |
| POST   | `/api/billing/checkout` | Create checkout session       |
| POST   | `/api/billing/cancel`   | Cancel subscription           |

---

## Configuration

### Environment Variables

| Variable                      | Description                        | Required |
| ----------------------------- | ---------------------------------- | -------- |
| `MONGODB_URI`                 | MongoDB connection string          | Yes      |
| `ENCRYPTION_KEY`              | 32+ char key for credential encryption | Yes  |
| `OPENAI_API_KEY`              | OpenAI API key                     | No\*     |
| `ANTHROPIC_API_KEY`           | Anthropic API key                  | No\*     |
| `DODO_PAYMENTS_ENVIRONMENT`   | `test_mode` or `live_mode`         | Yes\*\*  |
| `DODO_PAYMENTS_API_KEY_TEST`  | DodoPayments test API key          | Yes\*\*  |
| `DODO_WEBHOOK_SECRET_TEST`    | DodoPayments test webhook secret   | Yes\*\*  |
| `DODO_PAYMENTS_API_KEY_LIVE`  | DodoPayments live API key          | No\*\*\* |
| `DODO_WEBHOOK_SECRET_LIVE`    | DodoPayments live webhook secret   | No\*\*\* |
| `DODO_PRODUCT_TEST_*`         | Test mode product IDs (14 total)   | Yes\*\*  |
| `DODO_PRODUCT_LIVE_*`         | Live mode product IDs (14 total)   | No\*\*\* |

\* At least one LLM provider key is required for AI nodes.

\*\* Required for subscription features. Set `DODO_PAYMENTS_ENVIRONMENT` to select mode.

\*\*\* Required only when running in `live_mode`.

See `.env.example` for the full list of product ID environment variables.

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
