# Self-Optimizing Memory (Phase 1)

RecallBricks learns from every interaction and optimizes itself automatically.

---

## What is Self-Optimizing Memory?

**Phase 1** of RecallBricks metacognition: The system observes how you use it and automatically improves retrieval strategies.

### The Core Idea

Every time you:
- Create a memory
- Search for a memory
- Retrieve specific memories
- Apply weighting strategies

RecallBricks **tracks this** and **learns patterns**.

Then it:
- Adjusts optimal weighting automatically
- Improves response times
- Caches frequently accessed memories
- Suggests better search strategies

**You don't configure this. It happens automatically.**

---

## How It Works

### 1. Observation Layer

RecallBricks tracks every operation:

```typescript
// You create a memory
await rb.createMemory('User prefers dark mode', {
  metadata: { category: 'preferences', user_id: 'user_123' }
});

// Behind the scenes, RecallBricks logs:
// - Timestamp: 2025-01-15T10:30:00Z
// - Metadata keys used: ['category', 'user_id']
// - Content length: 24 characters
// - Embedding dimension: 1536
```

```typescript
// You search for memories
await rb.search('user preferences', {
  limit: 5
});

// Behind the scenes, RecallBricks logs:
// - Query: 'user preferences'
// - Results returned: 5
// - Response time: 245ms
// - Semantic similarity scores: [0.94, 0.89, 0.85, 0.81, 0.78]
```

### 2. Pattern Detection

After collecting observations, RecallBricks analyzes:

- **Query Frequency:** Which terms/categories are queried most?
- **Timing Patterns:** When are queries made? (e.g., start of sessions)
- **Metadata Usage:** Which metadata fields are most important?
- **Weighting Effectiveness:** Do recency or semantic weights produce better results?

```typescript
const patterns = await rb.getPatterns();

console.log(patterns.queryPatterns);
// {
//   mostQueried: ['user_preferences', 'conversation_history'],
//   avgRetrievalTime: 245,
//   peakQueryTimes: ['09:00-10:00', '14:00-15:00'],
//   optimalWeights: { recency: 0.7, semantic: 0.3 }
// }
```

### 3. Automatic Optimization

Based on patterns, RecallBricks automatically:

#### A. Adjusts Caching

Frequently accessed memories are cached:

```typescript
// First query: 245ms (not cached)
// Note: Direct memory retrieval by ID requires REST API
// GET /v1/memories/mem_123

// RecallBricks observes this memory is accessed often

// Subsequent queries: 12ms (cached)
```

#### B. Optimizes Weighting

The system learns which weights work best:

```typescript
// Initially: Default weights
{ recency: 0.5, semantic: 0.5 }

// After 1000 queries, RecallBricks learns that
// recent memories are more valuable for this use case
{ recency: 0.8, semantic: 0.2 }

// This is reflected in getPatterns()
const patterns = await rb.getPatterns();
console.log(patterns.queryPatterns.optimalWeights);
// { recency: 0.8, semantic: 0.2 }
```

#### C. Improves Response Times

RecallBricks identifies slow queries and optimizes them:

```
Week 1 Avg Response Time: 320ms
Week 2 Avg Response Time: 245ms  (23% faster)
Week 4 Avg Response Time: 180ms  (44% faster)
```

---

## Real-World Example

### Scenario: Customer Support Chatbot

You're building a chatbot that helps users with technical issues.

#### Day 1: Initial Usage

```typescript
// User: "How do I reset my password?"
const results = await rb.search('reset password', {
  limit: 5
});

// RecallBricks observes:
// - Query: 'reset password' (appears 12 times today)
// - Results used: Top 2 results clicked 95% of the time
// - Response time: 310ms
```

#### Day 7: Pattern Emerges

```typescript
const patterns = await rb.getPatterns();

console.log(patterns);
// {
//   queryPatterns: {
//     mostQueried: ['reset password', 'account locked', 'billing'],
//     avgRetrievalTime: 245,
//     optimalWeights: { recency: 0.6, semantic: 0.4 }
//   }
// }
```

RecallBricks learned:
- "Reset password" is queried frequently → cache these results
- Users prefer recent solutions → increase recency weight
- Top 2 results are usually sufficient → optimize for top-k retrieval

#### Day 30: Fully Optimized

```typescript
// Same query, but now:
const results = await rb.search('reset password', {
  limit: 5
});

// Performance improvements:
// - Response time: 180ms (42% faster)
// - Cached: Yes (instant retrieval)
// - Optimal weights applied automatically
// - More relevant results (learned from user clicks)
```

**You didn't configure anything. RecallBricks optimized itself.**

---

## Optimization Strategies

### 1. Semantic vs Recency Weighting

RecallBricks learns which weighting strategy works best.

#### Example: News Aggregator

```typescript
// RecallBricks observes that users click recent articles
// more than semantically similar old articles

// Learned optimal weights:
{ recency: 0.9, semantic: 0.1 }
```

#### Example: Research Assistant

```typescript
// RecallBricks observes that users prefer comprehensive,
// semantically similar content regardless of recency

// Learned optimal weights:
{ recency: 0.2, semantic: 0.8 }
```

### 2. Metadata Filtering

RecallBricks identifies which metadata fields are important.

```typescript
const patterns = await rb.getPatterns();

console.log(patterns.creationPatterns.topMetadataKeys);
// ['category', 'importance', 'user_id']
// ^ These are used most often in successful queries

console.log(patterns.creationPatterns.unusedMetadataKeys);
// ['legacy_field', 'temp_value']
// ^ These are rarely used
```

### 3. Caching Strategy

RecallBricks automatically caches:
- Frequently accessed memories
- Recently queried results
- Common search patterns

```typescript
// Cache statistics
// Note: getMetrics() is available via REST API
// GET /v1/metacognition/metrics

console.log(metrics.performanceMetrics);
// {
//   cacheHitRate: 0.76,  // 76% of queries served from cache
//   avgCachedResponseTime: 12,  // 12ms
//   avgUncachedResponseTime: 245  // 245ms
// }
```

---

## Monitoring Self-Optimization

### Get Current Patterns

```typescript
const patterns = await rb.getPatterns();

console.log(patterns);
```

**Response:**
```json
{
  "queryPatterns": {
    "mostQueried": ["user_preferences", "conversation_history"],
    "avgRetrievalTime": 245,
    "peakQueryTimes": ["09:00-10:00"],
    "optimalWeights": {
      "recency": 0.7,
      "semantic": 0.3
    }
  },
  "creationPatterns": {
    "avgMemoriesPerDay": 120,
    "topMetadataKeys": ["category", "importance", "user_id"],
    "avgContentLength": 180
  },
  "performanceMetrics": {
    "avgResponseTime": 180,
    "cacheHitRate": 0.76,
    "p95ResponseTime": 320,
    "p99ResponseTime": 450
  }
}
```

### Get Optimization Metrics

```typescript
// Note: getMetrics() is available via REST API
// GET /v1/metacognition/metrics

console.log(metrics.optimizationGains);
```

**Response:**
```json
{
  "optimizationGains": {
    "speedImprovement": "32% faster than baseline",
    "accuracyImprovement": "18% more relevant results",
    "cacheEfficiency": "76% cache hit rate"
  },
  "learningProgress": {
    "totalObservations": 1250,
    "patternsDetected": 23,
    "confidenceLevel": 0.88
  }
}
```

---

## Use Cases

### 1. E-Commerce Product Search

**Scenario:** Users search for products.

**Learning:**
- Recency matters (new products preferred)
- Price range is critical metadata
- Users prefer top 3 results

**Optimization:**
```typescript
// Automatically learned:
{
  optimalWeights: { recency: 0.8, semantic: 0.2 },
  keyMetadata: ['price', 'category', 'rating'],
  optimalResultCount: 3
}
```

### 2. Documentation Search

**Scenario:** Developers search docs.

**Learning:**
- Semantic similarity is key (comprehensive answers)
- Code examples are preferred
- Recency doesn't matter much

**Optimization:**
```typescript
// Automatically learned:
{
  optimalWeights: { recency: 0.1, semantic: 0.9 },
  keyMetadata: ['has_code_example', 'difficulty'],
  optimalResultCount: 5
}
```

### 3. Conversational AI

**Scenario:** Chatbot retrieves user context.

**Learning:**
- Recent conversations are critical
- User preferences queried at session start
- Conversation history needed mid-session

**Optimization:**
```typescript
// Automatically learned:
{
  optimalWeights: { recency: 0.9, semantic: 0.1 },
  keyMetadata: ['user_id', 'session_id', 'timestamp'],
  cachingStrategy: 'aggressive' // Cache user preferences
}
```

---

## Performance Impact

### Before Self-Optimization

| Metric | Value |
|--------|-------|
| Avg Response Time | 320ms |
| Cache Hit Rate | 0% |
| Result Relevance | 70% |
| Manual Tuning Time | 2-3 hours/feature |

### After Self-Optimization (30 days)

| Metric | Value | Improvement |
|--------|-------|-------------|
| Avg Response Time | 180ms | **44% faster** |
| Cache Hit Rate | 76% | **76% cached** |
| Result Relevance | 88% | **18% better** |
| Manual Tuning Time | 0 hours | **100% automated** |

---

## Best Practices

### 1. Let It Learn

Give RecallBricks time to observe patterns:

```typescript
// ✅ Good: Let the system learn
// Create memories and query naturally
// Check patterns after 7-14 days

// ❌ Bad: Check patterns immediately
// await rb.getPatterns(); // Day 1 - not enough data
```

### 2. Monitor Progress

Track optimization over time:

```typescript
// Weekly check
// Note: getMetrics() is available via REST API
// GET /v1/metacognition/metrics

console.log(metrics.learningProgress.confidenceLevel);
// Week 1: 0.45
// Week 2: 0.68
// Week 4: 0.88  <- High confidence, optimizations are reliable
```

### 3. Use Consistent Metadata

Help the system learn by using consistent metadata:

```typescript
// ✅ Good: Consistent metadata keys
await rb.createMemory('...', {
  metadata: { category: 'preferences', importance: 'high' }
});

// ❌ Bad: Inconsistent keys
await rb.createMemory('...', {
  metadata: { type: 'preferences', priority: 'high' }
});
```

### 4. Trust the System

Use the learned optimal weights:

```typescript
// Get learned weights
const patterns = await rb.getPatterns();
const optimalWeights = patterns.queryPatterns.optimalWeights;

// Apply them in searches
await rb.searchWeighted('user preferences', {
  weights: optimalWeights  // Use learned weights
});
```

---

## Key Takeaways

1. **Self-optimization is automatic**
   - No configuration required
   - Learns from every interaction
   - Improves over time

2. **Measurable performance gains**
   - 30-50% faster response times
   - 70-80% cache hit rates
   - 15-20% better relevance

3. **Zero maintenance**
   - No manual tuning
   - No weight adjustment
   - No cache configuration

---

## Next Steps

- **[Predictive Recall](predictive-recall.md)** – Phase 2A metacognition
- **[Metacognition Overview](metacognition.md)** – The big picture
- **[API Reference: Metacognition](../api-reference/metacognition.md)** – Full API
- **[Best Practices](../guides/best-practices.md)** – Production patterns

---

**Set it and forget it.** RecallBricks optimizes itself.
