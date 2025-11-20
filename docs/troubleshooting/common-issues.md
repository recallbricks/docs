# Common Issues

Quick solutions to frequent problems.

---

## Authentication Issues

### "Invalid API Key" Error

**Problem:** Getting `INVALID_API_KEY` error

**Solutions:**

1. **Check key format**
   ```typescript
   // ✅ Correct format
   rb_live_abc123xyz789
   rb_test_abc123xyz789

   // ❌ Wrong format
   abc123  // Missing prefix
   ```

2. **Verify environment variable**
   ```bash
   # Check if set
   echo $RECALLBRICKS_API_KEY

   # Re-export if needed
   export RECALLBRICKS_API_KEY='rb_live_your_key_here'
   ```

3. **Check key hasn't been revoked**
   - Visit [Dashboard](https://recallbricks.com/dashboard)
   - Verify key is active

---

## Rate Limit Issues

### Hitting Rate Limits

**Problem:** `RATE_LIMIT_EXCEEDED` errors

**Solutions:**

1. **Check current tier**
   ```typescript
   const usage = await rb.metrics.getUsage();
   console.log(usage.rateLimits.tier);  // Current tier
   ```

2. **Implement backoff**
   ```typescript
   async function withBackoff(fn) {
     try {
       return await fn();
     } catch (error) {
       if (error.code === 'RATE_LIMIT_EXCEEDED') {
         await sleep(error.retryAfter * 1000);
         return fn();
       }
       throw error;
     }
   }
   ```

3. **Use batch operations**
   ```typescript
   // Instead of 100 creates
   await rb.memories.createBatch(items);  // 1 request
   ```

4. **Upgrade tier**
   - [Upgrade here](https://recallbricks.com/dashboard/billing)

---

## Search Issues

### No Results Found

**Problem:** Search returns empty array

**Solutions:**

1. **Check metadata filters**
   ```typescript
   // ❌ Too restrictive
   const results = await rb.memories.search({
     query: 'docs',
     metadata: { category: 'documentation', subcategory: 'api' }
   });

   // ✅ Broader filter
   const results = await rb.memories.search({
     query: 'docs',
     metadata: { category: 'documentation' }
   });
   ```

2. **Lower minScore threshold**
   ```typescript
   // ❌ Too high
   minScore: 0.95

   // ✅ More permissive
   minScore: 0.7
   ```

3. **Adjust weights**
   ```typescript
   // Try different weighting
   weights: { semantic: 0.9, recency: 0.1 }  // Favor semantic match
   ```

### Irrelevant Results

**Problem:** Search returns unrelated memories

**Solutions:**

1. **Add metadata filters**
   ```typescript
   await rb.memories.search({
     query: 'user preferences',
     metadata: { user_id: currentUser.id }  // Filter to specific user
   });
   ```

2. **Increase minScore**
   ```typescript
   minScore: 0.8  // Only high-quality matches
   ```

3. **Improve query**
   ```typescript
   // ❌ Vague
   query: 'settings'

   // ✅ Specific
   query: 'user notification email settings preferences'
   ```

---

## Performance Issues

### Slow Response Times

**Problem:** Requests taking >1 second

**Solutions:**

1. **Check system status**
   ```typescript
   const health = await rb.health();
   console.log(health.status);
   ```

2. **Implement caching**
   ```typescript
   const cache = new Map();

   async function getCached(id) {
     if (cache.has(id)) return cache.get(id);
     const memory = await rb.memories.get(id);
     cache.set(id, memory);
     return memory;
   }
   ```

3. **Use pagination**
   ```typescript
   // Don't fetch everything at once
   const { data } = await rb.memories.list({ limit: 20 });
   ```

4. **Check network**
   ```bash
   ping recallbricks-api-clean.onrender.com
   ```

---

## SDK Issues

### TypeScript Import Errors

**Problem:** Cannot find module 'recallbricks'

**Solutions:**

1. **Install package**
   ```bash
   npm install recallbricks
   ```

2. **Check tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true
     }
   }
   ```

3. **Restart TypeScript server**
   - VS Code: Cmd/Ctrl + Shift + P → "Restart TypeScript Server"

### Python Import Errors

**Problem:** ModuleNotFoundError: No module named 'recallbricks'

**Solutions:**

1. **Install package**
   ```bash
   pip install recallbricks
   ```

2. **Check Python environment**
   ```bash
   which python
   pip list | grep recallbricks
   ```

3. **Use virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install recallbricks
   ```

---

## Memory Issues

### "Memory Not Found" Error

**Problem:** `MEMORY_NOT_FOUND` when accessing memory

**Solutions:**

1. **Verify ID**
   ```typescript
   console.log(memoryId);  // Check format: mem_abc123
   ```

2. **Check if deleted**
   ```typescript
   const { data: allMemories } = await rb.memories.list();
   const exists = allMemories.find(m => m.id === memoryId);
   ```

3. **Verify namespace**
   ```typescript
   // If using namespaces, ensure correct one
   await rb.memories.get(id, { namespace: 'production' });
   ```

### Metadata Not Updating

**Problem:** `update()` doesn't change metadata

**Solutions:**

1. **Check merge behavior**
   ```typescript
   // update() merges metadata, doesn't replace
   await rb.memories.update(id, {
     metadata: { new_field: 'value' }  // Merges with existing
   });
   ```

2. **Verify response**
   ```typescript
   const updated = await rb.memories.update(id, { metadata: {...} });
   console.log(updated.metadata);  // Check if updated
   ```

---

## Prediction Issues

### Low Confidence Predictions

**Problem:** Predictions always have confidence <0.5

**Solutions:**

1. **Provide richer context**
   ```typescript
   // ❌ Minimal context
   context: 'user query'

   // ✅ Rich context
   context: `
     User query: "${query}"
     User ID: ${userId}
     Session context: ${sessionData}
     Previous queries: ${historyTopic}
   `
   ```

2. **Let system learn**
   - RecallBricks improves with usage
   - Provide feedback to help learning

3. **Check learning progress**
   ```typescript
   const metrics = await rb.metacognition.getMetrics();
   console.log(metrics.learningProgress.confidenceLevel);
   // If low (<0.5), system needs more data
   ```

---

## Network Issues

### Connection Timeouts

**Problem:** Requests timing out

**Solutions:**

1. **Increase timeout**
   ```typescript
   const rb = new RecallBricks({
     apiKey: process.env.RECALLBRICKS_API_KEY,
     timeout: 30000  // 30 seconds
   });
   ```

2. **Check firewall**
   - Ensure outbound HTTPS (port 443) is allowed

3. **Test connectivity**
   ```bash
   curl https://recallbricks-api-clean.onrender.com/health
   ```

### SSL/TLS Errors

**Problem:** SSL certificate errors

**Solutions:**

1. **Update Node.js/Python**
   - Node.js: v16+ recommended
   - Python: 3.8+ recommended

2. **Check system time**
   ```bash
   date  # Ensure correct
   ```

3. **Update certificates**
   ```bash
   # macOS
   brew install openssl

   # Ubuntu/Debian
   sudo apt-get update && sudo apt-get install ca-certificates
   ```

---

## Agent Issues

### Agent Reputation Not Updating

**Problem:** Agent reputation stuck at initial value

**Solutions:**

1. **Check contribution count**
   ```typescript
   const rep = await rb.collaboration.getReputation(agentId);
   console.log(rep.totalContributions);  // Need 50+ for stable score
   ```

2. **Verify memories are tagged**
   ```typescript
   await rb.memories.create({
     content: '...',
     metadata: { agentId: 'your-agent-id' }  // Must include agentId
   });
   ```

3. **Wait for update cycle**
   - Reputation recalculated daily
   - Check back after 24 hours

---

## Still Stuck?

If none of these solutions work:

1. **Check API Status**
   - [status.recallbricks.com](https://status.recallbricks.com)

2. **Review Logs**
   - Enable debug logging
   - Check for specific error codes

3. **Contact Support**
   - Email: support@recallbricks.com
   - Include: error message, code snippet, API key (last 4 chars only)
   - Response time: <24 hours

4. **Community**
   - [Discord](https://discord.gg/recallbricks)
   - [GitHub Issues](https://github.com/recallbricks/recallbricks/issues)

---

**[Next: FAQ →](faq.md)**
