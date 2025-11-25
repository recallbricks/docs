# Quickstart

Get RecallBricks running in **60 seconds**. Copy, paste, run.

---

## TypeScript/JavaScript

### 1. Install

```bash
npm install recallbricks
```

### 2. Run This Code

```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks({ apiKey: 'your-api-key-here' });

// Create a memory
const memory = await rb.createMemory(
  'User prefers concise technical documentation with working code examples',
  { tags: ['user_preferences', 'high_importance'] }
);

console.log('✓ Memory created:', memory.id);

// Let RecallBricks predict what you'll need (metacognition!)
const prediction = await rb.predictMemories({
  context: 'User just asked about API documentation style'
});

console.log('✓ AI Prediction:', prediction.memories[0].text);
console.log('✓ Confidence:', prediction.confidence);

// Get usage patterns
const patterns = await rb.getPatterns(7);

console.log('✓ Learning patterns:', patterns.queryPatterns);
```

### Expected Output

```
✓ Memory created: mem_abc123xyz789
✓ AI Prediction: User prefers concise technical documentation with working code examples
✓ Confidence: 0.94
✓ Learning patterns: { mostQueried: ['user_preferences'], avgRetrievalTime: 245 }
```

**That's it.** You just:
1. Stored a memory
2. Let AI predict what to retrieve
3. Saw RecallBricks learning from usage

---

## Python

### 1. Install

```bash
pip install recallbricks
```

### 2. Run This Code

```python
from recallbricks import RecallBricks

rb = RecallBricks(api_key='your-api-key-here')

# Create a memory
memory = rb.save(
    'User prefers concise technical documentation with working code examples',
    tags=['user_preferences', 'high_importance']
)

print(f'✓ Memory created: {memory["id"]}')

# Let RecallBricks predict what you'll need (metacognition!)
prediction = rb.predict_memories(
    context='User just asked about API documentation style'
)

print(f'✓ AI Prediction: {prediction["memories"][0]["text"]}')
print(f'✓ Confidence: {prediction["confidence"]}')

# Get usage patterns
patterns = rb.get_patterns(days=7)

print(f'✓ Learning patterns: {patterns["query_patterns"]}')
```

### Expected Output

```
✓ Memory created: mem_abc123xyz789
✓ AI Prediction: User prefers concise technical documentation with working code examples
✓ Confidence: 0.94
✓ Learning patterns: {'most_queried': ['user_preferences'], 'avg_retrieval_time': 245}
```

---

## What Just Happened?

You experienced **metacognition**—the core innovation of RecallBricks:

1. **Created a memory** – Standard vector storage (like any DB)
2. **AI predicted** what you'd need – RecallBricks analyzed context and suggested the right memory
3. **Saw learning** – The system tracked patterns from your usage

### This is NOT a normal vector database

Traditional vector DBs require you to:
- Specify exact search queries
- Tune weighting parameters manually
- Build retrieval logic yourself

RecallBricks does this automatically by learning from how you use it.

---

## Get Your API Key

1. Visit: `https://recallbricks.com/dashboard`
2. Sign up (free tier: 10 req/sec)
3. Copy your API key from the dashboard
4. Replace `'your-api-key-here'` in the code above

---

## Next Steps

Now that you've seen the basics, dive deeper:

- **[Core Concepts: Metacognition](../core-concepts/metacognition.md)** – Understand the breakthrough
- **[API Reference: Memories](../api-reference/memories.md)** – Full CRUD operations
- **[Example: Chatbot Memory](../examples/chatbot-memory.ts)** – Build a real application
- **[Best Practices](../guides/best-practices.md)** – Production-ready patterns

---

## Need Help?

- **[Common Issues](../troubleshooting/common-issues.md)** – Quick fixes
- **[FAQ](../troubleshooting/faq.md)** – Your questions answered
- **Email:** support@recallbricks.com
- **Discord:** [Join the community](https://discord.gg/recallbricks)

---

**You're ready to build.** RecallBricks will learn and optimize as you go.
