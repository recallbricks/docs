# API Reference Overview

Complete reference for the RecallBricks REST API and SDKs.

---

## Base URL

```
https://recallbricks-api-clean.onrender.com
```

All API requests must use HTTPS. HTTP requests are automatically upgraded.

---

## Authentication

Every request must include your API key in the `Authorization` header:

```http
Authorization: Bearer rb_live_your_api_key_here
```

### Example Request

```bash
curl https://recallbricks-api-clean.onrender.com/v1/memories \
  -H "Authorization: Bearer rb_live_abc123" \
  -H "Content-Type: application/json"
```

**[Get your API key →](../getting-started/authentication.md)**

---

## SDKs

### TypeScript/JavaScript

```bash
npm install recallbricks
```

```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks('rb_live_your_api_key');
```

**Version:** 1.1.0
**npm:** [https://www.npmjs.com/package/recallbricks](https://www.npmjs.com/package/recallbricks)

### Python

```bash
pip install recallbricks
```

```python
from recallbricks import RecallBricks

rb = RecallBricks('rb_live_your_api_key')
```

**Version:** 1.1.1
**PyPI:** [https://pypi.org/project/recallbricks/](https://pypi.org/project/recallbricks/)

---

## API Endpoints

### Memories

Core CRUD operations for memory management.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/memories` | POST | Create a new memory |
| `/v1/memories/:id` | GET | Retrieve a memory by ID |
| `/v1/memories/search` | POST | Search memories semantically |
| `/v1/memories/:id` | PATCH | Update a memory |
| `/v1/memories/:id` | DELETE | Delete a memory |
| `/v1/memories/batch` | POST | Create multiple memories |

**[Full Memories API Reference →](memories.md)**

### Metacognition

AI-powered prediction and pattern detection.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/metacognition/predict` | POST | Predict needed memories |
| `/v1/metacognition/patterns` | GET | Get usage patterns |
| `/v1/metacognition/metrics` | GET | Get performance metrics |
| `/v1/metacognition/feedback` | POST | Provide feedback |

**[Full Metacognition API Reference →](metacognition.md)**

### Collaboration

Multi-agent coordination and reputation tracking.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/collaboration/agents` | POST | Register an agent |
| `/v1/collaboration/agents/:id/reputation` | GET | Get agent reputation |
| `/v1/collaboration/synthesize` | POST | Synthesize agent memories |
| `/v1/collaboration/agents/compare` | POST | Compare agents |

**[Full Collaboration API Reference →](collaboration.md)**

### Monitoring

Health checks and system metrics.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/v1/metrics` | GET | System metrics |
| `/v1/usage` | GET | Your API usage stats |

**[Full Monitoring API Reference →](monitoring.md)**

---

## Request Format

All requests must use JSON:

```http
POST /v1/memories
Content-Type: application/json

{
  "content": "Your memory content here",
  "metadata": {
    "category": "preferences"
  }
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "content": "Your memory content",
    "metadata": { "category": "preferences" },
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid",
    "details": "API key must start with 'rb_live_' or 'rb_test_'"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | API key is missing or invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `MEMORY_NOT_FOUND` | 404 | Memory ID doesn't exist |
| `VALIDATION_ERROR` | 400 | Request data is invalid |
| `INSUFFICIENT_PERMISSIONS` | 403 | API key lacks permission |
| `INTERNAL_ERROR` | 500 | Server error (contact support) |

**[Full error handling guide →](../guides/error-handling.md)**

---

## Rate Limits

Rate limits are based on your subscription tier:

| Tier | Requests/Second | Monthly Quota |
|------|----------------|---------------|
| **Tier 1** (Free) | 10 | 100,000 |
| **Tier 2** | 50 | 500,000 |
| **Tier 3** | 200 | 2,000,000 |
| **Tier 4** | 1,000 | 10,000,000 |
| **Tier 5** (Enterprise) | Unlimited | Unlimited |

### Rate Limit Headers

Every response includes rate limit information:

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1642248000
```

**[Full rate limits guide →](../guides/rate-limits.md)**

---

## Pagination

For endpoints that return multiple results:

### Request

```http
GET /v1/memories/search?page=1&limit=20
```

### Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

**Default:** `page=1`, `limit=20`
**Maximum:** `limit=100`

---

## Filtering

Use query parameters for filtering:

```http
GET /v1/memories?metadata.category=preferences&metadata.importance=high
```

**Supported operators:**
- `=` (equals)
- `!=` (not equals)
- `>` (greater than)
- `<` (less than)
- `>=` (greater than or equal)
- `<=` (less than or equal)

---

## Sorting

Sort results using the `sort` parameter:

```http
GET /v1/memories?sort=-createdAt,+metadata.importance
```

**Format:**
- `+field` or `field` → ascending
- `-field` → descending

**Example:**
- `-createdAt` → newest first
- `+content` → alphabetically

---

## Timestamps

All timestamps are in **ISO 8601** format (UTC):

```
2025-01-15T10:30:00.000Z
```

**Example in SDKs:**

```typescript
// TypeScript
const memory = await rb.memories.get('mem_123');
console.log(memory.createdAt); // Date object
```

```python
# Python
memory = rb.memories.get('mem_123')
print(memory.created_at)  # datetime object
```

---

## Idempotency

Use the `Idempotency-Key` header for safe retries:

```http
POST /v1/memories
Idempotency-Key: unique-key-12345
Content-Type: application/json

{
  "content": "Memory content"
}
```

If you retry with the same key within 24 hours, you'll get the same response without creating a duplicate.

---

## Webhooks (Coming Soon)

Subscribe to events:

- `memory.created`
- `memory.updated`
- `memory.deleted`
- `pattern.detected`
- `reputation.updated`

**Documentation coming in Q2 2025.**

---

## Versioning

The API is versioned via the URL path:

```
https://recallbricks-api-clean.onrender.com/v1/...
```

**Current version:** `v1`

We maintain backwards compatibility within major versions. Breaking changes will result in a new version (`v2`, etc.) with at least 6 months of parallel support.

---

## Testing

### Test API Keys

Use test keys for development:

```
rb_test_abc123xyz789
```

**Test environment:**
- Same features as production
- Separate data (not visible in prod)
- Lower rate limits (1 req/sec)
- Free forever

**Get test keys:** [Dashboard → API Keys → Create Test Key](https://recallbricks.com/dashboard)

### Sandbox Mode

SDK sandbox mode (coming soon):

```typescript
const rb = new RecallBricks({
  apiKey: 'rb_live_abc123',
  sandbox: true  // All requests mocked
});
```

---

## Best Practices

### 1. Use Environment Variables

```typescript
// ✅ Good
const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY);

// ❌ Bad
const rb = new RecallBricks('rb_live_hardcoded_key');
```

### 2. Handle Errors Gracefully

```typescript
try {
  const memory = await rb.memories.create({ content: '...' });
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Wait and retry
  } else if (error.code === 'VALIDATION_ERROR') {
    // Fix request data
  } else {
    // Log and alert
  }
}
```

### 3. Use Batch Operations

```typescript
// ✅ Good: Batch create
await rb.memories.createBatch([
  { content: 'Memory 1' },
  { content: 'Memory 2' },
  { content: 'Memory 3' }
]);

// ❌ Bad: Individual creates
await rb.memories.create({ content: 'Memory 1' });
await rb.memories.create({ content: 'Memory 2' });
await rb.memories.create({ content: 'Memory 3' });
```

### 4. Implement Retry Logic

```typescript
const rb = new RecallBricks({
  apiKey: 'rb_live_abc123',
  retry: {
    maxRetries: 3,
    backoff: 'exponential'
  }
});
```

---

## Support

- **Documentation:** [https://docs.recallbricks.com](https://docs.recallbricks.com)
- **API Status:** [https://status.recallbricks.com](https://status.recallbricks.com)
- **Email:** support@recallbricks.com
- **Discord:** [Join the community](https://discord.gg/recallbricks)

---

## Next Steps

- **[Memories API](memories.md)** – Full CRUD operations
- **[Metacognition API](metacognition.md)** – Predictions & patterns
- **[Collaboration API](collaboration.md)** – Multi-agent systems
- **[Examples](../examples/)** – Working code samples

---

**Everything you need to build with RecallBricks.** Let's go.
