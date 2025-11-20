# Performance Optimization

Maximize speed and efficiency with RecallBricks.

---

## Metacognition Performance Gains

RecallBricks automatically optimizes over time. Expected improvements:

| Metric | Baseline | After 30 Days | Improvement |
|--------|----------|---------------|-------------|
| Response Time | 320ms | 180ms | **44% faster** |
| Cache Hit Rate | 0% | 76% | **76% cached** |
| Result Relevance | 70% | 88% | **18% better** |

**Key:** Let the system learn. Performance improves with usage.

---

## 1. Batch Operations

### Problem: N+1 Queries

```typescript
// ❌ Slow: Individual requests (N+1)
for (const id of memoryIds) {
  const memory = await rb.memories.get(id);  // 100ms each
  results.push(memory);
}
// Total: 100ms × 100 = 10,000ms (10 seconds)
```

### Solution: Batch Requests

```typescript
// ✅ Fast: Single batch request
const memories = await rb.memories.getBatch(memoryIds);
// Total: ~200ms (50x faster)
```

**Applies to:**
- `memories.createBatch()` - Create multiple memories
- `memories.getBatch()` - Retrieve multiple memories
- `memories.deleteBatch()` - Delete multiple memories

---

## 2. Caching Strategy

### Client-Side Caching

```typescript
class RecallBricksCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 60000; // 1 minute

  async get(id: string): Promise<any> {
    const cached = this.cache.get(id);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;  // Return cached
    }

    const data = await rb.memories.get(id);
    this.cache.set(id, { data, timestamp: Date.now() });
    return data;
  }
}
```

**Cache:**
- Frequently accessed memories
- User preferences
- Common search queries
- Usage patterns

**Don't cache:**
- Real-time data
- Rapidly changing content
- User-specific sensitive data (unless encrypted)

### Server-Side Caching with Redis

```typescript
import Redis from 'ioredis';

const redis = new Redis();

async function getCachedMemory(id: string) {
  // Check Redis first
  const cached = await redis.get(`memory:${id}`);
  if (cached) return JSON.parse(cached);

  // Fetch from RecallBricks
  const memory = await rb.memories.get(id);

  // Cache for 5 minutes
  await redis.setex(`memory:${id}`, 300, JSON.stringify(memory));

  return memory;
}
```

---

## 3. Pagination

### Problem: Loading Too Much Data

```typescript
// ❌ Slow: Load everything
const allMemories = await rb.memories.list({ limit: 10000 });  // 2-3 seconds
```

### Solution: Paginate

```typescript
// ✅ Fast: Load page by page
const { data, pagination } = await rb.memories.list({
  page: 1,
  limit: 20  // Only 20 at a time
});  // 150ms

// Load more only when needed
if (userScrollsToBottom && pagination.hasNext) {
  const nextPage = await rb.memories.list({ page: 2, limit: 20 });
}
```

**Best practices:**
- Start with `limit: 20-50` for UI display
- Use `limit: 100` max for background processing
- Implement infinite scroll or "Load More" buttons

---

## 4. Optimize Search Queries

### Use Metadata Filters

```typescript
// ❌ Slow: Search everything
const results = await rb.memories.search({
  query: 'user preferences'
});  // Searches all memories

// ✅ Fast: Filter by metadata
const results = await rb.memories.search({
  query: 'preferences',
  metadata: {
    user_id: currentUser.id,  // Reduces search space
    category: 'preferences'
  }
});  // 3x faster
```

### Use Appropriate Limits

```typescript
// ❌ Wasteful: Request more than needed
const results = await rb.memories.search({
  query: 'docs',
  limit: 100  // Only show top 5
});

// ✅ Efficient: Request only what you need
const results = await rb.memories.search({
  query: 'docs',
  limit: 5  // Show top 5
});
```

---

## 5. Connection Pooling

### TypeScript/Node.js

```typescript
const rb = new RecallBricks({
  apiKey: process.env.RECALLBRICKS_API_KEY,
  maxConnections: 20,  // Connection pool size
  keepAlive: true
});
```

### Python

```python
from recallbricks import RecallBricks

rb = RecallBricks(
    api_key=os.getenv('RECALLBRICKS_API_KEY'),
    max_connections=20,
    keep_alive=True
)
```

**Benefits:**
- Reuses connections
- Reduces handshake overhead
- 20-30% faster for high-volume apps

---

## 6. Async/Parallel Operations

### Run Independent Operations in Parallel

```typescript
// ❌ Slow: Sequential
const memory1 = await rb.memories.get('mem_1');  // 100ms
const memory2 = await rb.memories.get('mem_2');  // 100ms
const memory3 = await rb.memories.get('mem_3');  // 100ms
// Total: 300ms

// ✅ Fast: Parallel
const [memory1, memory2, memory3] = await Promise.all([
  rb.memories.get('mem_1'),
  rb.memories.get('mem_2'),
  rb.memories.get('mem_3')
]);
// Total: 100ms (3x faster)
```

### Background Processing

```typescript
// ❌ Slow: Block user request
app.post('/api/action', async (req, res) => {
  const result = await doSomething();
  await rb.memories.create({ content: 'Action completed' });  // Blocks response
  res.json(result);
});

// ✅ Fast: Background job
app.post('/api/action', async (req, res) => {
  const result = await doSomething();
  res.json(result);  // Respond immediately

  // Store memory in background
  setImmediate(async () => {
    await rb.memories.create({ content: 'Action completed' });
  });
});
```

---

## 7. Optimize Metadata

### Keep Metadata Small

```typescript
// ❌ Slow: Large metadata
await rb.memories.create({
  content: 'User action',
  metadata: {
    full_user_object: {...},  // 50KB of data
    entire_session: {...}     // 100KB of data
  }
});

// ✅ Fast: Minimal metadata
await rb.memories.create({
  content: 'User action',
  metadata: {
    user_id: 'user_123',  // Reference, not full object
    session_id: 'session_456'
  }
});
```

### Index Important Fields

```typescript
// ✅ Good: Consistent metadata keys for indexing
await rb.memories.create({
  content: '...',
  metadata: {
    category: 'events',  // Indexed
    user_id: 'user_123',  // Indexed
    timestamp: new Date().toISOString()
  }
});
```

---

## 8. Use Predictive Recall

### Let AI Do the Work

```typescript
// ❌ Manual: You decide everything
const results = await rb.memories.search({
  query: constructComplexQuery(userInput),
  weights: calculateOptimalWeights(context),
  filters: buildFilters(metadata)
});  // Lots of CPU work

// ✅ AI-Powered: Let RecallBricks decide
const prediction = await rb.metacognition.predict({
  context: userInput
});  // RecallBricks optimizes

return prediction.suggestedMemories;  // Pre-ranked, pre-filtered
```

**Benefits:**
- Faster (fewer decisions to make)
- Better results (AI-optimized)
- Less code to maintain

---

## 9. Monitor Performance

### Track Response Times

```typescript
async function timedRequest<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;

    if (duration > 500) {
      console.warn(`Slow request: ${name} took ${duration}ms`);
    }

    return result;
  } catch (error) {
    console.error(`Failed request: ${name}`);
    throw error;
  }
}

// Usage
const results = await timedRequest(
  'search-user-prefs',
  () => rb.memories.search({ query: 'preferences' })
);
```

### Use RecallBricks Metrics

```typescript
// Check system performance
const metrics = await rb.metrics.getPerformance({ timeRange: '24h' });

console.log(`P95 Latency: ${metrics.latency.p95}ms`);
console.log(`Cache Hit Rate: ${metrics.cacheHitRate}%`);

if (metrics.latency.p95 > 500) {
  console.warn('Performance degradation detected');
}
```

---

## 10. Rate Limit Optimization

### Implement Smart Throttling

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerSecond = 10;  // Based on your tier

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await sleep(1000 / this.requestsPerSecond);  // Throttle
    }

    this.processing = false;
  }
}

const limiter = new RateLimiter();

// Usage
const result = await limiter.enqueue(() =>
  rb.memories.search({ query: 'docs' })
);
```

---

## Performance Benchmarks

### Typical Response Times (P95)

| Operation | Cold (No Cache) | Warm (Cached) |
|-----------|----------------|---------------|
| `memories.get()` | 120ms | 12ms |
| `memories.search()` | 280ms | 45ms |
| `metacognition.predict()` | 320ms | 80ms |
| `memories.create()` | 180ms | N/A |
| `memories.createBatch()` (10) | 350ms | N/A |

### Optimization Checklist

- [ ] Use batch operations for multiple items
- [ ] Implement caching for frequently accessed data
- [ ] Paginate large result sets
- [ ] Filter searches with metadata
- [ ] Use connection pooling
- [ ] Run independent operations in parallel
- [ ] Keep metadata small and indexed
- [ ] Use predictive recall for AI optimization
- [ ] Monitor performance metrics
- [ ] Implement rate limit throttling

---

## Real-World Example

### Before Optimization

```typescript
// Slow: 3+ seconds
async function getUserDashboard(userId: string) {
  const prefs = await rb.memories.get('pref_1');  // 120ms
  const history = await rb.memories.get('hist_1');  // 120ms

  const activities = [];
  for (const id of activityIds) {  // 20 IDs
    activities.push(await rb.memories.get(id));  // 120ms each
  }  // 2400ms total

  return { prefs, history, activities };
}  // Total: ~3000ms
```

### After Optimization

```typescript
// Fast: ~150ms (20x faster)
async function getUserDashboard(userId: string) {
  // Parallel + batch + cache
  const [prefs, history, activities] = await Promise.all([
    cache.get('pref_1') || rb.memories.get('pref_1'),
    cache.get('hist_1') || rb.memories.get('hist_1'),
    rb.memories.getBatch(activityIds)  // Batch request
  ]);  // 150ms total

  return { prefs, history, activities };
}  // Total: ~150ms
```

**Improvements:**
- 20x faster (3000ms → 150ms)
- Better user experience
- Lower server costs
- Higher throughput

---

**[← Back to Best Practices](best-practices.md)** | **[Next: Security →](security.md)**
