# Monitoring API

Health checks, system metrics, and usage statistics.

---

## Health Check

Check API availability and status.

### Endpoint

```http
GET /health
```

### Request Example

**TypeScript:**
```typescript
const health = await rb.health();
console.log(health.status); // "healthy"
```

**Python:**
```python
health = rb.health()
print(health.status)  # "healthy"
```

**cURL:**
```bash
curl https://recallbricks-api-clean.onrender.com/health
```

### Response

```json
{
  "status": "healthy",
  "version": "1.2.0",
  "uptime": 8640000,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "services": {
    "api": "operational",
    "database": "operational",
    "vectorDB": "operational",
    "cache": "operational"
  }
}
```

### Status Codes

| Status | Description |
|--------|-------------|
| `healthy` | All systems operational |
| `degraded` | Some non-critical services down |
| `unhealthy` | Critical services unavailable |

---

## System Metrics

Get real-time system performance metrics.

### Endpoint

```http
GET /v1/metrics
```

### Request Example

**TypeScript:**
```typescript
const metrics = await rb.metrics.getSystem();

console.log(metrics.performance);
console.log(metrics.usage);
```

**Python:**
```python
metrics = rb.metrics.get_system()

print(metrics.performance)
print(metrics.usage)
```

### Response

```json
{
  "success": true,
  "data": {
    "performance": {
      "avgResponseTime": 180,
      "p50Latency": 145,
      "p95Latency": 320,
      "p99Latency": 450,
      "requestsPerSecond": 45,
      "errorRate": 0.002
    },
    "usage": {
      "totalMemories": 125430,
      "totalQueries": 847203,
      "storageUsed": "2.4 GB",
      "bandwidthUsed": "145 GB"
    },
    "sla": {
      "uptime": 0.999,
      "targetUptime": 0.999,
      "p95LatencyTarget": 500,
      "currentP95": 320,
      "status": "meeting_sla"
    }
  }
}
```

---

## Your Usage Statistics

Get your account's API usage statistics.

### Endpoint

```http
GET /v1/usage
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `timeRange` | string | No | `today`, `7d`, `30d`, `90d` (default: `30d`) |
| `breakdown` | boolean | No | Include daily breakdown (default: false) |

### Request Example

**TypeScript:**
```typescript
const usage = await rb.metrics.getUsage({
  timeRange: '30d',
  breakdown: true
});

console.log(usage.summary);
console.log(usage.dailyBreakdown);
```

**Python:**
```python
usage = rb.metrics.get_usage(time_range='30d', breakdown=True)

print(usage.summary)
print(usage.daily_breakdown)
```

### Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "apiCalls": 12430,
      "memoriesCreated": 847,
      "searchesPerformed": 5623,
      "predictionsRequested": 1240,
      "storageUsed": "145 MB",
      "bandwidthUsed": "2.3 GB"
    },
    "rateLimits": {
      "tier": "Tier 2",
      "requestsPerSecond": 50,
      "currentUsage": 12,
      "percentageUsed": 24
    },
    "billing": {
      "currentPeriodStart": "2025-01-01T00:00:00.000Z",
      "currentPeriodEnd": "2025-01-31T23:59:59.000Z",
      "estimatedCost": "$29.00",
      "status": "current"
    },
    "dailyBreakdown": [
      {
        "date": "2025-01-14",
        "apiCalls": 423,
        "memoriesCreated": 32,
        "searchesPerformed": 198
      },
      {
        "date": "2025-01-15",
        "apiCalls": 512,
        "memoriesCreated": 41,
        "searchesPerformed": 234
      }
    ]
  }
}
```

---

## Rate Limit Status

Check your current rate limit status.

### Endpoint

```http
GET /v1/rate-limit
```

### Request Example

**TypeScript:**
```typescript
const rateLimit = await rb.metrics.getRateLimit();

console.log(rateLimit.remaining);
console.log(rateLimit.resetAt);
```

**Python:**
```python
rate_limit = rb.metrics.get_rate_limit()

print(rate_limit.remaining)
print(rate_limit.reset_at)
```

### Response

```json
{
  "success": true,
  "data": {
    "tier": "Tier 2",
    "limit": 50,
    "remaining": 38,
    "resetAt": "2025-01-15T10:31:00.000Z",
    "resetIn": 45
  }
}
```

**Also available in response headers:**
```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 38
X-RateLimit-Reset: 1642248060
```

---

## Service Status

Get detailed status of all services.

### Endpoint

```http
GET /v1/status
```

### Request Example

**TypeScript:**
```typescript
const status = await rb.metrics.getServiceStatus();

console.log(status.services);
console.log(status.incidents);
```

**Python:**
```python
status = rb.metrics.get_service_status()

print(status.services)
print(status.incidents)
```

### Response

```json
{
  "success": true,
  "data": {
    "overall": "operational",
    "services": {
      "api": {
        "status": "operational",
        "latency": 145,
        "uptime": 0.999
      },
      "memories": {
        "status": "operational",
        "latency": 180,
        "uptime": 0.999
      },
      "metacognition": {
        "status": "operational",
        "latency": 220,
        "uptime": 0.998
      },
      "collaboration": {
        "status": "operational",
        "latency": 195,
        "uptime": 0.999
      }
    },
    "incidents": [],
    "upcomingMaintenance": []
  }
}
```

---

## Performance Metrics

Get detailed performance analytics.

### Endpoint

```http
GET /v1/metrics/performance
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `timeRange` | string | No | `1h`, `24h`, `7d`, `30d` (default: `24h`) |
| `granularity` | string | No | `minute`, `hour`, `day` (default: `hour`) |

### Request Example

**TypeScript:**
```typescript
const performance = await rb.metrics.getPerformance({
  timeRange: '24h',
  granularity: 'hour'
});

console.log(performance.latency);
console.log(performance.throughput);
```

**Python:**
```python
performance = rb.metrics.get_performance(
    time_range='24h',
    granularity='hour'
)
```

### Response

```json
{
  "success": true,
  "data": {
    "latency": {
      "avg": 180,
      "p50": 145,
      "p95": 320,
      "p99": 450,
      "max": 1240
    },
    "throughput": {
      "requestsPerSecond": 45,
      "requestsPerMinute": 2700,
      "peakRPS": 87
    },
    "errors": {
      "rate": 0.002,
      "total": 23,
      "byType": {
        "RATE_LIMIT_EXCEEDED": 12,
        "VALIDATION_ERROR": 8,
        "MEMORY_NOT_FOUND": 3
      }
    },
    "timeseries": [
      {
        "timestamp": "2025-01-15T09:00:00.000Z",
        "avgLatency": 175,
        "requests": 2543,
        "errors": 2
      },
      {
        "timestamp": "2025-01-15T10:00:00.000Z",
        "avgLatency": 185,
        "requests": 2712,
        "errors": 1
      }
    ]
  }
}
```

---

## Alerts & Notifications

Get active alerts and notifications.

### Endpoint

```http
GET /v1/alerts
```

### Request Example

**TypeScript:**
```typescript
const alerts = await rb.metrics.getAlerts();

console.log(alerts.active);
console.log(alerts.resolved);
```

**Python:**
```python
alerts = rb.metrics.get_alerts()

print(alerts.active)
print(alerts.resolved)
```

### Response

```json
{
  "success": true,
  "data": {
    "active": [
      {
        "id": "alert_123",
        "type": "APPROACHING_RATE_LIMIT",
        "severity": "warning",
        "message": "You're using 85% of your rate limit",
        "createdAt": "2025-01-15T10:25:00.000Z",
        "recommendations": [
          "Consider upgrading to Tier 3",
          "Implement request batching"
        ]
      }
    ],
    "resolved": [
      {
        "id": "alert_122",
        "type": "HIGH_ERROR_RATE",
        "severity": "warning",
        "message": "Error rate exceeded 1%",
        "createdAt": "2025-01-14T15:00:00.000Z",
        "resolvedAt": "2025-01-14T15:30:00.000Z"
      }
    ]
  }
}
```

---

## Use Cases

### 1. Health Check Monitoring

```typescript
// Periodic health check
setInterval(async () => {
  const health = await rb.health();

  if (health.status !== 'healthy') {
    console.error('RecallBricks API unhealthy:', health.services);
    // Alert ops team
  }
}, 60000); // Every minute
```

### 2. Usage Tracking

```typescript
// Monitor daily usage
const usage = await rb.metrics.getUsage({ timeRange: 'today' });

if (usage.summary.apiCalls > DAILY_THRESHOLD) {
  console.warn('High API usage today');
}

if (usage.rateLimits.percentageUsed > 80) {
  console.warn('Approaching rate limit');
}
```

### 3. Performance Monitoring

```typescript
// Track performance metrics
const metrics = await rb.metrics.getPerformance({ timeRange: '1h' });

if (metrics.latency.p95 > 500) {
  console.warn('High latency detected');
}

if (metrics.errors.rate > 0.01) {
  console.error('Error rate above 1%');
}
```

### 4. Rate Limit Management

```typescript
// Check before making requests
const rateLimit = await rb.metrics.getRateLimit();

if (rateLimit.remaining < 10) {
  console.warn('Low rate limit remaining, implementing backoff');
  await sleep(rateLimit.resetIn * 1000);
}
```

---

## Best Practices

### 1. Monitor Health Proactively

```typescript
// ✅ Good: Regular health checks
const health = await rb.health();

if (health.status === 'degraded') {
  // Switch to degraded mode, cache aggressively
}
```

### 2. Track Usage Trends

```typescript
// ✅ Good: Weekly usage review
const usage = await rb.metrics.getUsage({
  timeRange: '7d',
  breakdown: true
});

// Analyze trends
const trend = analyzeUsageTrend(usage.dailyBreakdown);
if (trend === 'increasing') {
  console.log('Consider upgrading tier');
}
```

### 3. Set Up Alerts

```typescript
// ✅ Good: Monitor alerts
const alerts = await rb.metrics.getAlerts();

alerts.active.forEach(alert => {
  if (alert.severity === 'critical') {
    // Immediate action
  } else if (alert.severity === 'warning') {
    // Review and plan
  }
});
```

---

## SLA Commitments

RecallBricks guarantees:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Uptime** | 99.9% | Monthly |
| **P95 Latency** | <500ms | Per-endpoint |
| **Error Rate** | <0.1% | Monthly |
| **Support Response** | <24h | Business days |

**SLA Credits:** If we fail to meet SLA, you'll receive automatic credits to your account.

---

## Status Page

Real-time status: **[status.recallbricks.com](https://status.recallbricks.com)**

Subscribe to updates:
- Email notifications
- Slack integration
- RSS feed

---

**[← Back to Collaboration API](collaboration.md)** | **[API Reference Home →](overview.md)**
