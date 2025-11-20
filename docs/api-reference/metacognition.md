# Metacognition API

AI-powered predictions, patterns, and self-optimization.

---

## Predict

Get AI predictions for which memories to retrieve.

### Endpoint

```http
POST /v1/metacognition/predict
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `context` | string | Yes | Context for prediction |
| `limit` | number | No | Max suggestions (default: 5) |
| `minConfidence` | number | No | Min confidence score (0-1) |
| `includeStrategy` | boolean | No | Include search strategy (default: true) |

### Request Example

**TypeScript:**
```typescript
const prediction = await rb.metacognition.predict({
  context: 'User asking about API authentication methods',
  limit: 3,
  minConfidence: 0.8
});

console.log(prediction.suggestedMemories);
console.log(prediction.confidence);
```

**Python:**
```python
prediction = rb.metacognition.predict(
    context='User asking about API authentication methods',
    limit=3,
    min_confidence=0.8
)

print(prediction.suggested_memories)
print(prediction.confidence)
```

**cURL:**
```bash
curl -X POST https://recallbricks-api-clean.onrender.com/v1/metacognition/predict \
  -H "Authorization: Bearer rb_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "context": "User asking about API authentication",
    "limit": 3
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "suggestedMemories": [
      {
        "id": "mem_abc123",
        "content": "API uses Bearer token authentication",
        "confidence": 0.94,
        "reasoning": "High semantic match + frequently accessed for auth queries"
      },
      {
        "id": "mem_def456",
        "content": "API keys are in format rb_live_xxx",
        "confidence": 0.89,
        "reasoning": "Related to authentication context"
      }
    ],
    "suggestedStrategy": {
      "weights": {
        "semantic": 0.7,
        "recency": 0.3
      },
      "limit": 5,
      "filters": {
        "metadata.category": "api_docs"
      }
    },
    "confidence": 0.92,
    "reasoning": "Strong pattern match based on 47 similar queries"
  }
}
```

---

## Get Patterns

Retrieve learned usage patterns.

### Endpoint

```http
GET /v1/metacognition/patterns
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | No | Filter by user ID |
| `timeRange` | string | No | `7d`, `30d`, `90d` (default: `30d`) |

### Request Example

**TypeScript:**
```typescript
const patterns = await rb.metacognition.getPatterns({
  timeRange: '30d'
});

console.log(patterns.queryPatterns);
console.log(patterns.creationPatterns);
```

**Python:**
```python
patterns = rb.metacognition.get_patterns(time_range='30d')

print(patterns.query_patterns)
print(patterns.creation_patterns)
```

### Response

```json
{
  "success": true,
  "data": {
    "queryPatterns": {
      "mostQueried": ["user_preferences", "api_docs", "conversation_history"],
      "avgRetrievalTime": 245,
      "peakQueryTimes": ["09:00-10:00", "14:00-15:00"],
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
}
```

---

## Get Metrics

Retrieve metacognitive learning metrics.

### Endpoint

```http
GET /v1/metacognition/metrics
```

### Request Example

**TypeScript:**
```typescript
const metrics = await rb.metacognition.getMetrics();

console.log(metrics.learningProgress);
console.log(metrics.optimizationGains);
```

**Python:**
```python
metrics = rb.metacognition.get_metrics()

print(metrics.learning_progress)
print(metrics.optimization_gains)
```

### Response

```json
{
  "success": true,
  "data": {
    "learningProgress": {
      "totalObservations": 1250,
      "patternsDetected": 23,
      "confidenceLevel": 0.88,
      "learningRate": "improving"
    },
    "optimizationGains": {
      "speedImprovement": "32% faster than baseline",
      "accuracyImprovement": "18% more relevant results",
      "cacheEfficiency": "76% cache hit rate"
    },
    "predictionAccuracy": {
      "overallAccuracy": 0.89,
      "highConfidencePredictions": 0.95,
      "lowConfidencePredictions": 0.72
    }
  }
}
```

---

## Provide Feedback

Give explicit feedback on predictions (helps learning).

### Endpoint

```http
POST /v1/metacognition/feedback
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `predictionId` | string | Yes | ID from prediction response |
| `useful` | boolean | Yes | Was prediction useful? |
| `usedMemories` | array | No | Memory IDs that were used |

### Request Example

**TypeScript:**
```typescript
await rb.metacognition.feedback({
  predictionId: 'pred_xyz789',
  useful: true,
  usedMemories: ['mem_abc123', 'mem_def456']
});
```

**Python:**
```python
rb.metacognition.feedback(
    prediction_id='pred_xyz789',
    useful=True,
    used_memories=['mem_abc123', 'mem_def456']
)
```

### Response

```json
{
  "success": true,
  "message": "Feedback recorded. Thank you for helping RecallBricks learn!"
}
```

---

## Get Suggestions

Get real-time suggestions for search strategies.

### Endpoint

```http
POST /v1/metacognition/suggest
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `context` | object | No | Additional context |

### Request Example

**TypeScript:**
```typescript
const suggestions = await rb.metacognition.suggest({
  query: 'user preferences',
  context: {
    sessionStart: true,
    userTier: 'premium'
  }
});

console.log(suggestions.recommendedWeights);
console.log(suggestions.recommendedFilters);
```

**Python:**
```python
suggestions = rb.metacognition.suggest(
    query='user preferences',
    context={'session_start': True, 'user_tier': 'premium'}
)
```

### Response

```json
{
  "success": true,
  "data": {
    "recommendedWeights": {
      "semantic": 0.6,
      "recency": 0.4
    },
    "recommendedFilters": {
      "metadata.category": "preferences",
      "metadata.user_tier": "premium"
    },
    "recommendedLimit": 5,
    "confidence": 0.87,
    "reasoning": "Based on 89 similar queries at session start"
  }
}
```

---

## Use Cases

### 1. Smart Chatbot

```typescript
// User sends message
const userMessage = "What documentation style do I like?";

// Get prediction
const prediction = await rb.metacognition.predict({
  context: `User message: "${userMessage}". Session turn: 3`
});

// Use high-confidence suggestions
const memories = prediction.suggestedMemories
  .filter(m => m.confidence > 0.85);

// Build response from predicted memories
const response = buildChatResponse(memories);
```

### 2. Adaptive Search

```typescript
// Get learned optimal weights
const patterns = await rb.metacognition.getPatterns();
const optimalWeights = patterns.queryPatterns.optimalWeights;

// Use in search
const results = await rb.memories.search({
  query: 'user preferences',
  weights: optimalWeights  // Learned weights
});
```

### 3. Performance Monitoring

```typescript
// Weekly metrics check
const metrics = await rb.metacognition.getMetrics();

if (metrics.learningProgress.confidenceLevel > 0.85) {
  console.log('System is well-trained, predictions are reliable');
}

if (metrics.optimizationGains.speedImprovement.includes('30%')) {
  console.log('Significant performance gains from metacognition');
}
```

---

## Best Practices

### 1. Provide Rich Context

```typescript
// ✅ Good: Detailed context
await rb.metacognition.predict({
  context: `
    User message: "How do I authenticate?"
    Session: New (first message)
    User tier: Premium
    Previous successful queries: ["API docs", "getting started"]
  `
});

// ❌ Bad: Minimal context
await rb.metacognition.predict({
  context: 'auth'
});
```

### 2. Filter by Confidence

```typescript
const prediction = await rb.metacognition.predict({ context: '...' });

// Use only high-confidence predictions
const reliable = prediction.suggestedMemories.filter(m => m.confidence > 0.85);

// Medium confidence as fallback
const fallback = prediction.suggestedMemories.filter(
  m => m.confidence >= 0.7 && m.confidence < 0.85
);
```

### 3. Provide Feedback

```typescript
// Help the system learn
await rb.metacognition.feedback({
  predictionId: prediction.id,
  useful: true,
  usedMemories: actuallyUsedMemories
});
```

---

**[← Back to Memories API](memories.md)** | **[Next: Collaboration API →](collaboration.md)**
