# Predictive Recall (Phase 2A)

AI that predicts what you'll need before you ask for it.

---

## What is Predictive Recall?

**Phase 2A** of RecallBricks metacognition: The system predicts which memories you'll need based on context, before you explicitly search for them.

### The Core Idea

Instead of you saying:
> "Search for memories about user preferences with recency weight 0.7"

You say:
> "The user just asked about documentation style"

RecallBricks responds:
> "Based on patterns, you probably need these 3 memories with 94% confidence"

**The system does the cognitive work for you.**

---

## How It Works

### Traditional Search Flow

```typescript
// 1. You decide what to search for
const query = 'user preferences';

// 2. You decide how to weight it
const weights = { recency: 0.7, semantic: 0.3 };

// 3. You decide how many results
const limit = 5;

// 4. You execute the search
const results = await db.search({ query, weights, limit });

// 5. You filter/rank the results yourself
const relevant = results.filter(r => r.score > 0.8);
```

**You made 5 decisions. RecallBricks can make them for you.**

### Predictive Recall Flow

```typescript
// 1. You provide context
const prediction = await rb.metacognition.predict({
  context: 'User asked: "What documentation style do I prefer?"'
});

// 2. RecallBricks predicts everything
console.log(prediction);
// {
//   suggestedMemories: [
//     { id: 'mem_123', content: '...', confidence: 0.94 }
//   ],
//   suggestedStrategy: {
//     weights: { recency: 0.7, semantic: 0.3 },
//     limit: 5
//   },
//   confidence: 0.91
// }

// 3. Use the suggestions (or just the high-confidence ones)
const memories = prediction.suggestedMemories.filter(m => m.confidence > 0.8);
```

**You made 1 decision. RecallBricks made the rest.**

---

## The Prediction API

### Basic Prediction

```typescript
const prediction = await rb.metacognition.predict({
  context: 'User asking about API documentation preferences'
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
      "reasoning": "High semantic match + recent access pattern"
    },
    {
      "id": "mem_def456",
      "content": "User dislikes verbose explanations",
      "confidence": 0.87,
      "reasoning": "Related to query context"
    }
  ],
  "suggestedStrategy": {
    "weights": {
      "recency": 0.6,
      "semantic": 0.4
    },
    "limit": 5,
    "filters": {
      "metadata.category": "preferences"
    }
  },
  "confidence": 0.91,
  "reasoning": "Strong pattern match based on 47 similar queries"
}
```

### Advanced Options

```typescript
const prediction = await rb.metacognition.predict({
  context: 'User asked about Python examples',
  limit: 3,  // Limit suggestions
  minConfidence: 0.85,  // Only high-confidence suggestions
  includeStrategy: true  // Include search strategy suggestion
});
```

---

## How Predictions Are Generated

### 1. Context Analysis

RecallBricks analyzes the context you provide:

```typescript
context: 'User asked: "How do I authenticate with the API?"'
```

**Analysis:**
- Keywords: "authenticate", "API"
- Intent: Technical how-to
- Expected answer type: Code example or step-by-step

### 2. Pattern Matching

RecallBricks looks for similar past queries:

```
Historical Patterns:
- 89 queries about "authentication" (87% clicked result #1)
- 45 queries about "API" (92% used code examples)
- Common metadata: { category: 'api', type: 'tutorial' }
- Optimal weights: { recency: 0.4, semantic: 0.6 }
```

### 3. Memory Scoring

Each memory gets a prediction score:

```
mem_123: "API authentication tutorial"
  - Semantic similarity: 0.95
  - Historical success rate: 0.89
  - Recency: 0.70
  - Predicted confidence: 0.94

mem_456: "User login flow"
  - Semantic similarity: 0.78
  - Historical success rate: 0.65
  - Recency: 0.85
  - Predicted confidence: 0.76
```

### 4. Strategy Recommendation

Based on patterns, RecallBricks suggests:

```json
{
  "weights": { "recency": 0.4, "semantic": 0.6 },
  "limit": 3,
  "filters": { "metadata.category": "api" }
}
```

---

## Real-World Examples

### Example 1: Chatbot Context

```typescript
// User starts a conversation
const userMessage = "Hey, I'm back! What were we talking about?";

// Traditional approach: Manual query
const history = await db.search({
  query: 'conversation history',
  metadata: { user_id: currentUser.id },
  weights: { recency: 0.9, semantic: 0.1 },
  limit: 10
});

// Predictive approach: Let AI decide
const prediction = await rb.metacognition.predict({
  context: `User: "${userMessage}". Session start. User ID: ${currentUser.id}`
});

// RecallBricks predicts:
// - This is a returning user (session start pattern)
// - They want recent conversation history
// - Suggest last 3-5 messages with high recency weight
// - Confidence: 0.96 (very sure based on this pattern)

const recentContext = prediction.suggestedMemories
  .filter(m => m.confidence > 0.9);
```

**Result:** Chatbot immediately provides relevant context without manual configuration.

### Example 2: Documentation Assistant

```typescript
// User searches docs
const userQuery = "How do I handle errors in Python?";

// Predictive approach
const prediction = await rb.metacognition.predict({
  context: `User query: "${userQuery}". Language: Python. Topic: Error handling`
});

// RecallBricks predicts:
// - User needs code examples (pattern from 230 similar queries)
// - Python-specific content
// - Practical tutorials over theory
// - Suggested weights: { semantic: 0.8, recency: 0.2 }
// - Confidence: 0.93

const docs = prediction.suggestedMemories.slice(0, 3);
```

**Result:** Most relevant Python error handling docs surfaced automatically.

### Example 3: E-Commerce Search

```typescript
// User searches products
const searchTerm = "wireless headphones";

// Predictive approach
const prediction = await rb.metacognition.predict({
  context: `Product search: "${searchTerm}". User tier: premium. Previous purchases: electronics`
});

// RecallBricks predicts:
// - Premium products (user tier pattern)
// - Electronics category (purchase history)
// - Recent products preferred (seasonal trends)
// - Suggested weights: { recency: 0.7, semantic: 0.3 }
// - Confidence: 0.88

const products = prediction.suggestedMemories
  .filter(m => m.confidence > 0.8);
```

**Result:** Personalized product recommendations without building a rec system.

---

## Confidence Scores

Every prediction includes confidence scores:

### Memory-Level Confidence

```json
{
  "id": "mem_123",
  "content": "User prefers dark mode",
  "confidence": 0.94,
  "reasoning": "High semantic match + recent access"
}
```

| Confidence | Interpretation | Action |
|-----------|---------------|--------|
| **0.95+** | Very high | Use immediately, likely correct |
| **0.85-0.94** | High | Use with confidence |
| **0.70-0.84** | Moderate | Use but verify |
| **<0.70** | Low | Consider as supplementary |

### Overall Prediction Confidence

```json
{
  "confidence": 0.91,
  "reasoning": "Strong pattern match based on 47 similar queries"
}
```

This tells you how confident RecallBricks is about the **entire prediction**, not just individual memories.

### Using Confidence Scores

```typescript
const prediction = await rb.metacognition.predict({ context: '...' });

// Only use high-confidence predictions
if (prediction.confidence > 0.85) {
  const memories = prediction.suggestedMemories
    .filter(m => m.confidence > 0.8);

  // Use these memories directly
  return memories;
} else {
  // Fall back to traditional search
  return await rb.memories.search({ query: '...' });
}
```

---

## Learning from Feedback

RecallBricks improves predictions based on what you actually use.

### Implicit Feedback

```typescript
// You request a prediction
const prediction = await rb.metacognition.predict({
  context: 'User asking about API auth'
});

// You retrieve one of the suggested memories
const memory = await rb.memories.get(prediction.suggestedMemories[0].id);

// RecallBricks observes:
// ✓ Prediction was correct (you used the suggestion)
// ✓ Confidence score was accurate
// ✓ This pattern works for "API auth" queries
```

### Explicit Feedback (Optional)

```typescript
// Provide explicit feedback
await rb.metacognition.feedback({
  predictionId: prediction.id,
  useful: true,  // Was this prediction helpful?
  usedMemories: ['mem_123', 'mem_456']  // Which ones did you use?
});

// RecallBricks learns:
// - These specific memories were valuable
// - This prediction strategy worked
// - Future predictions for similar contexts should be similar
```

### Impact on Future Predictions

```
Week 1: Confidence 0.76, Accuracy 78%
Week 2: Confidence 0.82, Accuracy 84%  (Learning from feedback)
Week 4: Confidence 0.91, Accuracy 92%  (Well-trained model)
```

---

## Use Cases

### 1. Conversational AI

**Problem:** Manually deciding which conversation history to retrieve

**Solution:**
```typescript
const prediction = await rb.metacognition.predict({
  context: `User: "${userMessage}". Turn: ${turnCount}. User ID: ${userId}`
});

// RecallBricks predicts:
// - Early in conversation: User preferences + recent history
// - Mid conversation: Related conversation topics
// - Late in conversation: Summary + action items
```

### 2. Smart Search

**Problem:** Users don't know how to phrase queries

**Solution:**
```typescript
const prediction = await rb.metacognition.predict({
  context: `User typed: "${vague_query}". Previous successful queries: ${history}`
});

// RecallBricks predicts what they actually meant
// Suggests better search terms and strategies
```

### 3. Proactive Assistance

**Problem:** Waiting for users to ask questions

**Solution:**
```typescript
const prediction = await rb.metacognition.predict({
  context: `User viewing page: ${currentPage}. Time on page: ${time}. Scrolled to: ${scrollPosition}`
});

// RecallBricks predicts:
// - User is stuck (long time on page)
// - Suggest relevant help articles proactively
```

---

## Best Practices

### 1. Provide Rich Context

```typescript
// ❌ Minimal context
await rb.metacognition.predict({
  context: 'user preferences'
});

// ✅ Rich context
await rb.metacognition.predict({
  context: `User asked: "What documentation style do I prefer?".
            Session start: true.
            User tier: premium.
            Previous interactions: 47`
});
```

### 2. Filter by Confidence

```typescript
// ✅ Use confidence thresholds
const highConfidence = prediction.suggestedMemories
  .filter(m => m.confidence > 0.85);

const mediumConfidence = prediction.suggestedMemories
  .filter(m => m.confidence >= 0.7 && m.confidence < 0.85);

// Use high-confidence immediately
// Show medium-confidence as "You might also need..."
```

### 3. Combine with Traditional Search

```typescript
// ✅ Hybrid approach
const prediction = await rb.metacognition.predict({ context });

if (prediction.confidence > 0.8) {
  // Use predictions
  return prediction.suggestedMemories;
} else {
  // Fall back to traditional search
  return await rb.memories.search({ query });
}
```

### 4. Provide Feedback

```typescript
// ✅ Help the system learn
await rb.metacognition.feedback({
  predictionId: prediction.id,
  useful: true,
  usedMemories: actuallyUsedMemories
});
```

---

## Performance Impact

| Metric | Manual Search | Predictive Recall | Improvement |
|--------|--------------|-------------------|-------------|
| Time to results | 5-10 seconds | 0.5-1 second | **10x faster** |
| Developer decisions | 5 per query | 1 per query | **5x simpler** |
| Result relevance | 70-75% | 85-95% | **20% better** |
| Configuration time | 2-3 hours/feature | 0 hours | **100% saved** |

---

## Key Takeaways

1. **Predictions replace decisions**
   - System suggests what to retrieve
   - System suggests how to retrieve it
   - You just provide context

2. **Confidence scores guide usage**
   - High confidence: Use immediately
   - Medium confidence: Use with caution
   - Low confidence: Fall back to search

3. **Learns from feedback**
   - Implicit: Observes what you use
   - Explicit: Optional feedback API
   - Improves over time

---

## Next Steps

- **[Metacognition Overview](metacognition.md)** – The big picture
- **[API Reference: Metacognition](../api-reference/metacognition.md)** – Full API
- **[Example: Predictive Recall](../examples/predictive-recall.ts)** – Working code
- **[Multi-Agent Collaboration](multi-agent-collaboration.md)** – Phase 3

---

**Stop deciding. Start predicting.** Let RecallBricks do the cognitive work.
