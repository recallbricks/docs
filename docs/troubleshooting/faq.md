# Frequently Asked Questions

Common questions about RecallBricks.

---

## General

### What is RecallBricks?

RecallBricks is a **cognitive memory system** with metacognition—the ability to learn from its own usage and optimize itself. Unlike traditional vector databases that just store and retrieve, RecallBricks predicts what you'll need, adapts weighting strategies, and gets smarter over time.

### How is it different from a vector database?

| Feature | Vector DB | RecallBricks |
|---------|-----------|--------------|
| Store & retrieve | ✅ | ✅ |
| Semantic search | ✅ | ✅ |
| **Learns from usage** | ❌ | ✅ |
| **Predicts needs** | ❌ | ✅ |
| **Self-optimizes** | ❌ | ✅ |
| **Multi-agent collaboration** | ❌ | ✅ |

RecallBricks is **cognitive infrastructure**, not just storage.

### Do I need to manually tune parameters?

No! That's the point of metacognition. RecallBricks learns optimal weights, predicts what you need, and suggests strategies automatically. You can override if you want, but the system gets smarter the more you use it.

---

## Pricing & Limits

### Is there a free tier?

Yes! **Tier 1** is free forever:
- 10 requests/second
- 100,000 requests/month
- Full features (including metacognition)

Perfect for development, MVPs, and small apps.

### What happens if I exceed my rate limit?

Requests beyond your limit are rejected with HTTP 429 (`RATE_LIMIT_EXCEEDED`). You can:
1. Wait for the limit to reset (per-second limits reset every second)
2. Implement exponential backoff
3. Upgrade to a higher tier

### Can I upgrade/downgrade anytime?

Yes, instant upgrades and downgrades with pro-rated billing.

### What's included in each tier?

All tiers have the same features. The difference is:
- Requests per second (10 to unlimited)
- Monthly quota (100k to unlimited)
- Support SLA (email vs priority)

---

## Technical

### Which embedding model does RecallBricks use?

OpenAI's **text-embedding-3-small**:
- 1536 dimensions
- Max 8,191 tokens
- High quality, optimized for speed

### Can I bring my own embeddings?

Not currently. RecallBricks generates embeddings automatically to ensure consistency and quality.

### What languages are supported?

**SDKs:**
- TypeScript/JavaScript (npm)
- Python (PyPI)

**API:**
- REST API (language-agnostic)
- Use any language with HTTP support

### Does RecallBricks store my data?

Yes, that's how it works! Your memories are stored securely:
- Encrypted in transit (TLS 1.3)
- Encrypted at rest (AES-256)
- SOC 2 compliant (coming Q2 2025)

**Do not store:**
- Unencrypted PII
- Passwords or secrets
- Credit card data

### Can I delete my data?

Yes, anytime:
- Delete specific memories: `rb.memories.delete(id)`
- Delete all data: Contact support@recallbricks.com

Data deletion is immediate and permanent (GDPR compliant).

### What's the SLA?

- **Uptime:** 99.9% (measured monthly)
- **P95 Latency:** <500ms
- **Support:** <24 hours (business days)

Enterprise customers get custom SLAs.

---

## Metacognition

### What is metacognition?

**Metacognition** = thinking about thinking. RecallBricks:
1. Observes how you use it
2. Detects patterns
3. Predicts what you'll need
4. Optimizes itself

Example: After noticing you always query "user preferences" at session start, RecallBricks will predict and cache those memories.

### How long does it take to learn?

- **Basic patterns:** 7-14 days
- **Reliable predictions:** 30 days
- **High confidence:** 60+ days

More usage = faster learning.

### Can I disable metacognition?

You can choose not to use prediction features, but the system always observes and learns (it's core to how RecallBricks works). Think of it as "free optimization" you get automatically.

### Does metacognition work across users?

No. Patterns are learned per-account, not globally. Your usage patterns don't affect other users.

---

## Collaboration

### What is multi-agent collaboration?

Multiple AI agents can:
- Share a memory pool
- Build reputation scores
- Have their contributions weighted by trust

High-reputation agents have more influence in synthesis.

### How is reputation calculated?

```
Reputation = (
  0.4 × Retrieval Success Rate +
  0.3 × Average Confidence +
  0.2 × Consistency Score +
  0.1 × Contribution Volume
)
```

Agents earn reputation by contributing high-quality, frequently-used memories.

### Can agents compete with each other?

Not directly, but you can compare agents:

```typescript
const comparison = await rb.collaboration.compareAgents({
  agentIds: ['agent1', 'agent2', 'agent3']
});

console.log(comparison.topPerformer);
```

---

## Integration

### Can I use RecallBricks with LangChain?

Yes! RecallBricks works great with LangChain:

```typescript
import { RecallBricks } from 'recallbricks';
import { ChatOpenAI } from 'langchain/chat_models/openai';

const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY);
const llm = new ChatOpenAI();

// Get context from RecallBricks
const context = await rb.memories.search({ query: userMessage });

// Use with LLM
const response = await llm.call([
  { role: 'system', content: `Context: ${JSON.stringify(context)}` },
  { role: 'user', content: userMessage }
]);
```

### Can I self-host RecallBricks?

Not currently. RecallBricks is cloud-only to ensure:
- Automatic updates
- Optimal performance
- Continuous metacognitive learning

Enterprise customers can discuss dedicated instances.

### Can I use RecallBricks in production?

Absolutely! RecallBricks is built for production:
- 99.9% uptime SLA
- Auto-scaling infrastructure
- Enterprise support available
- SOC 2 compliance (coming Q2 2025)

---

## Performance

### How fast is RecallBricks?

**Typical P95 latency:**
- `memories.get()`: ~120ms
- `memories.search()`: ~280ms
- `metacognition.predict()`: ~320ms

With caching:
- Cached `get()`: ~12ms
- Cache hit rate: 70-80% after 30 days

### Can I make it faster?

Yes:
1. **Cache frequently accessed memories**
2. **Use batch operations**
3. **Implement pagination**
4. **Use predictive recall** (pre-fetches likely needs)

See [Performance Optimization Guide](../guides/performance-optimization.md).

### What's the max data I can store?

**Per namespace:**
- 10 million memories
- 100GB of content

Need more? Contact enterprise@recallbricks.com

---

## Security

### Is my data secure?

Yes:
- **In transit:** TLS 1.3
- **At rest:** AES-256
- **Access:** API key authentication
- **Compliance:** GDPR, SOC 2 (coming Q2 2025)

### Should I use RecallBricks for PII?

Only if encrypted client-side. RecallBricks is not HIPAA-compliant.

For sensitive data:
1. Encrypt before storing
2. Store encrypted references
3. Keep decryption keys separate

### Can RecallBricks employees see my data?

No. Data is encrypted and access is logged. Support can only access data with your explicit permission for debugging.

---

## Billing

### How does billing work?

- **Monthly subscription** based on tier
- **Pro-rated** for upgrades/downgrades
- **Auto-renewal** on billing date
- **Cancel anytime** (no long-term contracts)

### What payment methods are accepted?

- Credit card (Visa, Mastercard, Amex)
- ACH (Enterprise only)
- Wire transfer (Enterprise only)

### Do you offer discounts?

- **Annual plans:** 20% off
- **Startups:** Apply for startup program
- **Nonprofits:** 50% off (verify status)
- **Education:** Free for students/teachers

Email sales@recallbricks.com

---

## Support

### How do I get help?

1. **Documentation:** [docs.recallbricks.com](https://docs.recallbricks.com)
2. **Community:** [Discord](https://discord.gg/recallbricks)
3. **Email:** support@recallbricks.com
4. **GitHub:** [Issues](https://github.com/recallbricks/recallbricks/issues)

### What's the response time?

- **Free tier:** <48 hours (business days)
- **Paid tiers:** <24 hours
- **Enterprise:** <4 hours (24/7)

### Can I request features?

Yes! Submit requests to:
- GitHub: [Feature Requests](https://github.com/recallbricks/recallbricks/issues)
- Email: feedback@recallbricks.com
- Discord: #feature-requests channel

We prioritize based on demand and feasibility.

---

## Roadmap

### What's coming next?

**Q2 2025:**
- Webhooks for events
- Adaptive weighting (Phase 2B)
- Custom embedding models
- SOC 2 compliance
- Advanced analytics dashboard

**Q3 2025:**
- Real-time collaboration features
- GraphQL API
- Enhanced multi-modal support

**Q4 2025:**
- On-premise deployment (Enterprise)
- Advanced security features

See full roadmap: [roadmap.recallbricks.com](https://roadmap.recallbricks.com)

---

## Still have questions?

- **Email:** support@recallbricks.com
- **Discord:** [Join community](https://discord.gg/recallbricks)
- **Twitter:** [@recallbricks](https://twitter.com/recallbricks)

---

**[← Common Issues](common-issues.md)** | **[Documentation Home →](../README.md)**
