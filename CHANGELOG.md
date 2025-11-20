# Changelog

All notable changes to RecallBricks will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Coming in Q2 2025
- Webhooks for event notifications
- Adaptive weighting (Phase 2B metacognition)
- Custom embedding models
- SOC 2 compliance certification
- Advanced analytics dashboard
- Real-time collaboration features

---

## [1.1.1] - 2025-01-15

### Python SDK

#### Added
- Python SDK officially released to PyPI
- Full feature parity with TypeScript SDK
- Type hints for all methods
- Comprehensive docstrings

#### Fixed
- Import path issues in Python 3.8
- Metadata serialization edge cases

---

## [1.1.0] - 2025-01-10

### TypeScript/JavaScript SDK

#### Added
- **Predictive Recall (Phase 2A)** - AI predicts what memories you'll need
  - `metacognition.predict()` - Get AI-powered memory suggestions
  - Confidence scores for predictions
  - Suggested search strategies
- **Feedback API** - Help RecallBricks learn
  - `metacognition.feedback()` - Provide explicit feedback on predictions
- **Batch operations** - Improved performance
  - `memories.createBatch()` - Create up to 100 memories in one request
  - `memories.getBatch()` - Retrieve multiple memories efficiently
  - `memories.deleteBatch()` - Delete multiple memories at once

#### Changed
- Improved error messages with specific error codes
- Better TypeScript type definitions
- Optimized connection pooling (20% faster)

#### Fixed
- Retry logic for rate limit errors
- Metadata merge behavior in `update()`
- Timezone handling in timestamps

---

## [1.0.5] - 2024-12-20

### API & Platform

#### Added
- **Multi-Agent Collaboration (Phase 3)** - Full release
  - Agent registration and management
  - Reputation tracking and scoring
  - Collaborative memory synthesis
  - Agent comparison tools

#### Changed
- Cache efficiency improvements (hit rate increased from 65% to 76%)
- P95 latency reduced from 320ms to 180ms
- Embedding generation 15% faster

#### Fixed
- Race condition in concurrent memory creation
- Agent reputation calculation edge cases

---

## [1.0.0] - 2024-12-01

### Major Release

#### Added
- **Self-Optimizing Memory (Phase 1)** - Full metacognition launch
  - Automatic weighting optimization
  - Usage pattern detection
  - Performance metrics and insights
  - `metacognition.getPatterns()` API
  - `metacognition.getMetrics()` API
- **REST API v1** - Stable API release
  - Memories CRUD operations
  - Semantic search with customizable weighting
  - Metadata filtering
  - Pagination support
- **TypeScript SDK v1.0.0**
  - Full API coverage
  - Type-safe interface
  - Automatic retry logic
  - Connection pooling
- **Rate limiting** - Tier-based limits
  - Tier 1 (Free): 10 req/sec
  - Tier 2-5: Paid tiers with higher limits
- **Monitoring & Metrics**
  - Health check endpoint
  - Usage statistics API
  - Performance metrics
  - System status dashboard

#### Changed
- Embedding model upgraded to text-embedding-3-small
- Database optimizations (3x faster queries)
- Infrastructure auto-scaling

---

## [0.9.0] - 2024-11-01

### Beta Release

#### Added
- Core memory CRUD operations
- Basic semantic search
- Metadata support
- API key authentication
- Basic rate limiting

#### Changed
- Switched to PostgreSQL for metadata
- Implemented Pinecone for vector storage

#### Known Issues
- No metacognition features yet
- Limited error handling
- No SDKs (API-only)

---

## [0.5.0] - 2024-10-01

### Alpha Release

#### Added
- Initial proof of concept
- Basic vector storage
- Simple keyword search
- Test environment

#### Known Issues
- No authentication
- No rate limiting
- Single-node deployment
- Limited to 1000 memories

---

## Version History

| Version | Release Date | Key Feature |
|---------|--------------|-------------|
| **1.1.1** | 2025-01-15 | Python SDK release |
| **1.1.0** | 2025-01-10 | Predictive Recall (Phase 2A) |
| **1.0.5** | 2024-12-20 | Multi-Agent Collaboration |
| **1.0.0** | 2024-12-01 | Self-Optimizing Memory (Phase 1) |
| 0.9.0 | 2024-11-01 | Beta release |
| 0.5.0 | 2024-10-01 | Alpha release |

---

## Upgrade Guides

### Upgrading to 1.1.0 from 1.0.x

**Breaking Changes:** None

**New Features:**
- Predictive recall is now available
- Use `metacognition.predict()` for AI-powered suggestions

**Recommended Actions:**
1. Update SDK: `npm install recallbricks@latest`
2. Try predictive recall in non-critical flows
3. Gradually migrate to prediction-based retrieval

### Upgrading to 1.0.0 from 0.9.x

**Breaking Changes:**
- API endpoint paths changed from `/api/v1/` to `/v1/`
- Authentication now requires `Bearer` prefix in header

**Migration:**
```typescript
// Old (0.9.x)
headers: { 'Authorization': apiKey }

// New (1.0.0)
headers: { 'Authorization': `Bearer ${apiKey}` }
```

**New Features:**
- Metacognition APIs now available
- SDKs released (no more raw API calls needed)

---

## Deprecation Notices

### Deprecated in 1.1.0

- **`memories.search()` without weights** - Will default to AI-learned weights in v2.0.0
  - Action: Start explicitly setting weights or use predictions

### Removed in 1.0.0

- **`/api/v1/*` endpoints** - Removed (replaced with `/v1/*`)
- **Legacy auth format** - Removed (use `Bearer` prefix)

---

## Security Updates

### 1.1.1 (2025-01-15)
- Updated TLS to 1.3 exclusively
- Improved API key validation

### 1.0.5 (2024-12-20)
- Fixed agent reputation calculation vulnerability
- Added rate limit bypass prevention

### 1.0.0 (2024-12-01)
- Implemented comprehensive input sanitization
- Added request signing for enterprise customers

---

## Performance Improvements

| Version | Improvement | Impact |
|---------|-------------|--------|
| 1.1.0 | Connection pooling optimization | 20% faster |
| 1.0.5 | Cache efficiency | Hit rate: 65% → 76% |
| 1.0.5 | P95 latency reduction | 320ms → 180ms |
| 1.0.0 | Database query optimization | 3x faster |
| 1.0.0 | Embedding generation | 15% faster |

---

## Roadmap

### Q2 2025
- [ ] Webhooks for memory events
- [ ] Adaptive weighting (Phase 2B)
- [ ] Custom embedding models
- [ ] SOC 2 certification
- [ ] GraphQL API

### Q3 2025
- [ ] Real-time collaboration
- [ ] Multi-modal embeddings
- [ ] Advanced analytics

### Q4 2025
- [ ] On-premise deployment (Enterprise)
- [ ] Custom model fine-tuning

---

## Links

- **Documentation:** [docs.recallbricks.com](https://docs.recallbricks.com)
- **API Status:** [status.recallbricks.com](https://status.recallbricks.com)
- **Roadmap:** [roadmap.recallbricks.com](https://roadmap.recallbricks.com)
- **GitHub:** [github.com/recallbricks/recallbricks](https://github.com/recallbricks/recallbricks)

---

**Questions about a release?** Contact support@recallbricks.com
