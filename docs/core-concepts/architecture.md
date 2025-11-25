# Architecture

How RecallBricks works under the hood.

---

## System Overview

RecallBricks is built as a **cognitive layer** that sits between your AI application and your data.

```
┌─────────────────────────────────────────────────────┐
│           YOUR AI APPLICATION                        │
│   (Chatbot, Agent, RAG System, etc.)                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              RECALLBRICKS SDK                        │
│        (TypeScript/Python Client)                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼ HTTPS/REST API
┌─────────────────────────────────────────────────────┐
│         RECALLBRICKS API LAYER                       │
│  - Authentication  - Rate Limiting  - Routing        │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │MEMORY  │  │METACOG │  │COLLAB  │
    │SERVICE │  │SERVICE │  │SERVICE │
    └────┬───┘  └────┬───┘  └────┬───┘
         │           │           │
         └───────────┼───────────┘
                     ▼
         ┌───────────────────────┐
         │   VECTOR DATABASE      │
         │   (Pinecone/Weaviate)  │
         └───────────────────────┘
         ┌───────────────────────┐
         │   METADATA STORE       │
         │   (PostgreSQL)         │
         └───────────────────────┘
         ┌───────────────────────┐
         │   ANALYTICS ENGINE     │
         │   (Pattern Detection)  │
         └───────────────────────┘
```

---

## Core Components

### 1. SDK Layer (Client-Side)

**Purpose:** Developer-friendly interface

**TypeScript SDK:**
```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks(apiKey);
```

**Python SDK:**
```python
from recallbricks import RecallBricks

rb = RecallBricks(api_key)
```

**Features:**
- Automatic authentication
- Type safety (TypeScript)
- Error handling
- Retry logic
- Request batching

### 2. API Layer

**Purpose:** HTTP interface to RecallBricks services

**Base URL:** `https://recallbricks-api-clean.onrender.com`

**Responsibilities:**
- API key authentication
- Rate limiting (per tier)
- Request validation
- Response formatting
- Load balancing

**Example Request:**
```http
POST /v1/memories
Authorization: Bearer rb_live_abc123
Content-Type: application/json

{
  "content": "User prefers dark mode",
  "metadata": { "category": "preferences" }
}
```

### 3. Memory Service

**Purpose:** Core CRUD operations for memories

**Operations:**
- `create()` - Store new memories with embeddings
- `get()` - Retrieve specific memory by ID
- `search()` - Semantic search with weighting
- `update()` - Modify existing memories
- `delete()` - Remove memories

**Data Flow:**
```
1. Receive content → 2. Generate embedding (OpenAI) →
3. Store vector (Pinecone) → 4. Store metadata (PostgreSQL) →
5. Return memory object
```

### 4. Metacognition Service

**Purpose:** Self-learning and prediction

**Operations:**
- `predict()` - Suggest memories based on context
- `getPatterns()` - Return usage patterns
- `getMetrics()` - Return performance metrics
- `feedback()` - Learn from explicit feedback

**Data Flow:**
```
1. Observe usage → 2. Detect patterns →
3. Build prediction model → 4. Suggest optimal strategies →
5. Learn from feedback → 6. Update model
```

**Components:**
- **Pattern Detector:** Analyzes query/retrieval patterns
- **Prediction Engine:** ML model for suggestions
- **Metrics Aggregator:** Tracks performance over time

### 5. Collaboration Service

**Purpose:** Multi-agent coordination

**Operations:**
- `registerAgent()` - Create agent identity
- `getReputation()` - Get agent trust score
- `synthesize()` - Combine agent memories
- `compareAgents()` - Compare agent performance

**Data Flow:**
```
1. Track agent contributions →
2. Calculate reputation scores →
3. Weight agent memories by reputation →
4. Synthesize collaborative insights
```

---

## Data Model

### Memory Object

```typescript
{
  id: string;              // Unique ID (e.g., "mem_abc123")
  content: string;         // The actual memory content
  embedding: number[];     // Vector representation (1536 dims)
  metadata: {
    [key: string]: any;    // Custom metadata
    createdAt: timestamp;
    updatedAt: timestamp;
    agentId?: string;      // Optional: agent that created it
    confidence?: number;   // Optional: confidence score
  };
  userId: string;          // Owner of the memory
  namespace?: string;      // Optional: for multi-tenancy
}
```

### Embedding Generation

RecallBricks uses **OpenAI's text-embedding-3-small** model:
- **Dimensions:** 1536
- **Max tokens:** 8191
- **Cost:** $0.00002/1K tokens

**Process:**
```
Content → OpenAI Embeddings API → 1536-dim vector → Stored
```

### Vector Storage

**Technology:** Pinecone (or Weaviate, configurable)

**Index Structure:**
```
{
  vectors: [
    {
      id: "mem_abc123",
      values: [0.123, -0.456, ...],  // 1536 dimensions
      metadata: { userId: "user_123", category: "preferences" }
    }
  ]
}
```

### Metadata Storage

**Technology:** PostgreSQL

**Schema:**
```sql
CREATE TABLE memories (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  agent_id VARCHAR(255),
  confidence FLOAT
);

CREATE INDEX idx_user_id ON memories(user_id);
CREATE INDEX idx_created_at ON memories(created_at);
CREATE INDEX idx_metadata ON memories USING GIN(metadata);
```

---

## Search Architecture

### Semantic Search Flow

```
1. User Query: "user preferences"
   ↓
2. Generate Embedding: OpenAI API
   ↓
3. Vector Search: Pinecone similarity search
   ↓
4. Apply Weighting:
   - Semantic similarity: 0.7
   - Recency: 0.3
   ↓
5. Rank Results: Combined score
   ↓
6. Fetch Metadata: PostgreSQL join
   ↓
7. Return Results: Top K memories
```

### Weighting Formula

```
Final Score = (semantic_score × semantic_weight) + (recency_score × recency_weight)

Where:
  semantic_score = cosine_similarity(query_embedding, memory_embedding)
  recency_score = 1 - (days_since_creation / max_days)
```

### Example Calculation

```
Memory A:
  - Semantic similarity: 0.95
  - Created: 2 days ago
  - Recency score: 1 - (2/365) = 0.9945
  - Weights: { semantic: 0.7, recency: 0.3 }
  - Final: (0.95 × 0.7) + (0.9945 × 0.3) = 0.665 + 0.298 = 0.963

Memory B:
  - Semantic similarity: 0.88
  - Created: 30 days ago
  - Recency score: 1 - (30/365) = 0.918
  - Weights: { semantic: 0.7, recency: 0.3 }
  - Final: (0.88 × 0.7) + (0.918 × 0.3) = 0.616 + 0.275 = 0.891

Result: Memory A ranks higher
```

---

## Metacognition Architecture

### Pattern Detection

**How it works:**

1. **Observation Collection**
   - Every query logged to analytics DB
   - Metadata: query, results, timestamp, user

2. **Pattern Analysis** (runs hourly)
   ```sql
   SELECT
     query,
     COUNT(*) as frequency,
     AVG(retrieval_time) as avg_time
   FROM query_logs
   GROUP BY query
   ORDER BY frequency DESC;
   ```

3. **Insight Generation**
   - Most queried terms
   - Optimal weighting strategies
   - Peak usage times
   - Performance bottlenecks

4. **Storage**
   - Patterns cached in Redis
   - Historical data in PostgreSQL

### Prediction Engine

**Model:** Lightweight ML model (scikit-learn Random Forest)

**Training Data:**
- Historical queries
- Retrieved memories
- User feedback (implicit/explicit)
- Success metrics (click-through, usage)

**Prediction Process:**
```
Context → Feature Extraction → Model Inference → Suggestions
```

**Features Used:**
- Query text (TF-IDF vectors)
- User history
- Time of day
- Previous query patterns
- Metadata preferences

**Output:**
- Suggested memory IDs
- Confidence scores
- Optimal weighting strategy

---

## Collaboration Architecture

### Reputation Calculation

**Data Sources:**
- Memory creation logs
- Retrieval success rates
- Confidence score accuracy
- User feedback

**Calculation (runs daily):**
```python
def calculate_reputation(agent_id):
    metrics = fetch_agent_metrics(agent_id)

    retrieval_success = metrics.successful_retrievals / metrics.total_memories
    avg_confidence = metrics.avg_confidence_score
    consistency = calculate_consistency(metrics.history)
    volume_factor = min(metrics.total_contributions / 1000, 1.0)

    reputation = (
        0.4 * retrieval_success +
        0.3 * avg_confidence +
        0.2 * consistency +
        0.1 * volume_factor
    )

    return reputation
```

**Storage:**
```sql
CREATE TABLE agent_reputations (
  agent_id VARCHAR(255) PRIMARY KEY,
  reputation_score FLOAT,
  total_contributions INT,
  successful_retrievals INT,
  avg_confidence FLOAT,
  updated_at TIMESTAMP
);
```

### Synthesis Algorithm

**Weighted aggregation:**
```python
def synthesize(agent_memories):
    weighted_memories = []

    for agent in agent_memories:
        reputation = get_reputation(agent.agent_id)

        for memory in agent.memories:
            weighted_score = memory.confidence * reputation
            weighted_memories.append({
                'memory': memory,
                'weight': weighted_score
            })

    # Sort by weighted score
    weighted_memories.sort(key=lambda x: x['weight'], reverse=True)

    return weighted_memories[:limit]
```

---

## Performance Optimizations

### 1. Caching Strategy

**Multi-Layer Cache:**

```
L1: In-Memory (SDK)
  ↓ (miss)
L2: Redis (API Layer)
  ↓ (miss)
L3: Database (PostgreSQL + Pinecone)
```

**Cache Keys:**
- Frequently accessed memories
- Common search queries
- Usage patterns
- Reputation scores

**TTL (Time to Live):**
- Memories: 1 hour
- Search results: 15 minutes
- Patterns: 1 day
- Reputation: 1 day

### 2. Request Batching

SDK automatically batches requests:

```typescript
// Note: Direct memory retrieval by ID requires REST API
// Individual requests can be batched:
// GET /v1/memories/batch?ids=mem_1,mem_2,mem_3

// For search operations, use the SDK:
const results = await rb.search(query, { limit: 10 });
```

### 3. Connection Pooling

- **PostgreSQL:** 100 connection pool
- **Redis:** 50 connection pool
- **Pinecone:** gRPC connection reuse

### 4. Async Processing

Long-running operations are async:

```
Embedding generation → Background job queue (Bull/Redis)
Pattern detection → Scheduled cron job
Reputation updates → Nightly batch job
```

---

## Security Architecture

### 1. Authentication

**API Keys:**
- Format: `rb_{env}_{random_32_chars}`
- Hashed with bcrypt (stored securely)
- Scoped permissions (read/write/admin)

### 2. Authorization

**Row-Level Security:**
```sql
-- Users can only access their own memories
SELECT * FROM memories
WHERE user_id = current_user_id();
```

### 3. Encryption

- **In transit:** TLS 1.3
- **At rest:** AES-256 (database encryption)
- **API keys:** bcrypt hashed

### 4. Rate Limiting

**Per-Tier Limits:**
```
Tier 1: 10 req/sec  → Redis rate limiter
Tier 2: 50 req/sec
Tier 3: 200 req/sec
Tier 4: 1000 req/sec
Tier 5: Unlimited
```

**Algorithm:** Token bucket with Redis

---

## Scalability

### Horizontal Scaling

**API Layer:**
- Load balanced across N instances
- Stateless (all state in DB/cache)
- Auto-scaling based on CPU/memory

**Database Layer:**
- PostgreSQL: Read replicas (3x)
- Pinecone: Sharded by namespace
- Redis: Cluster mode (3 nodes)

### Vertical Scaling

**Current Resources:**
- API Servers: 4 vCPU, 8GB RAM
- PostgreSQL: 8 vCPU, 16GB RAM
- Redis: 2 vCPU, 4GB RAM
- Pinecone: Managed, auto-scaled

**Limits:**
- Max memories: 10M per namespace
- Max QPS: 10,000 (Tier 5)
- Max embedding batch: 100 memories

---

## Monitoring & Observability

### Metrics

**Performance:**
- P50/P95/P99 latency
- Request throughput (req/sec)
- Error rate
- Cache hit rate

**Business:**
- Memories created/day
- Active users
- API calls/user
- Tier distribution

### Logging

**Structured Logs (JSON):**
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "level": "info",
  "service": "memory-service",
  "operation": "create_memory",
  "user_id": "user_123",
  "latency_ms": 245,
  "success": true
}
```

### Alerting

**Critical Alerts:**
- API error rate > 1%
- P95 latency > 1000ms
- Database connection failures
- Rate limit violations (per user)

---

## Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| **API Framework** | Express.js (Node.js) |
| **SDK Languages** | TypeScript, Python |
| **Vector Database** | Pinecone |
| **Metadata Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Embeddings** | OpenAI text-embedding-3-small |
| **Queue** | Bull (Redis-backed) |
| **Hosting** | Render.com |
| **Monitoring** | Datadog |
| **Logging** | Winston → CloudWatch |

---

## Key Takeaways

1. **Layered architecture**
   - SDK → API → Services → Storage
   - Each layer has a clear responsibility

2. **Optimized for performance**
   - Multi-layer caching
   - Connection pooling
   - Async processing

3. **Built for scale**
   - Horizontal scaling
   - Auto-scaling
   - Efficient resource usage

4. **Metacognition is core**
   - Pattern detection
   - Prediction engine
   - Reputation tracking

---

## Next Steps

- **[Getting Started](../getting-started/quickstart.md)** – Start building
- **[API Reference](../api-reference/overview.md)** – Full API docs
- **[Best Practices](../guides/best-practices.md)** – Production patterns

---

**Now you know how it works.** Build with confidence.
