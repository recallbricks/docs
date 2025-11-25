# Authentication

Secure your RecallBricks API access with API keys.

---

## Getting Your API Key

### 1. Sign Up

Visit [recallbricks.com/dashboard](https://recallbricks.com/dashboard) and create an account.

### 2. Create API Key

1. Navigate to **API Keys** in the dashboard
2. Click **"Create New Key"**
3. Name your key (e.g., "Production", "Development")
4. Copy the key immediately—it's only shown once

### 3. Choose Your Tier

| Tier | Rate Limit | Price | Use Case |
|------|-----------|-------|----------|
| **Tier 1** | 10 req/sec | Free | Development, testing |
| **Tier 2** | 50 req/sec | $29/mo | Small apps, MVPs |
| **Tier 3** | 200 req/sec | $99/mo | Production apps |
| **Tier 4** | 1000 req/sec | $299/mo | High-traffic apps |
| **Tier 5** | Unlimited | Custom | Enterprise |

**Free tier is perfect for getting started.**

---

## Using Your API Key

### TypeScript/JavaScript

#### Option 1: Environment Variable (Recommended)

```typescript
import { RecallBricks } from 'recallbricks';

// Reads from RECALLBRICKS_API_KEY environment variable
const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });
```

Set the environment variable:

```bash
export RECALLBRICKS_API_KEY='rb_live_1234567890abcdef'
```

#### Option 2: Direct Instantiation

```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks({ apiKey: 'rb_live_1234567890abcdef' });
```

#### Option 3: Configuration Object

```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks({
  apiKey: 'rb_live_1234567890abcdef',
  baseURL: 'https://recallbricks-api-clean.onrender.com', // Optional
  timeout: 30000 // Optional: 30 second timeout
});
```

### Python

#### Option 1: Environment Variable (Recommended)

```python
import os
from recallbricks import RecallBricks

# Reads from RECALLBRICKS_API_KEY environment variable
rb = RecallBricks(api_key=os.getenv('RECALLBRICKS_API_KEY'))
```

Set the environment variable:

```bash
export RECALLBRICKS_API_KEY='rb_live_1234567890abcdef'
```

#### Option 2: Direct Instantiation

```python
from recallbricks import RecallBricks

rb = RecallBricks(api_key='rb_live_1234567890abcdef')
```

#### Option 3: Configuration Object

```python
from recallbricks import RecallBricks

rb = RecallBricks(
    api_key='rb_live_1234567890abcdef',
    base_url='https://recallbricks-api-clean.onrender.com',  # Optional
    timeout=30  # Optional: 30 second timeout
)
```

---

## API Key Format

RecallBricks API keys follow this format:

```
rb_{environment}_{random_string}
```

Examples:
- **Live:** `rb_live_a1b2c3d4e5f6g7h8i9j0`
- **Test:** `rb_test_z9y8x7w6v5u4t3s2r1q0`

**Test keys** are free and perfect for development. They have the same features but lower rate limits.

---

## Security Best Practices

### ✅ Do This

1. **Store keys in environment variables**

```typescript
// ✅ Good
const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });
```

2. **Use .env files (never commit them)**

```bash
# .env
RECALLBRICKS_API_KEY=rb_live_1234567890abcdef
```

```bash
# .gitignore
.env
.env.local
```

3. **Rotate keys regularly**

Dashboard → API Keys → Rotate Key

4. **Use different keys for different environments**

```bash
# .env.development
RECALLBRICKS_API_KEY=rb_test_abc123

# .env.production
RECALLBRICKS_API_KEY=rb_live_xyz789
```

5. **Set key permissions**

In the dashboard, restrict keys to specific operations:
- Read-only for analytics
- Write-only for data ingestion
- Full access for backend services

### ❌ Don't Do This

1. **Hardcode keys in source code**

```typescript
// ❌ Bad - Never do this!
const rb = new RecallBricks({ apiKey: 'rb_live_1234567890abcdef' });
```

2. **Expose keys in frontend code**

```typescript
// ❌ Bad - Keys should NEVER be in browser/client code
const rb = new RecallBricks({ apiKey: process.env.NEXT_PUBLIC_RECALLBRICKS_KEY });
```

RecallBricks keys should **only** be used in backend/server code.

3. **Commit keys to version control**

Always add `.env` to `.gitignore`.

4. **Share keys in public channels**

Use secure key management systems for team sharing.

---

## Testing Authentication

### Quick Test

#### TypeScript

```typescript
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });

try {
  // Test with a simple memory operation
  const memory = await rb.createMemory('Test authentication', { tags: ['test'] });
  console.log('✓ Authentication successful:', memory.id);
} catch (error) {
  console.error('✗ Authentication failed:', error.message);
}
```

#### Python

```python
import os
from recallbricks import RecallBricks

rb = RecallBricks(api_key=os.getenv('RECALLBRICKS_API_KEY'))

try:
    # Test with a simple memory operation
    memory = rb.save('Test authentication', tags=['test'])
    print(f'✓ Authentication successful: {memory["id"]}')
except Exception as e:
    print(f'✗ Authentication failed: {e}')
```

### Expected Response

```
✓ Authentication successful: mem_abc123xyz789
```

---

## Error Handling

### Common Authentication Errors

#### 401 Unauthorized

```json
{
  "error": "Invalid API key",
  "code": "INVALID_API_KEY"
}
```

**Fix:** Check that your key is correct and properly set.

#### 403 Forbidden

```json
{
  "error": "API key does not have permission for this operation",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

**Fix:** Update key permissions in the dashboard.

#### 429 Rate Limited

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

**Fix:** Upgrade your tier or implement exponential backoff.

### Graceful Error Handling

#### TypeScript

```typescript
import { RecallBricks, RecallBricksError } from 'recallbricks';

const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });

try {
  const memory = await rb.createMemory('Test memory');
} catch (error) {
  if (error instanceof RecallBricksError) {
    if (error.code === 'INVALID_API_KEY') {
      console.error('Check your API key configuration');
    } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.error('Rate limit hit. Retry after:', error.retryAfter);
    }
  }
  throw error;
}
```

#### Python

```python
import os
from recallbricks import RecallBricks, RecallBricksError

rb = RecallBricks(api_key=os.getenv('RECALLBRICKS_API_KEY'))

try:
    memory = rb.save('Test memory')
except RecallBricksError as e:
    if e.code == 'INVALID_API_KEY':
        print('Check your API key configuration')
    elif e.code == 'RATE_LIMIT_EXCEEDED':
        print(f'Rate limit hit. Retry after: {e.retry_after}')
    raise
```

---

## Key Management

### Rotating Keys

1. Create a new key in the dashboard
2. Update your environment variables
3. Deploy the change
4. Delete the old key after 24-48 hours

### Multiple Keys

Use different keys for different purposes:

```bash
# Backend service
RECALLBRICKS_API_KEY=rb_live_backend_abc123

# Analytics service (read-only)
RECALLBRICKS_ANALYTICS_KEY=rb_live_analytics_xyz789

# Data ingestion (write-only)
RECALLBRICKS_INGESTION_KEY=rb_live_ingest_def456
```

### Revoking Keys

If a key is compromised:

1. Go to Dashboard → API Keys
2. Click "Revoke" next to the compromised key
3. Create a new key immediately
4. Update your services

**Revoked keys stop working instantly.**

---

## Enterprise SSO

For enterprise customers, RecallBricks supports:
- SAML 2.0
- OAuth 2.0
- OpenID Connect

Contact enterprise@recallbricks.com for setup.

---

## Next Steps

- **[Quickstart](quickstart.md)** – Get running in 60 seconds
- **[API Reference](../api-reference/overview.md)** – Full API documentation
- **[Security Guide](../guides/security.md)** – Advanced security patterns

---

**Your API is now secure.** Build with confidence.
