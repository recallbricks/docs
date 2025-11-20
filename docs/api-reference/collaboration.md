# Collaboration API

Multi-agent coordination, reputation tracking, and knowledge synthesis.

---

## Register Agent

Create an agent identity for collaboration.

### Endpoint

```http
POST /v1/collaboration/agents
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `agentId` | string | Yes | Unique agent identifier |
| `role` | string | Yes | Agent role (e.g., `research`, `support`) |
| `capabilities` | array | No | Agent capabilities |
| `metadata` | object | No | Additional agent metadata |

### Request Example

**TypeScript:**
```typescript
const agent = await rb.collaboration.registerAgent({
  agentId: 'research-agent-1',
  role: 'research',
  capabilities: ['web_search', 'data_analysis', 'summarization'],
  metadata: {
    team: 'market_research',
    region: 'US'
  }
});

console.log(agent.agentId);
```

**Python:**
```python
agent = rb.collaboration.register_agent(
    agent_id='research-agent-1',
    role='research',
    capabilities=['web_search', 'data_analysis', 'summarization'],
    metadata={'team': 'market_research', 'region': 'US'}
)
```

### Response

```json
{
  "success": true,
  "data": {
    "agentId": "research-agent-1",
    "role": "research",
    "capabilities": ["web_search", "data_analysis", "summarization"],
    "metadata": {
      "team": "market_research",
      "region": "US"
    },
    "reputationScore": 0.5,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

## Get Agent Reputation

Retrieve an agent's trust score and performance metrics.

### Endpoint

```http
GET /v1/collaboration/agents/:agentId/reputation
```

### Request Example

**TypeScript:**
```typescript
const reputation = await rb.collaboration.getReputation('research-agent-1');

console.log(reputation.reputationScore);
console.log(reputation.totalContributions);
```

**Python:**
```python
reputation = rb.collaboration.get_reputation('research-agent-1')

print(reputation.reputation_score)
print(reputation.total_contributions)
```

### Response

```json
{
  "success": true,
  "data": {
    "agentId": "research-agent-1",
    "reputationScore": 0.92,
    "tier": "Expert",
    "totalContributions": 847,
    "successfulRetrievals": 798,
    "averageConfidence": 0.89,
    "consistencyScore": 0.94,
    "topCategories": ["market_research", "competitor_analysis"],
    "performanceHistory": [
      { "date": "2025-01-01", "score": 0.85 },
      { "date": "2025-01-08", "score": 0.89 },
      { "date": "2025-01-15", "score": 0.92 }
    ]
  }
}
```

---

## Synthesize Memories

Combine memories from multiple agents with reputation weighting.

### Endpoint

```http
POST /v1/collaboration/synthesize
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `agentMemories` | array | Yes | Array of agent memory objects |
| `topic` | string | No | Focus topic for synthesis |
| `minConfidence` | number | No | Minimum confidence (default: 0.7) |
| `minReputation` | number | No | Minimum agent reputation (default: 0.6) |

### Request Example

**TypeScript:**
```typescript
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    {
      agentId: 'researcher',
      memories: ['mem_123', 'mem_456'],
      reputation: 0.94
    },
    {
      agentId: 'analyst',
      memories: ['mem_789'],
      reputation: 0.88
    }
  ],
  topic: 'AI market trends',
  minConfidence: 0.8
});

console.log(synthesis.synthesizedMemories);
console.log(synthesis.topContributors);
```

**Python:**
```python
synthesis = rb.collaboration.synthesize(
    agent_memories=[
        {
            'agent_id': 'researcher',
            'memories': ['mem_123', 'mem_456'],
            'reputation': 0.94
        },
        {
            'agent_id': 'analyst',
            'memories': ['mem_789'],
            'reputation': 0.88
        }
    ],
    topic='AI market trends',
    min_confidence=0.8
)
```

### Response

```json
{
  "success": true,
  "data": {
    "synthesizedMemories": [
      {
        "content": "AI coding tools market grew 300% in 2024, with 73% developer adoption",
        "contributingAgents": ["researcher", "analyst"],
        "confidence": 0.93,
        "sources": ["mem_123", "mem_789"],
        "reputationWeighted": true
      }
    ],
    "topContributors": [
      { "agentId": "researcher", "contribution": 0.62 },
      { "agentId": "analyst", "contribution": 0.38 }
    ],
    "aggregateConfidence": 0.91,
    "synthesisMethod": "reputation_weighted_average"
  }
}
```

---

## Get Agent Memories

Retrieve memories created by specific agent(s).

### Endpoint

```http
GET /v1/collaboration/agents/:agentId/memories
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `agentId` | string | No | Specific agent ID |
| `minReputation` | number | No | Minimum reputation filter |
| `category` | string | No | Metadata category filter |
| `limit` | number | No | Max results (default: 20) |

### Request Example

**TypeScript:**
```typescript
const memories = await rb.collaboration.getAgentMemories({
  agentId: 'researcher',
  minReputation: 0.8,
  category: 'market_research',
  limit: 10
});
```

**Python:**
```python
memories = rb.collaboration.get_agent_memories(
    agent_id='researcher',
    min_reputation=0.8,
    category='market_research',
    limit=10
)
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "mem_abc123",
      "content": "Market research finding...",
      "agentId": "researcher",
      "agentReputation": 0.94,
      "metadata": { "category": "market_research" },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Compare Agents

Compare performance of multiple agents.

### Endpoint

```http
POST /v1/collaboration/agents/compare
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `agentIds` | array | Yes | Array of agent IDs to compare |
| `metrics` | array | No | Metrics to compare (default: all) |

### Request Example

**TypeScript:**
```typescript
const comparison = await rb.collaboration.compareAgents({
  agentIds: ['agent-1', 'agent-2', 'agent-3'],
  metrics: ['reputationScore', 'totalContributions', 'averageConfidence']
});

console.log(comparison.topPerformer);
console.log(comparison.rankings);
```

**Python:**
```python
comparison = rb.collaboration.compare_agents(
    agent_ids=['agent-1', 'agent-2', 'agent-3'],
    metrics=['reputation_score', 'total_contributions', 'average_confidence']
)
```

### Response

```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "agentId": "agent-1",
        "reputationScore": 0.94,
        "totalContributions": 847,
        "averageConfidence": 0.91,
        "rank": 1
      },
      {
        "agentId": "agent-2",
        "reputationScore": 0.88,
        "totalContributions": 623,
        "averageConfidence": 0.86,
        "rank": 2
      },
      {
        "agentId": "agent-3",
        "reputationScore": 0.76,
        "totalContributions": 412,
        "averageConfidence": 0.79,
        "rank": 3
      }
    ],
    "topPerformer": "agent-1",
    "insights": [
      "agent-1 excels in market_research category",
      "agent-2 has highest contribution consistency",
      "agent-3 is improving rapidly (15% increase this month)"
    ]
  }
}
```

---

## Update Agent

Update agent metadata or capabilities.

### Endpoint

```http
PATCH /v1/collaboration/agents/:agentId
```

### Request Example

**TypeScript:**
```typescript
await rb.collaboration.updateAgent('research-agent-1', {
  capabilities: ['web_search', 'data_analysis', 'ml_modeling'],
  metadata: {
    team: 'market_research',
    specialization: 'AI_trends'
  }
});
```

**Python:**
```python
rb.collaboration.update_agent(
    'research-agent-1',
    capabilities=['web_search', 'data_analysis', 'ml_modeling'],
    metadata={'team': 'market_research', 'specialization': 'AI_trends'}
)
```

---

## Use Cases

### 1. Research Team Collaboration

```typescript
// Register specialized agents
const webResearcher = await rb.collaboration.registerAgent({
  agentId: 'web-researcher',
  role: 'web_research'
});

const dataAnalyst = await rb.collaboration.registerAgent({
  agentId: 'data-analyst',
  role: 'data_analysis'
});

// Each creates memories
await rb.memories.create({
  content: '73% of developers use AI coding tools',
  metadata: { agentId: 'web-researcher', source: 'study' }
});

await rb.memories.create({
  content: 'Our data shows 68% adoption rate',
  metadata: { agentId: 'data-analyst', source: 'internal' }
});

// Synthesize findings (weighted by reputation)
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    { agentId: 'web-researcher', reputation: 0.91 },
    { agentId: 'data-analyst', reputation: 0.88 }
  ],
  topic: 'AI tool adoption'
});
```

### 2. Customer Support Quality Control

```typescript
// Get memories only from high-reputation agents
const trustedSolutions = await rb.collaboration.getAgentMemories({
  minReputation: 0.85,
  category: 'technical_solutions'
});

// Route customer queries to best agents
const agentComparison = await rb.collaboration.compareAgents({
  agentIds: ['support-1', 'support-2', 'support-3']
});

const bestAgent = agentComparison.topPerformer;
```

### 3. Multi-Region Agents

```typescript
// Agents in different regions
const usAgent = await rb.collaboration.registerAgent({
  agentId: 'us-agent',
  role: 'regional_research',
  metadata: { region: 'US' }
});

const euAgent = await rb.collaboration.registerAgent({
  agentId: 'eu-agent',
  role: 'regional_research',
  metadata: { region: 'EU' }
});

// Synthesize global insights
const globalSynthesis = await rb.collaboration.synthesize({
  agentMemories: [
    { agentId: 'us-agent', reputation: 0.91 },
    { agentId: 'eu-agent', reputation: 0.89 }
  ],
  topic: 'global market trends'
});
```

---

## Best Practices

### 1. Use Descriptive Agent IDs

```typescript
// ✅ Good
agentId: 'technical-support-senior-1'
agentId: 'market-researcher-us-west'

// ❌ Bad
agentId: 'agent1'
agentId: 'bot'
```

### 2. Monitor Reputation

```typescript
const reputation = await rb.collaboration.getReputation(agentId);

if (reputation.reputationScore < 0.6) {
  console.warn('Agent needs retraining or review');
}
```

### 3. Filter by Reputation

```typescript
// Only use high-reputation agents for critical tasks
const synthesis = await rb.collaboration.synthesize({
  agentMemories: agents,
  minReputation: 0.8,
  minConfidence: 0.85
});
```

---

**[← Back to Metacognition API](metacognition.md)** | **[Next: Monitoring API →](monitoring.md)**
