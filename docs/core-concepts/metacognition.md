# Metacognition

The breakthrough that makes RecallBricks different from every other vector database.

---

## What is Metacognition?

**Metacognition** is thinking about thinking. It's the ability to observe and learn from your own cognitive processes.

In RecallBricks, metacognition means:
- The system **watches how it's being used**
- It **learns what works** and what doesn't
- It **predicts what you'll need** before you ask
- It **optimizes itself** automatically

### Traditional Vector DB vs RecallBricks

```typescript
// Traditional Vector DB: You do all the thinking
const results = await vectorDB.search({
  query: 'user preferences',
  limit: 10,
  weights: { semantic: 0.7, recency: 0.3 } // You guess these
});

// RecallBricks: The system thinks about what works
const prediction = await rb.metacognition.predict({
  context: 'User asking about documentation preferences'
});
// Returns: AI-suggested memories, optimal weights, confidence scores
```

**The difference:** RecallBricks doesn't just execute your queries—it **thinks about which queries will work best**.

---

## Why This Matters

### The Problem with Static Systems

Traditional vector databases are **dumb storage**:
1. You store vectors
2. You query vectors
3. You get results
4. **Nothing learns from this**

Every search requires YOU to:
- Figure out the right weighting strategy
- Tune similarity thresholds
- Decide how many results to retrieve
- Determine which metadata filters to apply

**This is cognitive load you shouldn't have to carry.**

### The RecallBricks Solution

RecallBricks has metacognition:
1. You store vectors
2. You query vectors
3. **RecallBricks observes the query**
4. **It learns what you tend to retrieve**
5. **It predicts what you'll need next**
6. **It suggests optimal strategies**

The system **gets smarter as you use it**.

---

## How Metacognition Works

### The Metacognitive Loop

```
┌─────────────────────────────────────────────────────┐
│                   1. USER ACTION                    │
│              (create, search, retrieve)             │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              2. SYSTEM OBSERVATION                  │
│    RecallBricks tracks: what, when, how, success    │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│               3. PATTERN DETECTION                  │
│   AI analyzes: frequent queries, optimal weights    │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              4. PREDICTIVE INSIGHTS                 │
│  System suggests: what to retrieve, how to weight   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│             5. SELF-OPTIMIZATION                    │
│   Automatic: weighting, ranking, caching            │
└─────────────────────────────────────────────────────┘
```

### Real Example

You're building a chatbot. Over time, RecallBricks observes:

- **Observation:** You query "user preferences" at the start of 87% of conversations
- **Pattern:** Recency matters more than semantic similarity for preferences
- **Prediction:** "This conversation will need user preferences soon"
- **Optimization:** Automatically adjusts weights: `{ recency: 0.8, semantic: 0.2 }`

**You didn't configure this. The system learned it.**

---

## The Three Phases of Metacognition

RecallBricks implements metacognition in phases:

### Phase 1: Self-Optimizing Memory (LIVE NOW)

**What:** The system tracks usage and optimizes retrieval strategies

**Examples:**
- Automatically adjusts semantic vs recency weighting
- Learns which metadata fields matter most
- Optimizes response times based on query patterns

```typescript
// The system learns your patterns
const patterns = await rb.metacognition.getPatterns();

console.log(patterns);
// {
//   queryPatterns: {
//     mostQueried: ['user_preferences', 'conversation_history'],
//     avgRetrievalTime: 245,
//     optimalWeights: { recency: 0.7, semantic: 0.3 }
//   }
// }
```

**[Read more: Self-Optimizing Memory →](self-optimizing-memory.md)**

### Phase 2A: Predictive Recall (LIVE NOW)

**What:** The system predicts what you'll need before you ask

**Examples:**
- "Based on this context, you'll probably need these memories"
- "This query type typically requires these weighting strategies"
- Confidence scores for predictions

```typescript
// Ask RecallBricks what to retrieve
const prediction = await rb.metacognition.predict({
  context: 'User asking about their past conversations'
});

console.log(prediction);
// {
//   suggestedMemories: [
//     { id: 'mem_123', content: '...', confidence: 0.94 },
//     { id: 'mem_456', content: '...', confidence: 0.87 }
//   ],
//   suggestedStrategy: {
//     weights: { recency: 0.8, semantic: 0.2 },
//     limit: 5
//   }
// }
```

**[Read more: Predictive Recall →](predictive-recall.md)**

### Phase 2B: Adaptive Weighting (COMING Q2 2025)

**What:** Real-time adjustment of weighting based on context

**Examples:**
- "This user cares more about recency"
- "This query type needs semantic similarity"
- Per-user learning profiles

### Phase 3: Multi-Agent Collaboration (LIVE NOW)

**What:** Multiple agents collaborate with reputation tracking

**Examples:**
- Agents share knowledge with trust scores
- High-performing agents have more influence
- Collaborative memory synthesis

```typescript
// Multiple agents collaborate
const synthesis = await rb.collaboration.synthesize({
  agentMemories: [
    { agentId: 'researcher', memories: [...], reputation: 0.95 },
    { agentId: 'analyst', memories: [...], reputation: 0.88 }
  ]
});
```

**[Read more: Multi-Agent Collaboration →](multi-agent-collaboration.md)**

---

## Metacognition API

### Getting Usage Patterns

```typescript
const patterns = await rb.metacognition.getPatterns();
```

**Returns:**
```json
{
  "queryPatterns": {
    "mostQueried": ["user_preferences", "recent_conversations"],
    "avgRetrievalTime": 245,
    "optimalWeights": {
      "recency": 0.7,
      "semantic": 0.3
    }
  },
  "creationPatterns": {
    "avgMemoriesPerDay": 120,
    "topMetadataKeys": ["category", "importance", "user_id"]
  },
  "performanceMetrics": {
    "avgResponseTime": 180,
    "cacheHitRate": 0.76
  }
}
```

### Predicting What to Retrieve

```typescript
const prediction = await rb.metacognition.predict({
  context: 'User asking about API documentation preferences',
  limit: 5  // Optional: how many suggestions
});
```

**Returns:**
```json
{
  "suggestedMemories": [
    {
      "id": "mem_abc123",
      "content": "User prefers concise docs with code examples",
      "confidence": 0.94,
      "reasoning": "Highly relevant based on query history"
    }
  ],
  "suggestedStrategy": {
    "weights": {
      "recency": 0.6,
      "semantic": 0.4
    },
    "limit": 5
  },
  "confidence": 0.91
}
```

### Getting Metacognitive Metrics

```typescript
const metrics = await rb.metacognition.getMetrics();
```

**Returns:**
```json
{
  "learningProgress": {
    "totalObservations": 1250,
    "patternsDetected": 23,
    "confidenceLevel": 0.88
  },
  "optimizationGains": {
    "speedImprovement": "32% faster than baseline",
    "accuracyImprovement": "18% more relevant results"
  }
}
```

---

## Real-World Use Cases

### 1. Chatbot with Learning Memory

```typescript
// Traditional approach: Manual retrieval
const memories = await db.search({ query: userMessage, limit: 10 });

// RecallBricks: System predicts what's needed
const prediction = await rb.metacognition.predict({
  context: `User: "${userMessage}"`
});

// Use high-confidence suggestions
const relevantMemories = prediction.suggestedMemories
  .filter(m => m.confidence > 0.8);
```

**Result:** Chatbot gets better at understanding context over time.

### 2. Documentation Assistant

```typescript
// RecallBricks learns that users asking about "API"
// usually need code examples, not theory
const prediction = await rb.metacognition.predict({
  context: 'User asked: "How do I use the API?"'
});

// System suggests memories with category: 'code_examples'
// with higher confidence than category: 'theory'
```

**Result:** More relevant docs surfaced automatically.

### 3. Multi-User Application

```typescript
// RecallBricks learns per-user preferences
const patterns = await rb.metacognition.getPatterns({
  userId: 'user_123'  // User-specific patterns
});

// Different users get different optimal strategies
// User A: Prefers recent info (recency: 0.8)
// User B: Prefers comprehensive info (semantic: 0.8)
```

**Result:** Personalized experience without manual configuration.

---

## Performance Impact

### Before Metacognition

- Manual weight tuning: 2-3 hours per feature
- Suboptimal retrieval: 60-70% relevance
- Static strategies: Same for all users

### With Metacognition

- Automatic optimization: 0 hours
- AI-optimized retrieval: 85-95% relevance
- Adaptive strategies: Personalized per user

**Metacognition saves time and improves quality.**

---

## Key Takeaways

1. **Metacognition = Thinking about thinking**
   - RecallBricks observes its own usage
   - It learns what works
   - It optimizes automatically

2. **You get smarter retrieval for free**
   - No manual tuning required
   - System improves as you use it
   - Predictions get more accurate over time

3. **This is cognitive infrastructure**
   - Not just storage
   - Not just search
   - **Intelligence that grows**

---

## Next Steps

- **[Self-Optimizing Memory](self-optimizing-memory.md)** – How Phase 1 works
- **[Predictive Recall](predictive-recall.md)** – How Phase 2A works
- **[API Reference: Metacognition](../api-reference/metacognition.md)** – Full API docs
- **[Example: Predictive Recall](../examples/predictive-recall.ts)** – Working code

---

**Metacognition is the future of AI infrastructure.** RecallBricks brings it to you today.
