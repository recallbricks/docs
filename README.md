# RecallBricks Documentation

> **Cognitive infrastructure for AI systems.** Not just a vector database—a self-learning memory layer that thinks about its own performance.

[![npm version](https://img.shields.io/npm/v/recallbricks)](https://www.npmjs.com/package/recallbricks)
[![PyPI version](https://img.shields.io/pypi/v/recallbricks)](https://pypi.org/project/recallbricks/)
[![API Status](https://img.shields.io/badge/API-99.9%25%20uptime-brightgreen)](https://recallbricks-api-clean.onrender.com/health)

## What is RecallBricks?

RecallBricks is the first AI memory system with **metacognition**—the ability to learn from its own usage patterns and optimize itself. While traditional vector databases just store and retrieve, RecallBricks:

- **Predicts** what you'll need before you ask
- **Learns** from every query to improve accuracy
- **Adapts** weighting strategies based on your usage
- **Collaborates** across multi-agent systems with reputation tracking

Think of it as the cognitive layer between your AI and its knowledge.

## Quick Start

Get running in 60 seconds:

```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks('your-api-key');

// Create a memory
await rb.memories.create({
  content: 'User prefers technical documentation with code examples',
  metadata: { category: 'preferences' }
});

// Ask RecallBricks what to retrieve next (metacognition!)
const prediction = await rb.metacognition.predict({
  context: 'User asked about API documentation'
});

console.log(prediction.suggestedMemories); // AI-powered suggestions
```

**[Start with the 60-second quickstart →](docs/getting-started/quickstart.md)**

---

## Documentation

### Getting Started

Perfect for your first 10 minutes with RecallBricks.

- **[Quickstart](docs/getting-started/quickstart.md)** – Working code in 60 seconds
- **[Installation](docs/getting-started/installation.md)** – One-command setup for TypeScript & Python
- **[Authentication](docs/getting-started/authentication.md)** – Get your API key and connect

### Core Concepts

Understand what makes RecallBricks different.

- **[Metacognition](docs/core-concepts/metacognition.md)** – The breakthrough that changes everything
- **[Self-Optimizing Memory](docs/core-concepts/self-optimizing-memory.md)** – Phase 1: Learning from usage
- **[Predictive Recall](docs/core-concepts/predictive-recall.md)** – Phase 2A: AI that anticipates needs
- **[Multi-Agent Collaboration](docs/core-concepts/multi-agent-collaboration.md)** – Phase 3: Team intelligence
- **[Architecture](docs/core-concepts/architecture.md)** – How it all works together

### API Reference

Complete reference for every endpoint.

- **[Overview](docs/api-reference/overview.md)** – Base URL, authentication, SDKs
- **[Memories](docs/api-reference/memories.md)** – CRUD operations for memory management
- **[Metacognition](docs/api-reference/metacognition.md)** – Predict, suggest, patterns, metrics
- **[Collaboration](docs/api-reference/collaboration.md)** – Multi-agent systems & reputation
- **[Monitoring](docs/api-reference/monitoring.md)** – Health checks, metrics, SLA

### Examples

Copy-paste working code for common use cases.

**TypeScript:**
- [Basic CRUD](docs/examples/basic-crud.ts) – Create, read, update, delete memories
- [Predictive Recall](docs/examples/predictive-recall.ts) – Let AI suggest what to retrieve
- [Weighted Search](docs/examples/weighted-search.ts) – Custom weighting strategies
- [Multi-Agent](docs/examples/multi-agent.ts) – Collaboration with reputation tracking
- [Chatbot Memory](docs/examples/chatbot-memory.ts) – Build a conversational AI
- [Real-World App](docs/examples/real-world-app.ts) – Comprehensive production example

**Python:**
- [Basic CRUD](docs/examples/basic-crud.py) – Create, read, update, delete memories
- [Predictive Recall](docs/examples/predictive-recall.py) – Let AI suggest what to retrieve
- [Weighted Search](docs/examples/weighted-search.py) – Custom weighting strategies
- [Multi-Agent](docs/examples/multi-agent.py) – Collaboration with reputation tracking
- [Chatbot Memory](docs/examples/chatbot-memory.py) – Build a conversational AI

### Guides

Best practices for production systems.

- **[Best Practices](docs/guides/best-practices.md)** – Do's and don'ts with examples
- **[Performance Optimization](docs/guides/performance-optimization.md)** – Speed & efficiency tips
- **[Security](docs/guides/security.md)** – Keep your data safe
- **[Error Handling](docs/guides/error-handling.md)** – Graceful failure patterns
- **[Rate Limits](docs/guides/rate-limits.md)** – Understanding tiers & quotas

### Troubleshooting

Get unstuck quickly.

- **[Common Issues](docs/troubleshooting/common-issues.md)** – Solutions to frequent problems
- **[FAQ](docs/troubleshooting/faq.md)** – Your questions, answered

---

## Key Features

### 🧠 Metacognition (The Game Changer)

RecallBricks doesn't just store memories—it **thinks about how it's being used**:

```typescript
// Traditional vector DB: You specify everything
const results = await db.search({ query: 'preferences', limit: 10 });

// RecallBricks: AI suggests what you actually need
const prediction = await rb.metacognition.predict({
  context: 'User asking about documentation preferences'
});
// Returns: weighted search strategy, suggested memories, confidence scores
```

### 🎯 Self-Optimizing Search

Automatically adjusts weighting based on what works:

```typescript
// RecallBricks learns that recency matters more for this user
const patterns = await rb.metacognition.getPatterns();
// Shows: { preferredWeighting: { recency: 0.7, relevance: 0.3 } }
```

### 🤝 Multi-Agent Intelligence

Agents build reputation and share knowledge:

```typescript
// Agent collaboration with trust scores
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    { agentId: 'analyst', memories: [...], reputation: 0.95 },
    { agentId: 'researcher', memories: [...], reputation: 0.87 }
  ]
});
```

---

## Why RecallBricks?

| Feature | Traditional Vector DB | RecallBricks |
|---------|----------------------|--------------|
| Storage | ✅ Yes | ✅ Yes |
| Semantic Search | ✅ Yes | ✅ Yes |
| Learns from usage | ❌ No | ✅ **Yes** |
| Predicts needs | ❌ No | ✅ **Yes** |
| Self-optimizes | ❌ No | ✅ **Yes** |
| Multi-agent collaboration | ❌ No | ✅ **Yes** |
| Metacognitive insights | ❌ No | ✅ **Yes** |

**RecallBricks is cognitive infrastructure. Not just a database.**

---

## Quick Links

- **[Changelog](CHANGELOG.md)** – Version history and updates
- **[API Status](https://recallbricks-api-clean.onrender.com/health)** – 99.9% uptime SLA
- **[npm Package](https://www.npmjs.com/package/recallbricks)** – TypeScript SDK
- **[PyPI Package](https://pypi.org/project/recallbricks/)** – Python SDK
- **[GitHub Issues](https://github.com/recallbricks/recallbricks/issues)** – Report bugs
- **[Community Discord](https://discord.gg/recallbricks)** – Get help & share ideas

---

## Support

- **Email:** support@recallbricks.com
- **Response Time:** <24 hours (business days)
- **Uptime SLA:** 99.9% availability
- **Performance SLA:** P95 latency <500ms

---

Built with precision. Designed for developers who demand the best.

**[Get started now →](docs/getting-started/quickstart.md)**
