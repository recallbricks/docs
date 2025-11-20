# Memories API

Complete reference for memory CRUD operations.

---

## Create Memory

Store a new memory with automatic embedding generation.

### Endpoint

```http
POST /v1/memories
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `content` | string | Yes | The memory content (max 8,000 chars) |
| `metadata` | object | No | Custom metadata (key-value pairs) |
| `namespace` | string | No | Namespace for multi-tenancy |

### Request Example

**TypeScript:**
```typescript
const memory = await rb.memories.create({
  content: 'User prefers concise documentation with code examples',
  metadata: {
    category: 'user_preferences',
    importance: 'high',
    user_id: 'user_123'
  }
});

console.log(memory.id); // mem_abc123
```

**Python:**
```python
memory = rb.memories.create(
    content='User prefers concise documentation with code examples',
    metadata={
        'category': 'user_preferences',
        'importance': 'high',
        'user_id': 'user_123'
    }
)

print(memory.id)  # mem_abc123
```

**cURL:**
```bash
curl -X POST https://recallbricks-api-clean.onrender.com/v1/memories \
  -H "Authorization: Bearer rb_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "User prefers concise documentation",
    "metadata": {
      "category": "user_preferences"
    }
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123xyz789",
    "content": "User prefers concise documentation with code examples",
    "metadata": {
      "category": "user_preferences",
      "importance": "high",
      "user_id": "user_123"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Errors

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Content is empty or too long |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INVALID_API_KEY` | Authentication failed |

---

## Get Memory

Retrieve a specific memory by ID.

### Endpoint

```http
GET /v1/memories/:id
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Memory ID (e.g., `mem_abc123`) |

### Request Example

**TypeScript:**
```typescript
const memory = await rb.memories.get('mem_abc123');
console.log(memory.content);
```

**Python:**
```python
memory = rb.memories.get('mem_abc123')
print(memory.content)
```

**cURL:**
```bash
curl https://recallbricks-api-clean.onrender.com/v1/memories/mem_abc123 \
  -H "Authorization: Bearer rb_live_abc123"
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123xyz789",
    "content": "User prefers concise documentation",
    "metadata": { "category": "user_preferences" },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Errors

| Code | Description |
|------|-------------|
| `MEMORY_NOT_FOUND` | Memory ID doesn't exist |
| `INVALID_API_KEY` | Authentication failed |

---

## Search Memories

Semantic search with customizable weighting.

### Endpoint

```http
POST /v1/memories/search
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `limit` | number | No | Max results (default: 10, max: 100) |
| `weights` | object | No | `{ semantic, recency }` (default: `{ 0.5, 0.5 }`) |
| `metadata` | object | No | Metadata filters |
| `minScore` | number | No | Minimum similarity score (0-1) |

### Request Example

**TypeScript:**
```typescript
const results = await rb.memories.search({
  query: 'user preferences',
  limit: 5,
  weights: {
    semantic: 0.7,
    recency: 0.3
  },
  metadata: {
    category: 'user_preferences'
  },
  minScore: 0.8
});

results.forEach(r => console.log(r.content, r.score));
```

**Python:**
```python
results = rb.memories.search(
    query='user preferences',
    limit=5,
    weights={'semantic': 0.7, 'recency': 0.3},
    metadata={'category': 'user_preferences'},
    min_score=0.8
)

for result in results:
    print(result.content, result.score)
```

**cURL:**
```bash
curl -X POST https://recallbricks-api-clean.onrender.com/v1/memories/search \
  -H "Authorization: Bearer rb_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "user preferences",
    "limit": 5,
    "weights": { "semantic": 0.7, "recency": 0.3 }
  }'
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "mem_abc123",
      "content": "User prefers dark mode",
      "metadata": { "category": "user_preferences" },
      "score": 0.94,
      "semanticScore": 0.96,
      "recencyScore": 0.89
    },
    {
      "id": "mem_def456",
      "content": "User likes technical documentation",
      "metadata": { "category": "user_preferences" },
      "score": 0.87,
      "semanticScore": 0.85,
      "recencyScore": 0.92
    }
  ]
}
```

---

## Update Memory

Modify an existing memory.

### Endpoint

```http
PATCH /v1/memories/:id
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Memory ID |
| `content` | string | No | New content |
| `metadata` | object | No | Updated metadata (merged with existing) |

### Request Example

**TypeScript:**
```typescript
const updated = await rb.memories.update('mem_abc123', {
  content: 'User strongly prefers dark mode',
  metadata: {
    importance: 'critical'  // Merged with existing metadata
  }
});
```

**Python:**
```python
updated = rb.memories.update(
    'mem_abc123',
    content='User strongly prefers dark mode',
    metadata={'importance': 'critical'}
)
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "content": "User strongly prefers dark mode",
    "metadata": {
      "category": "user_preferences",
      "importance": "critical"
    },
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

---

## Delete Memory

Permanently delete a memory.

### Endpoint

```http
DELETE /v1/memories/:id
```

### Request Example

**TypeScript:**
```typescript
await rb.memories.delete('mem_abc123');
```

**Python:**
```python
rb.memories.delete('mem_abc123')
```

**cURL:**
```bash
curl -X DELETE https://recallbricks-api-clean.onrender.com/v1/memories/mem_abc123 \
  -H "Authorization: Bearer rb_live_abc123"
```

### Response

```json
{
  "success": true,
  "message": "Memory deleted successfully"
}
```

---

## Batch Create

Create multiple memories in one request.

### Endpoint

```http
POST /v1/memories/batch
```

### Request Example

**TypeScript:**
```typescript
const memories = await rb.memories.createBatch([
  { content: 'Memory 1', metadata: { type: 'A' } },
  { content: 'Memory 2', metadata: { type: 'B' } },
  { content: 'Memory 3', metadata: { type: 'C' } }
]);

console.log(memories.length); // 3
```

**Python:**
```python
memories = rb.memories.create_batch([
    {'content': 'Memory 1', 'metadata': {'type': 'A'}},
    {'content': 'Memory 2', 'metadata': {'type': 'B'}},
    {'content': 'Memory 3', 'metadata': {'type': 'C'}}
])
```

### Response

```json
{
  "success": true,
  "data": [
    { "id": "mem_1", "content": "Memory 1", ... },
    { "id": "mem_2", "content": "Memory 2", ... },
    { "id": "mem_3", "content": "Memory 3", ... }
  ]
}
```

**Limit:** 100 memories per batch

---

## List Memories

Get all memories with pagination.

### Endpoint

```http
GET /v1/memories
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Results per page (default: 20, max: 100) |
| `sort` | string | No | Sort field (e.g., `-createdAt`) |

### Request Example

**TypeScript:**
```typescript
const { data, pagination } = await rb.memories.list({
  page: 1,
  limit: 20,
  sort: '-createdAt'
});

console.log(pagination.total); // Total memories
```

**Python:**
```python
result = rb.memories.list(page=1, limit=20, sort='-createdAt')
print(result['pagination']['total'])
```

---

## Best Practices

### 1. Use Metadata Effectively

```typescript
// ✅ Good: Structured metadata
await rb.memories.create({
  content: 'User opened dashboard',
  metadata: {
    category: 'user_activity',
    action: 'page_view',
    page: 'dashboard',
    timestamp: new Date().toISOString(),
    user_id: 'user_123'
  }
});
```

### 2. Optimize Search Weights

```typescript
// Recent info matters more
const recentResults = await rb.memories.search({
  query: 'user activity',
  weights: { semantic: 0.3, recency: 0.7 }
});

// Semantic similarity matters more
const comprehensiveResults = await rb.memories.search({
  query: 'technical documentation',
  weights: { semantic: 0.9, recency: 0.1 }
});
```

### 3. Batch Operations

```typescript
// ✅ Good: Single batch request
await rb.memories.createBatch(memories);

// ❌ Bad: Multiple individual requests
for (const mem of memories) {
  await rb.memories.create(mem);
}
```

---

**[← Back to Overview](overview.md)** | **[Next: Metacognition API →](metacognition.md)**
