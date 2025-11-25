# Multi-Agent Collaboration (Phase 3)

Enable multiple AI agents to collaborate, share knowledge, and build reputation.

---

## What is Multi-Agent Collaboration?

**Phase 3** of RecallBricks metacognition: Multiple AI agents can share memories, track reputation, and collaborate intelligently.

### The Core Idea

Instead of isolated AI agents with separate knowledge:

```
Agent A ──→ Memory Store A
Agent B ──→ Memory Store B
Agent C ──→ Memory Store C
```

You get collaborative agents with shared intelligence:

```
                  ┌─────────────────┐
Agent A ────────→ │                 │
                  │  RecallBricks   │ ←── Reputation Tracking
Agent B ────────→ │  Shared Memory  │ ←── Knowledge Synthesis
                  │                 │ ←── Collaborative Filtering
Agent C ────────→ │                 │
                  └─────────────────┘
```

**Agents learn from each other. Trust scores determine influence.**

---

## Why Multi-Agent Collaboration?

### The Problem with Isolated Agents

In traditional systems:
- Each agent has its own memory
- No knowledge sharing between agents
- No way to track which agents are reliable
- Duplicate work across agents
- No collaborative intelligence

### The RecallBricks Solution

With multi-agent collaboration:
- **Shared knowledge base:** All agents contribute to and learn from the same memory
- **Reputation tracking:** Agents build trust scores based on performance
- **Weighted synthesis:** High-reputation agents have more influence
- **Collaborative filtering:** Agents discover memories from other successful agents
- **Team intelligence:** The collective gets smarter over time

---

## How It Works

### 1. Agent Registration

Each agent gets a unique identity:

```typescript
const researcher = await rb.collaboration.registerAgent({
  agentId: 'researcher',
  role: 'research',
  capabilities: ['web_search', 'data_analysis']
});

const analyst = await rb.collaboration.registerAgent({
  agentId: 'analyst',
  role: 'analysis',
  capabilities: ['pattern_detection', 'summarization']
});
```

### 2. Agent Memory Creation

Agents create memories tagged with their identity:

```typescript
// Researcher agent creates a memory
await rb.createMemory('Latest market trend: AI coding assistants up 300% in 2024', {
  metadata: {
    agentId: 'researcher',
    source: 'market_research',
    confidence: 0.92
  }
});

// Analyst agent creates a memory
await rb.createMemory('Pattern detected: Developer productivity increased with AI tools', {
  metadata: {
    agentId: 'analyst',
    source: 'data_analysis',
    confidence: 0.88
  }
});
```

### 3. Reputation Tracking

RecallBricks tracks each agent's performance:

```typescript
const reputation = await rb.collaboration.getReputation('researcher');

console.log(reputation);
// {
//   agentId: 'researcher',
//   reputationScore: 0.94,
//   totalContributions: 847,
//   successfulRetrievals: 798,
//   averageConfidence: 0.91,
//   topCategories: ['market_research', 'competitor_analysis']
// }
```

**Reputation is calculated from:**
- How often the agent's memories are retrieved
- How useful those memories are (based on usage)
- Confidence scores of the agent's contributions
- Consistency over time

### 4. Collaborative Synthesis

Combine memories from multiple agents with reputation weighting:

```typescript
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    {
      agentId: 'researcher',
      memories: researcherMemories,
      reputation: 0.94  // High reputation
    },
    {
      agentId: 'analyst',
      memories: analystMemories,
      reputation: 0.88  // Good reputation
    },
    {
      agentId: 'intern',
      memories: internMemories,
      reputation: 0.65  // Lower reputation
    }
  ]
});

console.log(synthesis);
// {
//   synthesizedMemories: [
//     {
//       content: 'Combined insight: AI coding tools increase productivity by 40%',
//       contributingAgents: ['researcher', 'analyst'],
//       confidence: 0.93,
//       reputationWeighted: true
//     }
//   ],
//   topContributors: ['researcher', 'analyst'],
//   aggregateConfidence: 0.91
// }
```

**High-reputation agents have more influence in synthesis.**

---

## Reputation Scoring

### How Reputation is Calculated

```
Reputation Score = (
  0.4 × Retrieval Success Rate +
  0.3 × Average Confidence +
  0.2 × Consistency Score +
  0.1 × Contribution Volume
)
```

#### Components

1. **Retrieval Success Rate (40%)**
   - How often are this agent's memories retrieved?
   - Are they actually used after retrieval?

2. **Average Confidence (30%)**
   - What confidence scores does the agent assign?
   - Are they accurate (not over/under-confident)?

3. **Consistency Score (20%)**
   - Is the agent reliable over time?
   - Are there quality patterns or random spikes?

4. **Contribution Volume (10%)**
   - How many memories has the agent created?
   - More data → more confidence in reputation

### Reputation Tiers

| Score | Tier | Influence | Description |
|-------|------|-----------|-------------|
| **0.90-1.00** | Expert | Very High | Highly trusted, major influence |
| **0.75-0.89** | Proficient | High | Trusted, good influence |
| **0.60-0.74** | Competent | Medium | Reliable, moderate influence |
| **0.40-0.59** | Developing | Low | Learning, minor influence |
| **0.00-0.39** | Novice | Minimal | Unproven, minimal influence |

### Example: Reputation Evolution

```
Week 1: Agent "researcher"
  Contributions: 50
  Retrieval success: 60%
  Avg confidence: 0.75
  Reputation: 0.67 (Competent)

Week 4: Agent "researcher"
  Contributions: 250
  Retrieval success: 85%
  Avg confidence: 0.89
  Reputation: 0.86 (Proficient)

Week 12: Agent "researcher"
  Contributions: 800
  Retrieval success: 94%
  Avg confidence: 0.92
  Reputation: 0.94 (Expert)
```

---

## Real-World Examples

### Example 1: Research Team

You have 3 agents researching different aspects of a topic:

```typescript
// Agent 1: Web researcher
const webAgent = await rb.collaboration.registerAgent({
  agentId: 'web-researcher',
  role: 'web_research'
});

await rb.createMemory('Study shows 73% of developers use AI coding tools', {
  metadata: { agentId: 'web-researcher', source: 'academic_paper' }
});

// Agent 2: Data analyst
const dataAgent = await rb.collaboration.registerAgent({
  agentId: 'data-analyst',
  role: 'data_analysis'
});

await rb.createMemory('Our internal survey: 68% of devs use AI tools daily', {
  metadata: { agentId: 'data-analyst', source: 'internal_data' }
});

// Agent 3: Market researcher
const marketAgent = await rb.collaboration.registerAgent({
  agentId: 'market-researcher',
  role: 'market_research'
});

await rb.createMemory('Market size for AI dev tools: $4.2B in 2024', {
  metadata: { agentId: 'market-researcher', source: 'market_report' }
});

// Synthesize all findings
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    { agentId: 'web-researcher', reputation: 0.91 },
    { agentId: 'data-analyst', reputation: 0.88 },
    { agentId: 'market-researcher', reputation: 0.85 }
  ],
  topic: 'AI coding tools adoption'
});

console.log(synthesis.synthesizedMemories);
// Combined insight weighted by each agent's reputation
```

### Example 2: Customer Support

Multiple support agents handling different specialties:

```typescript
// Technical support agent (high reputation)
await rb.createMemory('Fix for API timeout: Increase connection pool size to 50', {
  metadata: {
    agentId: 'tech-support-1',
    category: 'technical',
    successRate: 0.95
  }
});

// Billing support agent (medium reputation)
await rb.createMemory('Common billing issue: Check if payment method is expired', {
  metadata: {
    agentId: 'billing-support-1',
    category: 'billing',
    successRate: 0.78
  }
});

// New agent (low reputation)
await rb.createMemory('Try restarting the app', { // Generic, low-value advice
  metadata: {
    agentId: 'new-agent-1',
    category: 'general',
    successRate: 0.52
  }
});

// When retrieving solutions, high-reputation agents surface first
const solutions = await rb.collaboration.getAgentMemories({
  category: 'technical',
  minReputation: 0.8  // Only from trusted agents
});
```

### Example 3: Content Generation

Multiple AI writers with different styles:

```typescript
// Register writers
const technicalWriter = await rb.collaboration.registerAgent({
  agentId: 'technical-writer',
  role: 'technical_writing'
});

const creativeWriter = await rb.collaboration.registerAgent({
  agentId: 'creative-writer',
  role: 'creative_writing'
});

// Each contributes content
// Over time, reputation shows which writer produces better content

const writerStats = await rb.collaboration.getReputation('technical-writer');
// {
//   reputationScore: 0.92,
//   avgUserEngagement: 0.89,  // High engagement with technical content
//   topPerformingContent: ['api-tutorials', 'technical-guides']
// }
```

---

## Collaborative APIs

### Register Agent

```typescript
const agent = await rb.collaboration.registerAgent({
  agentId: 'unique-agent-id',
  role: 'research',  // or 'analysis', 'support', etc.
  capabilities: ['web_search', 'data_processing'],
  metadata: { team: 'research', region: 'US' }
});
```

### Get Agent Reputation

```typescript
const reputation = await rb.collaboration.getReputation('agent-id');

console.log(reputation);
// {
//   agentId: 'agent-id',
//   reputationScore: 0.92,
//   totalContributions: 847,
//   successfulRetrievals: 798,
//   averageConfidence: 0.89,
//   consistencyScore: 0.94
// }
```

### Synthesize Agent Memories

```typescript
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    {
      agentId: 'agent-1',
      memories: ['mem_123', 'mem_456'],  // or full memory objects
      reputation: 0.94
    },
    {
      agentId: 'agent-2',
      memories: ['mem_789'],
      reputation: 0.86
    }
  ],
  topic: 'market trends',  // Optional: focus synthesis on topic
  minConfidence: 0.8  // Optional: minimum confidence threshold
});
```

### Get Agent Memories

```typescript
const memories = await rb.collaboration.getAgentMemories({
  agentId: 'researcher',  // Optional: specific agent
  minReputation: 0.8,  // Optional: minimum reputation
  category: 'market_research',  // Optional: metadata filter
  limit: 10
});
```

### Compare Agents

```typescript
const comparison = await rb.collaboration.compareAgents({
  agentIds: ['agent-1', 'agent-2', 'agent-3']
});

console.log(comparison);
// {
//   agents: [
//     { agentId: 'agent-1', reputation: 0.94, rank: 1 },
//     { agentId: 'agent-2', reputation: 0.88, rank: 2 },
//     { agentId: 'agent-3', reputation: 0.76, rank: 3 }
//   ],
//   topPerformer: 'agent-1',
//   insights: ['agent-1 excels in market_research', '...']
// }
```

---

## Use Cases

### 1. Multi-Agent Research System

**Scenario:** Build a research system with specialized agents

```typescript
// Specialized agents
const agents = {
  web: await rb.collaboration.registerAgent({ agentId: 'web', role: 'web_research' }),
  academic: await rb.collaboration.registerAgent({ agentId: 'academic', role: 'academic_research' }),
  data: await rb.collaboration.registerAgent({ agentId: 'data', role: 'data_analysis' })
};

// Each agent contributes findings
// System tracks which agent provides most valuable insights
// Future queries weighted by agent reputation
```

### 2. Customer Support Team

**Scenario:** Multiple support agents with different expertise levels

```typescript
// Senior agents build high reputation
// Junior agents learn from senior patterns
// Customer queries routed to high-reputation solutions first

const solution = await rb.collaboration.getAgentMemories({
  category: 'technical_issue',
  minReputation: 0.85  // Only senior agents
});
```

### 3. Content Moderation

**Scenario:** AI moderators flagging content

```typescript
// Multiple moderators flag content
// High-reputation moderators have more weight
// Consensus requires reputation-weighted agreement

const flags = await rb.collaboration.synthesize({
  agentMemories: moderatorFlags,
  minAggregateConfidence: 0.9  // Need high confidence for action
});
```

### 4. Distributed AI System

**Scenario:** Regional AI agents with local knowledge

```typescript
// US agent knows US market
// EU agent knows EU regulations
// Asia agent knows Asia trends

// Synthesize global insights weighted by regional expertise
const globalInsights = await rb.collaboration.synthesize({
  agentMemories: [
    { agentId: 'us-agent', reputation: 0.91 },
    { agentId: 'eu-agent', reputation: 0.89 },
    { agentId: 'asia-agent', reputation: 0.87 }
  ],
  topic: 'global market trends'
});
```

---

## Best Practices

### 1. Use Descriptive Agent IDs

```typescript
// ✅ Good: Descriptive IDs
agentId: 'technical-support-senior-1'
agentId: 'market-researcher-us'

// ❌ Bad: Generic IDs
agentId: 'agent1'
agentId: 'bot'
```

### 2. Track Agent Performance

```typescript
// ✅ Periodically check reputation
const reputation = await rb.collaboration.getReputation(agentId);

if (reputation.reputationScore < 0.6) {
  console.warn('Agent performance below threshold');
  // Retrain or investigate
}
```

### 3. Use Reputation Thresholds

```typescript
// ✅ Filter by minimum reputation
const trustedMemories = await rb.collaboration.getAgentMemories({
  minReputation: 0.8
});

// ✅ Weight synthesis by reputation
const synthesis = await rb.collaboration.synthesize({
  agentMemories: agents,
  minAggregateConfidence: 0.85
});
```

### 4. Assign Confidence Scores

```typescript
// ✅ Agents should assign realistic confidence
await rb.createMemory('...', {
  metadata: {
    agentId: 'researcher',
    confidence: 0.85  // Honest confidence assessment
  }
});

// ❌ Don't always use max confidence
confidence: 1.0  // Unrealistic
```

---

## Performance Impact

| Metric | Single Agent | Multi-Agent Collaboration | Improvement |
|--------|-------------|---------------------------|-------------|
| Knowledge coverage | 100% of 1 domain | 100% of N domains | **Nx coverage** |
| Solution accuracy | 75% | 88% | **13% better** |
| Response time | 500ms | 300ms | **40% faster** (cached) |
| Learning speed | Linear | Exponential | **Collective learning** |

---

## Key Takeaways

1. **Agents build reputation over time**
   - Based on contribution quality
   - Tracked automatically
   - Influences synthesis weighting

2. **Collaboration beats isolation**
   - Shared knowledge base
   - Learn from each other
   - Collective intelligence

3. **Trust scores drive decisions**
   - High-reputation agents have more influence
   - Low-reputation agents learn from experts
   - System self-regulates quality

---

## Next Steps

- **[Metacognition Overview](metacognition.md)** – The big picture
- **[API Reference: Collaboration](../api-reference/collaboration.md)** – Full API
- **[Example: Multi-Agent](../examples/multi-agent.ts)** – Working code
- **[Architecture](architecture.md)** – How it all fits together

---

**Build intelligent teams, not isolated agents.** RecallBricks enables true collaboration.
