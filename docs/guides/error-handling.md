# Error Handling

Gracefully handle errors in production.

---

## Error Types

RecallBricks errors include a `code` property for programmatic handling:

```typescript
try {
  const memory = await rb.memories.get('invalid_id');
} catch (error: any) {
  console.error(error.code);     // 'MEMORY_NOT_FOUND'
  console.error(error.message);  // Human-readable message
}
```

### Common Error Codes

| Code | HTTP | Description | Action |
|------|------|-------------|--------|
| `INVALID_API_KEY` | 401 | API key missing/invalid | Check key configuration |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Implement backoff, upgrade tier |
| `MEMORY_NOT_FOUND` | 404 | Memory ID doesn't exist | Handle as "not found" case |
| `VALIDATION_ERROR` | 400 | Invalid request data | Fix request parameters |
| `INSUFFICIENT_PERMISSIONS` | 403 | API key lacks permission | Update key permissions |
| `INTERNAL_ERROR` | 500 | Server error | Retry, contact support if persists |

---

## Basic Error Handling

```typescript
// ✅ Good: Specific error handling
try {
  const memory = await rb.memories.get(id);
  return memory;
} catch (error: any) {
  if (error.code === 'MEMORY_NOT_FOUND') {
    return null;  // Expected case
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    await sleep(1000);
    return retry();
  } else {
    logger.error('Unexpected error:', error);
    throw error;
  }
}
```

---

## Retry Logic

### Simple Retry

```typescript
async function retryOperation<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === maxRetries - 1) throw error;

      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        await sleep(1000 * (attempt + 1));  // Linear backoff
      } else {
        throw error;  // Don't retry non-retryable errors
      }
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const memory = await retryOperation(() =>
  rb.memories.get('mem_123')
);
```

### Exponential Backoff

```typescript
async function exponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === maxRetries - 1) throw error;

      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        const delay = baseDelay * Math.pow(2, attempt);  // 1s, 2s, 4s
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Graceful Degradation

```typescript
// ✅ Good: Fallback behavior
async function getRelevantContext(query: string) {
  try {
    // Try AI prediction first
    const prediction = await rb.metacognition.predict({ context: query });
    return prediction.suggestedMemories;
  } catch (error: any) {
    // Fall back to traditional search
    logger.warn('Prediction failed, using traditional search', error);
    return await rb.memories.search({ query });
  }
}
```

---

## Validation Errors

```typescript
// Handle validation errors
try {
  await rb.memories.create({
    content: '',  // Invalid: empty content
    metadata: {}
  });
} catch (error: any) {
  if (error.code === 'VALIDATION_ERROR') {
    console.error('Validation failed:', error.details);
    // error.details contains field-specific errors
  }
}
```

---

## Rate Limit Handling

### Use Retry-After Header

```typescript
async function handleRateLimit() {
  try {
    return await rb.memories.search({ query: 'docs' });
  } catch (error: any) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      const retryAfter = error.retryAfter || 60;  // Seconds
      console.log(`Rate limited. Retry after ${retryAfter}s`);
      await sleep(retryAfter * 1000);
      return handleRateLimit();  // Retry
    }
    throw error;
  }
}
```

---

## TypeScript Type Guards

```typescript
import { RecallBricksError } from 'recallbricks';

function isRecallBricksError(error: unknown): error is RecallBricksError {
  return error instanceof RecallBricksError;
}

try {
  await rb.memories.create({ content: 'test' });
} catch (error) {
  if (isRecallBricksError(error)) {
    // TypeScript knows error has .code property
    console.error(error.code, error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## Error Boundaries (React)

```typescript
import React from 'react';

class RecallBricksErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if ((error as any).code === 'RATE_LIMIT_EXCEEDED') {
      // Show rate limit message to user
    } else {
      // Log to error tracking service
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
```

---

## Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

async function createMemoryWithLogging(content: string) {
  try {
    logger.info('Creating memory', { content });
    const memory = await rb.memories.create({ content });
    logger.info('Memory created', { id: memory.id });
    return memory;
  } catch (error: any) {
    logger.error('Failed to create memory', {
      error: error.message,
      code: error.code,
      content
    });
    throw error;
  }
}
```

---

## Testing Error Scenarios

```typescript
// Test rate limit handling
it('handles rate limit errors', async () => {
  const mockCreate = jest.spyOn(rb.memories, 'create')
    .mockRejectedValueOnce({ code: 'RATE_LIMIT_EXCEEDED', retryAfter: 1 })
    .mockResolvedValueOnce({ id: 'mem_123', content: 'test' });

  const result = await retryOperation(() =>
    rb.memories.create({ content: 'test' })
  );

  expect(result.id).toBe('mem_123');
  expect(mockCreate).toHaveBeenCalledTimes(2);
});
```

---

## Best Practices

### 1. Don't Swallow Errors

```typescript
// ❌ Bad: Silent failure
try {
  await rb.memories.create({ content: 'test' });
} catch (error) {
  // Nothing - error lost!
}

// ✅ Good: Log and handle
try {
  await rb.memories.create({ content: 'test' });
} catch (error) {
  logger.error('Failed to create memory:', error);
  // Notify user or retry
  throw error;
}
```

### 2. Provide User Feedback

```typescript
// ✅ Good: Inform the user
try {
  await rb.memories.create({ content: userInput });
  toast.success('Saved successfully');
} catch (error: any) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    toast.error('Too many requests. Please wait a moment.');
  } else {
    toast.error('Failed to save. Please try again.');
  }
}
```

### 3. Monitor Errors

```typescript
// ✅ Good: Track error rates
import * as Sentry from '@sentry/node';

try {
  await rb.memories.create({ content: 'test' });
} catch (error) {
  Sentry.captureException(error, {
    tags: { service: 'recallbricks', operation: 'create' }
  });
  throw error;
}
```

---

## Error Handling Checklist

- [ ] All RecallBricks calls wrapped in try-catch
- [ ] Specific error codes handled appropriately
- [ ] Retry logic for transient failures
- [ ] Graceful degradation for feature failures
- [ ] User-friendly error messages
- [ ] Error logging to tracking service
- [ ] Rate limit handling implemented
- [ ] Validation errors handled
- [ ] Timeouts configured
- [ ] Error boundaries in UI (if applicable)

---

**[← Security](security.md)** | **[Next: Rate Limits →](rate-limits.md)**
