# Security

Keep your RecallBricks implementation secure.

---

## API Key Security

### 1. Never Hardcode Keys

```typescript
// ❌ NEVER DO THIS
const rb = new RecallBricks('rb_live_abc123xyz789');

// ✅ Always use environment variables
const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY);
```

### 2. Use .env Files (Never Commit Them)

**.env:**
```bash
RECALLBRICKS_API_KEY=rb_live_your_key_here
```

**.gitignore:**
```
.env
.env.local
.env.*.local
```

### 3. Backend Only

```typescript
// ✅ Server-side (Node.js/Python)
const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY);

// ❌ NEVER client-side (browser/React/Vue)
// API keys exposed in browser = security breach
```

### 4. Rotate Keys Regularly

- Production keys: Rotate every 90 days
- Test keys: Rotate every 180 days
- Compromised keys: Revoke immediately

**How to rotate:**
1. Create new key in dashboard
2. Update environment variables
3. Deploy changes
4. Delete old key after 24-48 hours

---

## Data Security

### 1. Sanitize Input

```typescript
import DOMPurify from 'dompurify';

// ✅ Good: Sanitize user input
const sanitized = DOMPurify.sanitize(userInput);
await rb.memories.create({ content: sanitized });

// ❌ Bad: Direct user input
await rb.memories.create({ content: userInput });
```

### 2. Don't Store Sensitive Data

```typescript
// ❌ Bad: PII and secrets
await rb.memories.create({
  content: 'User credit card: 4111-1111-1111-1111',
  metadata: { ssn: '123-45-6789', password: 'secret' }
});

// ✅ Good: References only
await rb.memories.create({
  content: 'User completed purchase',
  metadata: {
    user_id: 'user_123',  // Reference, not data
    payment_method_id: 'pm_abc',  // Tokenized
    amount_cents: 1999
  }
});
```

### 3. Encrypt Sensitive Metadata

```typescript
import crypto from 'crypto';

function encrypt(text: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

// ✅ Good: Encrypt sensitive data
await rb.memories.create({
  content: 'User preferences updated',
  metadata: {
    user_id: 'user_123',
    encrypted_prefs: encrypt(JSON.stringify(preferences), encryptionKey)
  }
});
```

---

## Access Control

### 1. Use Different Keys for Different Environments

```bash
# .env.development
RECALLBRICKS_API_KEY=rb_test_dev_key

# .env.production
RECALLBRICKS_API_KEY=rb_live_prod_key
```

### 2. Implement User-Level Isolation

```typescript
// ✅ Good: Filter by user
async function getUserMemories(userId: string) {
  return await rb.memories.search({
    query: 'preferences',
    metadata: { user_id: userId }  // Only this user's data
  });
}

// ❌ Bad: No user filtering
async function getAllMemories() {
  return await rb.memories.search({ query: 'preferences' });
  // Exposes all users' data
}
```

### 3. Validate Permissions

```typescript
// ✅ Good: Check authorization
async function deleteMemory(memoryId: string, requestingUserId: string) {
  const memory = await rb.memories.get(memoryId);

  if (memory.metadata.user_id !== requestingUserId) {
    throw new Error('Unauthorized');
  }

  await rb.memories.delete(memoryId);
}
```

---

## HTTPS Only

```typescript
const rb = new RecallBricks({
  apiKey: process.env.RECALLBRICKS_API_KEY,
  baseURL: 'https://recallbricks-api-clean.onrender.com'  // HTTPS enforced
});

// HTTP requests automatically upgraded to HTTPS
```

---

## Audit Logging

```typescript
// ✅ Good: Log all RecallBricks operations
async function auditedCreate(content: string, userId: string) {
  const memory = await rb.memories.create({
    content,
    metadata: { user_id: userId, created_by: userId }
  });

  logger.info('Memory created', {
    memoryId: memory.id,
    userId,
    timestamp: new Date().toISOString()
  });

  return memory;
}
```

---

## Security Checklist

- [ ] API keys in environment variables only
- [ ] `.env` files in `.gitignore`
- [ ] API keys never in frontend code
- [ ] User input sanitized
- [ ] No PII stored unencrypted
- [ ] User-level access control implemented
- [ ] HTTPS enforced
- [ ] Audit logging in place
- [ ] Key rotation schedule defined
- [ ] Security review completed

---

**[← Performance Optimization](performance-optimization.md)** | **[Next: Error Handling →](error-handling.md)**
