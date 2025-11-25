# Installation

One command to get started. Choose your language.

---

## TypeScript / JavaScript

### npm

```bash
npm install recallbricks
```

### yarn

```bash
yarn add recallbricks
```

### pnpm

```bash
pnpm add recallbricks
```

### Version

Current stable: **v1.1.0**

---

## Python

### pip

```bash
pip install recallbricks
```

### Poetry

```bash
poetry add recallbricks
```

### Version

Current stable: **v1.1.1**

---

## Verify Installation

### TypeScript/JavaScript

```typescript
import { RecallBricks } from 'recallbricks';

console.log(RecallBricks.version); // "1.1.0"
```

### Python

```python
import recallbricks

print(recallbricks.__version__)  # "1.1.1"
```

---

## Requirements

### TypeScript/JavaScript
- **Node.js:** 16.x or higher
- **TypeScript:** 4.5+ (if using TypeScript)

### Python
- **Python:** 3.8 or higher
- **Dependencies:** Automatically installed with package
  - `requests >= 2.28.0`
  - `pydantic >= 2.0.0`

---

## Environment Setup

### 1. Get Your API Key

Visit the [RecallBricks Dashboard](https://recallbricks.com/dashboard) and copy your API key.

### 2. Set Environment Variable (Recommended)

#### macOS/Linux

```bash
export RECALLBRICKS_API_KEY='your-api-key-here'
```

Add to `~/.bashrc` or `~/.zshrc` for persistence:

```bash
echo "export RECALLBRICKS_API_KEY='your-api-key-here'" >> ~/.zshrc
source ~/.zshrc
```

#### Windows (PowerShell)

```powershell
$env:RECALLBRICKS_API_KEY='your-api-key-here'
```

For persistence:

```powershell
[System.Environment]::SetEnvironmentVariable('RECALLBRICKS_API_KEY', 'your-api-key-here', 'User')
```

#### Windows (Command Prompt)

```cmd
set RECALLBRICKS_API_KEY=your-api-key-here
```

### 3. Use in Code

#### TypeScript/JavaScript

```typescript
import { RecallBricks } from 'recallbricks';

// Pass API key explicitly
const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });

// Or with hardcoded key (not recommended)
const rb = new RecallBricks({ apiKey: 'your-api-key-here' });
```

#### Python

```python
import os
from recallbricks import RecallBricks

# Pass API key explicitly
rb = RecallBricks(api_key=os.getenv('RECALLBRICKS_API_KEY'))

# Or with hardcoded key (not recommended)
rb = RecallBricks(api_key='your-api-key-here')
```

---

## Using .env Files

### TypeScript/JavaScript

Install dotenv:

```bash
npm install dotenv
```

Create `.env`:

```bash
RECALLBRICKS_API_KEY=your-api-key-here
```

Load in your app:

```typescript
import 'dotenv/config';
import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY }); // Reads from .env
```

### Python

Install python-dotenv:

```bash
pip install python-dotenv
```

Create `.env`:

```bash
RECALLBRICKS_API_KEY=your-api-key-here
```

Load in your app:

```python
import os
from dotenv import load_dotenv
from recallbricks import RecallBricks

load_dotenv()
rb = RecallBricks(api_key=os.getenv('RECALLBRICKS_API_KEY'))  # Reads from .env
```

---

## Framework Integration

### Next.js (TypeScript)

```typescript
// lib/recallbricks.ts
import { RecallBricks } from 'recallbricks';

export const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });
```

```typescript
// app/api/memories/route.ts
import { rb } from '@/lib/recallbricks';

export async function POST(req: Request) {
  const { content, tags } = await req.json();
  const memory = await rb.createMemory(content, { tags });
  return Response.json(memory);
}
```

### FastAPI (Python)

```python
# main.py
from fastapi import FastAPI
from recallbricks import RecallBricks
import os

app = FastAPI()
rb = RecallBricks(api_key=os.getenv('RECALLBRICKS_API_KEY'))

@app.post('/memories')
async def create_memory(content: str, tags: list):
    memory = rb.save(content, tags=tags)
    return memory
```

### Express.js (TypeScript)

```typescript
// server.ts
import express from 'express';
import { RecallBricks } from 'recallbricks';

const app = express();
const rb = new RecallBricks({ apiKey: process.env.RECALLBRICKS_API_KEY });

app.post('/memories', async (req, res) => {
  const { content, tags } = req.body;
  const memory = await rb.createMemory(content, { tags });
  res.json(memory);
});
```

### Django (Python)

```python
# settings.py
RECALLBRICKS_API_KEY = os.getenv('RECALLBRICKS_API_KEY')

# views.py
from django.http import JsonResponse
from recallbricks import RecallBricks
from django.conf import settings
import json

rb = RecallBricks(api_key=settings.RECALLBRICKS_API_KEY)

def create_memory(request):
    data = json.loads(request.body)
    memory = rb.save(
        data['content'],
        tags=data.get('tags', [])
    )
    return JsonResponse(memory)
```

---

## Troubleshooting

### "ModuleNotFoundError" or "Cannot find module"

Make sure you installed in the correct environment:

```bash
# Check Python environment
which python
pip list | grep recallbricks

# Check Node environment
which node
npm list recallbricks
```

### "Invalid API Key"

Verify your key is set correctly:

```bash
# macOS/Linux
echo $RECALLBRICKS_API_KEY

# Windows PowerShell
echo $env:RECALLBRICKS_API_KEY
```

### TypeScript Types Not Found

Install type definitions:

```bash
npm install -D @types/node
```

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

---

## Next Steps

- **[Authentication Guide](authentication.md)** – API key setup & security
- **[Quickstart](quickstart.md)** – Get running in 60 seconds
- **[API Reference](../api-reference/overview.md)** – Full SDK documentation

---

**Installation complete.** Ready to build cognitive infrastructure.
