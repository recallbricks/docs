# Best Practices

Production-ready patterns for using RecallBricks effectively.

---

## General Principles

### 1. Start Simple, Scale Complexity

```typescript
// ✅ Start here
const results = await rb.search('user preferences');

// Then add features as needed
const results = await rb.searchWeighted('user preferences', {
  weights: { semantic: 0.7, recency: 0.3 },
  metadata: { user_id: currentUser.id },
  minScore: 0.8
});
```

### 2. Trust the Metacognition

```typescript
// ❌ Don't manually tune everything
const results = await rb.searchWeighted('api docs', {
  weights: { semantic: 0.643, recency: 0.357 }  // Overly precise
});

// ✅ Let AI suggest optimal weights
const prediction = await rb.predictMemories({
  context: 'User searching for API documentation'
});

const results = await rb.searchWeighted('api docs', {
  weights: prediction.suggestedStrategy.weights  // AI-optimized
});
```

### 3. Use Metadata Strategically

```typescript
// ✅ Good: Structured, queryable metadata
await rb.createMemory('User completed onboarding', {
  metadata: {
    user_id: 'user_123',
    event: 'onboarding_complete',
    timestamp: new Date().toISOString(),
    platform: 'web',
    version: '2.1.0'
  }
});

// ❌ Bad: Unstructured, hard to query
await rb.createMemory('User completed onboarding on web at 2025-01-15...', {
  metadata: { info: 'various data mixed together' }
});
```

---

## Memory Management

### Creating Memories

**Do's:**
- Use consistent metadata keys across similar memories
- Include timestamps for time-sensitive data
- Set appropriate confidence scores (agents)
- Use descriptive content

**Don'ts:**
- Don't store secrets or PII without encryption
- Don't create duplicate memories
- Don't use metadata for large data (use content)
- Don't skip error handling

```typescript
// ✅ Good
try {
  const memory = await rb.createMemory(sanitizeContent(userInput), {
    metadata: {
      category: 'user_feedback',
      sentiment: 'positive',
      created_at: new Date().toISOString()
    }
  });
} catch (error) {
  logger.error('Failed to create memory:', error);
  // Handle gracefully
}

// ❌ Bad
const memory = await rb.createMemory(
  content: userInput,  // No sanitization
  metadata: { stuff: 'things' }  // Vague
});  // No error handling
```

### Searching Memories

**Choose the right weighting strategy:**

| Use Case | Semantic | Recency | Example |
|----------|----------|---------|---------|
| Documentation | 0.9 | 0.1 | Technical guides |
| News/Activity | 0.2 | 0.8 | User actions |
| General | 0.5 | 0.5 | Mixed content |
| AI-Optimized | Let AI decide | Let AI decide | Use predictions |

```typescript
// ✅ Good: Context-appropriate weights
const docsResults = await rb.searchWeighted('API authentication', {
  weights: { semantic: 0.9, recency: 0.1 }  // Comprehensive docs
});

const activityResults = await rb.searchWeighted('recent user actions', {
  weights: { semantic: 0.2, recency: 0.8 }  // Recent matters
});
```

---

## Performance

### 1. Batch Operations

```typescript
// ✅ Good: Batch create (via REST API)
// POST /v1/memories/batch
const memories = [
  { content: 'Memory 1', metadata: { type: 'A' } },
  { content: 'Memory 2', metadata: { type: 'B' } },
  { content: 'Memory 3', metadata: { type: 'C' } }
];

// ❌ Bad: Individual creates
for (const item of items) {
  await rb.createMemory(item.content);  // Slow!
}
```

### 2. Use Pagination

```typescript
// ✅ Good: Paginate large result sets
const results = await rb.search(query, {
  limit: 20,
  offset: 0
});

// Process page 1
// Fetch next page if needed
const nextResults = await rb.search(query, {
  limit: 20,
  offset: 20
});

// ❌ Bad: Fetch everything at once
const allResults = await rb.search(query, { limit: 10000 });  // Slow!
```

### 3. Implement Caching

```typescript
// ✅ Good: Cache frequently accessed data
const cache = new Map();

async function getMemory(id: string) {
  if (cache.has(id)) {
    return cache.get(id);
  }

  // Note: Direct memory retrieval requires REST API
  // GET /v1/memories/{id}
  const memory = await fetch(`/v1/memories/${id}`);
  cache.set(id, memory);
  return memory;
}
```

---

## Security

### 1. Never Expose API Keys

```typescript
// ✅ Good: Environment variables
const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY);

// ❌ Bad: Hardcoded
const rb = new RecallBricks('rb_live_abc123...');  // Never!
```

### 2. Backend-Only Usage

```typescript
// ✅ Good: Server-side only
// server.ts
const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY);

app.post('/api/search', async (req, res) => {
  const results = await rb.search(req.body.query);
  res.json(results);
});

// ❌ Bad: Client-side
// frontend.js - NEVER DO THIS
const rb = new RecallBricks(window.RECALLBRICKS_KEY);  // Exposed!
```

### 3. Sanitize Input

```typescript
// ✅ Good: Sanitize user input
const sanitizedContent = sanitize(userInput);
await rb.createMemory(sanitizedContent);

// ❌ Bad: Direct user input
await rb.createMemory(userInput);  // Unsafe
```

---

## Error Handling

### 1. Graceful Degradation

```typescript
// ✅ Good: Fallback behavior
try {
  const prediction = await rb.predictMemories({ context });
  return prediction.memories;
} catch (error) {
  // Fallback to traditional search
  return await rb.search(fallbackQuery);
}
```

### 2. Retry Logic

```typescript
// ✅ Good: Exponential backoff
async function retryOperation(fn: Function, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.code === 'RATE_LIMIT_EXCEEDED' && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000);  // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}
```

### 3. Specific Error Handling

```typescript
// ✅ Good: Handle specific errors
try {
  // Note: Direct memory retrieval requires REST API
  const memory = await fetch(`/v1/memories/${id}`);
} catch (error: any) {
  if (error.code === 'MEMORY_NOT_FOUND') {
    return null;  // Expected case
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    await waitAndRetry();
  } else {
    logger.error('Unexpected error:', error);
    throw error;
  }
}
```

---

## Multi-Agent Systems

### 1. Use Descriptive Agent IDs

```typescript
// ✅ Good
await rb.collaboration.registerAgent({
  agentId: 'customer-support-tier-1-agent-3',
  role: 'customer_support'
});

// ❌ Bad
await rb.collaboration.registerAgent({
  agentId: 'agent1',  // Too generic
  role: 'support'
});
```

### 2. Filter by Reputation

```typescript
// ✅ Good: Quality assurance
const solutions = await rb.collaboration.getAgentMemories({
  minReputation: 0.85,  // Only trusted agents
  category: 'solutions'
});

// ❌ Bad: No quality filter
const solutions = await rb.collaboration.getAgentMemories({
  category: 'solutions'  // Includes low-quality agents
});
```

### 3. Monitor Agent Performance

```typescript
// ✅ Good: Regular performance checks
const reputation = await rb.collaboration.getReputation(agentId);

if (reputation.reputationScore < 0.7) {
  console.warn(`Agent ${agentId} needs review`);
  // Trigger retraining or investigation
}
```

---

## Monitoring & Maintenance

### 1. Track Usage

```typescript
// ✅ Good: Monitor usage patterns
const usage = await rb.metrics.getUsage({ timeRange: '7d' });

if (usage.rateLimits.percentageUsed > 80) {
  console.warn('Approaching rate limit');
  // Consider upgrading tier
}
```

### 2. Check System Health

```typescript
// ✅ Good: Health checks
const health = await rb.health();

if (health.status !== 'healthy') {
  // Switch to degraded mode or alert team
}
```

### 3. Review Metacognition Metrics

```typescript
// ✅ Good: Monitor AI learning
const metrics = await rb.metacognition.getMetrics();

console.log(`System confidence: ${metrics.learningProgress.confidenceLevel}`);
console.log(`Optimization gains: ${metrics.optimizationGains.speedImprovement}`);
```

---

## Common Patterns

### Pattern 1: User Context Retrieval

```typescript
async function getUserContext(userId: string) {
  // Use prediction for smart context retrieval
  const prediction = await rb.metacognition.predict({
    context: `User ${userId} starting new session`
  });

  // Filter high-confidence suggestions
  return prediction.suggestedMemories.filter(m => m.confidence > 0.8);
}
```

### Pattern 2: Conversation Memory

```typescript
async function handleChatMessage(userId: string, message: string, sessionId: string) {
  // 1. Get relevant context
  const context = await rb.memories.search({
    query: message,
    metadata: { userId, sessionId },
    weights: { semantic: 0.6, recency: 0.4 },
    limit: 5
  });

  // 2. Generate response (with LLM)
  const response = await generateResponse(message, context);

  // 3. Store exchange
  await rb.memories.createBatch([
    {
      content: `User: ${message}`,
      metadata: { userId, sessionId, type: 'user_message' }
    },
    {
      content: `Bot: ${response}`,
      metadata: { userId, sessionId, type: 'bot_message' }
    }
  ]);

  return response;
}
```

### Pattern 3: Hybrid Search

```typescript
async function hybridSearch(query: string) {
  // Try AI prediction first
  const prediction = await rb.metacognition.predict({ context: query });

  if (prediction.confidence > 0.85) {
    // High confidence: use predictions
    return prediction.suggestedMemories;
  } else {
    // Low confidence: fall back to traditional search
    return await rb.memories.search({ query });
  }
}
```

---

## Production Checklist

Before going to production, ensure:

- [ ] API keys stored in environment variables
- [ ] Error handling implemented for all RecallBricks calls
- [ ] Rate limit monitoring in place
- [ ] Retry logic with exponential backoff
- [ ] Input sanitization for user-generated content
- [ ] Logging for debugging and monitoring
- [ ] Health checks integrated
- [ ] Graceful degradation for API failures
- [ ] Metadata structure documented
- [ ] Backup/recovery plan for critical memories
- [ ] Performance monitoring set up
- [ ] Security review completed

---

## Anti-Patterns to Avoid

### ❌ Don't: Ignore Confidence Scores

```typescript
// Bad: Use all predictions regardless of confidence
const prediction = await rb.metacognition.predict({ context });
return prediction.suggestedMemories;  // Might include low-confidence!
```

### ❌ Don't: Hardcode Weights

```typescript
// Bad: Same weights for everything
const WEIGHTS = { semantic: 0.7, recency: 0.3 };  // One-size-fits-all
```

### ❌ Don't: Skip Metadata

```typescript
// Bad: No metadata
await rb.memories.create({ content: 'Some data' });  // Hard to filter later
```

### ❌ Don't: Create Massive Batches

```typescript
// Bad: Batch too large
await rb.memories.createBatch(arrayOf10000Items);  // Will timeout
```

### ❌ Don't: Store Everything

```typescript
// Bad: Store trivial or redundant data
await rb.memories.create({ content: 'User clicked button' });  // Too granular
```

---

**[Next: Performance Optimization →](performance-optimization.md)**
