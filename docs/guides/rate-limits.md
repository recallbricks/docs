# Rate Limits

Understanding and working with RecallBricks rate limits.

---

## Rate Limit Tiers

| Tier | Requests/Second | Monthly Quota | Price |
|------|----------------|---------------|-------|
| **Tier 1** (Free) | 10 | 100,000 | $0 |
| **Tier 2** | 50 | 500,000 | $29/mo |
| **Tier 3** | 200 | 2,000,000 | $99/mo |
| **Tier 4** | 1,000 | 10,000,000 | $299/mo |
| **Tier 5** (Enterprise) | Unlimited | Unlimited | Custom |

---

## Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 38
X-RateLimit-Reset: 1642248060
```

### Reading Headers

```typescript
const response = await fetch('https://recallbricks-api-clean.onrender.com/v1/memories', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

const limit = response.headers.get('X-RateLimit-Limit');
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

console.log(`${remaining}/${limit} requests remaining`);
console.log(`Resets at: ${new Date(parseInt(reset) * 1000)}`);
```

---

## Checking Rate Limit Status

```typescript
// Get current rate limit status
const rateLimit = await rb.metrics.getRateLimit();

console.log(rateLimit);
// {
//   tier: 'Tier 2',
//   limit: 50,
//   remaining: 38,
//   resetAt: '2025-01-15T10:31:00.000Z',
//   resetIn: 45  // seconds
// }
```

---

## Handling Rate Limits

### 1. Detect Rate Limit Errors

```typescript
try {
  await rb.memories.create({ content: 'test' });
} catch (error: any) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log('Rate limit hit!');
    console.log(`Retry after: ${error.retryAfter} seconds`);
  }
}
```

### 2. Exponential Backoff

```typescript
async function withBackoff<T>(fn: () => Promise<T>): Promise<T> {
  let delay = 1000;  // Start with 1 second

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        await sleep(delay);
        delay *= 2;  // Double the delay each time
        if (delay > 32000) throw error;  // Max 32 seconds
      } else {
        throw error;
      }
    }
  }
}

// Usage
const memory = await withBackoff(() =>
  rb.memories.create({ content: 'test' })
);
```

### 3. Request Queue

```typescript
class RateLimitedQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerSecond: number;

  constructor(requestsPerSecond: number) {
    this.requestsPerSecond = requestsPerSecond;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await fn());
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
    const delayMs = 1000 / this.requestsPerSecond;

    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await sleep(delayMs);
    }

    this.processing = false;
  }
}

// Usage
const queue = new RateLimitedQueue(10);  // 10 req/sec

const memory = await queue.add(() =>
  rb.memories.create({ content: 'test' })
);
```

---

## Optimization Strategies

### 1. Batch Operations

```typescript
// ❌ Bad: 100 individual requests (hits rate limit)
for (const item of items) {
  await rb.memories.create({ content: item });  // 100 requests
}

// ✅ Good: 1 batch request
await rb.memories.createBatch(
  items.map(item => ({ content: item }))
);  // 1 request
```

### 2. Caching

```typescript
const cache = new Map();

async function getCached(id: string) {
  if (cache.has(id)) {
    return cache.get(id);  // No API call = no rate limit hit
  }

  const memory = await rb.memories.get(id);
  cache.set(id, memory);
  return memory;
}
```

### 3. Pagination

```typescript
// ❌ Bad: One huge request
const all = await rb.memories.list({ limit: 10000 });

// ✅ Good: Paginated requests
const page1 = await rb.memories.list({ page: 1, limit: 100 });
// Only fetch more if needed
```

---

## Monitoring Usage

### Check Usage Regularly

```typescript
const usage = await rb.metrics.getUsage({ timeRange: '7d' });

console.log(`API Calls: ${usage.summary.apiCalls}`);
console.log(`Monthly Quota: ${usage.rateLimits.percentageUsed}% used`);

if (usage.rateLimits.percentageUsed > 80) {
  console.warn('Approaching monthly quota');
  // Consider upgrading tier
}
```

### Set Up Alerts

```typescript
async function checkRateLimitUsage() {
  const usage = await rb.metrics.getUsage({ timeRange: 'today' });

  if (usage.rateLimits.percentageUsed > 90) {
    // Send alert
    sendAlert('RecallBricks: 90% of rate limit used today');
  }
}

// Run hourly
setInterval(checkRateLimitUsage, 3600000);
```

---

## Upgrading Tiers

When to upgrade:

- **Tier 1 → Tier 2:** Consistently hitting 10 req/sec or approaching 100k/month
- **Tier 2 → Tier 3:** Need >50 req/sec or >500k requests/month
- **Tier 3 → Tier 4:** High-traffic production app (>200 req/sec)
- **Tier 4 → Tier 5:** Enterprise with unlimited needs

### How to Upgrade

1. Visit [Dashboard](https://recallbricks.com/dashboard)
2. Go to Billing → Upgrade Plan
3. Select new tier
4. Updated limits apply immediately

---

## Best Practices

### 1. Design for Your Tier

```typescript
// Tier 1 (10 req/sec): Be conservative
const limiter = new RateLimitedQueue(8);  // Leave 20% margin

// Tier 2 (50 req/sec): Can be more aggressive
const limiter = new RateLimitedQueue(45);
```

### 2. Use Batch Operations

Batch operations count as **1 request** regardless of size (up to 100 items):

```typescript
// 100 individual creates = 100 requests
// 1 batch create (100 items) = 1 request
```

### 3. Cache Aggressively

```typescript
// Cache frequently accessed data
const userPrefsCache = new TTLCache(60000);  // 1 minute TTL

async function getUserPrefs(userId: string) {
  return userPrefsCache.get(userId) ||
    await fetchAndCache(userId);
}
```

### 4. Monitor and Alert

```typescript
// Track rate limit hits
let rateLimitHits = 0;

try {
  await rb.memories.create({ content: 'test' });
} catch (error: any) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    rateLimitHits++;
    if (rateLimitHits > 10) {
      alert('Frequent rate limit hits - consider upgrading');
    }
  }
}
```

---

## Rate Limit FAQs

**Q: What counts as a request?**
A: Each API call = 1 request. Batch operations = 1 request regardless of batch size.

**Q: Do failed requests count?**
A: Yes, all requests (successful or failed) count toward your rate limit.

**Q: How often do limits reset?**
A: Per-second limits reset every second. Monthly quotas reset on your billing date.

**Q: Can I temporarily exceed limits?**
A: No. Requests beyond your limit are rejected with HTTP 429.

**Q: What happens if I exceed my monthly quota?**
A: Your requests will be rate limited until next billing cycle or you upgrade.

**Q: Do cached responses count?**
A: No. Only actual API requests count. Client-side caching reduces your request count.

---

## Rate Limit Checklist

- [ ] Know your current tier
- [ ] Understand limits (req/sec and monthly)
- [ ] Implement exponential backoff
- [ ] Use batch operations where possible
- [ ] Cache frequently accessed data
- [ ] Monitor usage regularly
- [ ] Set up alerts for high usage
- [ ] Plan tier upgrades proactively

---

**[← Error Handling](error-handling.md)** | **[Guides Home →](best-practices.md)**
