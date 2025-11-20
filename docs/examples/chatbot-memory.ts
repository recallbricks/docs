/**
 * Chatbot Memory Example
 *
 * This example demonstrates:
 * - Building a stateful chatbot with RecallBricks
 * - Storing conversation history
 * - Retrieving relevant context
 * - Using predictive recall for smart responses
 * - Session management
 */

import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY!);

// Simulated user sessions
const userId = 'user_12345';
const sessionId = `session_${Date.now()}`;

async function main() {
  try {
    console.log('💬 RecallBricks Chatbot Memory Example\n');
    console.log(`User: ${userId}`);
    console.log(`Session: ${sessionId}\n`);

    // ============================================
    // Initialize: Store user preferences
    // ============================================
    console.log('=== Session Start ===\n');

    await rb.memories.createBatch([
      {
        content: 'User prefers concise responses',
        metadata: {
          user_id: userId,
          type: 'preference',
          category: 'communication_style'
        }
      },
      {
        content: 'User is a senior software engineer',
        metadata: {
          user_id: userId,
          type: 'profile',
          category: 'professional_info'
        }
      },
      {
        content: 'User timezone: PST (UTC-8)',
        metadata: {
          user_id: userId,
          type: 'profile',
          category: 'location'
        }
      }
    ]);

    console.log('✓ User preferences initialized\n');

    // ============================================
    // TURN 1: First message
    // ============================================
    console.log('--- Turn 1 ---\n');
    const turn1 = await handleMessage('What are the best practices for API design?', 1);
    console.log();

    // ============================================
    // TURN 2: Follow-up question
    // ============================================
    console.log('--- Turn 2 ---\n');
    const turn2 = await handleMessage('How about authentication specifically?', 2);
    console.log();

    // ============================================
    // TURN 3: Reference to earlier context
    // ============================================
    console.log('--- Turn 3 ---\n');
    const turn3 = await handleMessage('Can you give me a code example?', 3);
    console.log();

    // ============================================
    // Session End: Summarize conversation
    // ============================================
    console.log('=== Session End ===\n');

    const conversationMemories = await rb.memories.search({
      query: 'conversation',
      metadata: {
        user_id: userId,
        session_id: sessionId
      },
      weights: { semantic: 0.3, recency: 0.7 },
      limit: 10
    });

    console.log('Conversation Summary:');
    console.log(`  Total turns: 3`);
    console.log(`  Topics discussed: API design, authentication, code examples`);
    console.log(`  Memories stored: ${conversationMemories.length}\n`);

    // ============================================
    // New Session: Returning user
    // ============================================
    console.log('=== New Session (User Returns) ===\n');

    const newSessionId = `session_${Date.now() + 1000}`;

    console.log(`New Session: ${newSessionId}\n`);
    console.log('User: "Hey, I\'m back!"\n');

    // Use predictive recall to understand what user might need
    const prediction = await rb.metacognition.predict({
      context: `
        Returning user greeting.
        User ID: ${userId}
        Previous session: Discussed API design and authentication
        Session start
      `
    });

    console.log('AI Prediction for returning user:');
    console.log(`  Confidence: ${(prediction.confidence * 100).toFixed(1)}%\n`);

    console.log('Suggested Context:');
    prediction.suggestedMemories
      .filter(m => m.confidence > 0.8)
      .slice(0, 3)
      .forEach((mem, index) => {
        console.log(`  ${index + 1}. ${mem.content}`);
        console.log(`     Confidence: ${(mem.confidence * 100).toFixed(1)}%`);
      });

    console.log('\nBot Response:');
    console.log('  "Welcome back! Last time we discussed API design and authentication.');
    console.log('   Would you like to continue with code examples?"');
    console.log();

    // ============================================
    // Summary
    // ============================================
    console.log('✅ Chatbot Memory Example Completed!\n');
    console.log('Key features demonstrated:');
    console.log('  • Store conversation history automatically');
    console.log('  • Retrieve relevant context using semantic search');
    console.log('  • Use predictive recall for smart suggestions');
    console.log('  • Maintain user preferences across sessions');
    console.log('  • Track conversation flow with metadata');
    console.log('  • Welcome returning users with context awareness');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Handle a single chatbot turn
 */
async function handleMessage(userMessage: string, turnNumber: number): Promise<void> {
  console.log(`User: "${userMessage}"`);

  // 1. Use predictive recall to get relevant context
  const prediction = await rb.metacognition.predict({
    context: `
      User message: "${userMessage}"
      Turn: ${turnNumber}
      User ID: ${userId}
      Session ID: ${sessionId}
    `,
    limit: 3,
    minConfidence: 0.7
  });

  console.log('\nRelevant Context Retrieved:');
  prediction.suggestedMemories.forEach((mem, index) => {
    console.log(`  ${index + 1}. ${mem.content}`);
  });

  // 2. Generate response (simulated)
  const botResponse = generateResponse(userMessage, prediction.suggestedMemories);

  console.log(`\nBot: "${botResponse}"`);

  // 3. Store this exchange as memory
  await rb.memories.createBatch([
    {
      content: `User asked: "${userMessage}"`,
      metadata: {
        user_id: userId,
        session_id: sessionId,
        turn: turnNumber,
        type: 'user_message',
        timestamp: new Date().toISOString()
      }
    },
    {
      content: `Bot responded: "${botResponse}"`,
      metadata: {
        user_id: userId,
        session_id: sessionId,
        turn: turnNumber,
        type: 'bot_message',
        timestamp: new Date().toISOString()
      }
    }
  ]);

  console.log('\n✓ Conversation stored in memory');
}

/**
 * Simulate response generation
 */
function generateResponse(message: string, context: any[]): string {
  // In a real chatbot, this would use an LLM with the retrieved context
  if (message.toLowerCase().includes('api design')) {
    return 'Best practices for API design include: RESTful principles, versioning, clear documentation, consistent naming, and proper error handling.';
  } else if (message.toLowerCase().includes('authentication')) {
    return 'For authentication, I recommend using OAuth 2.0 or JWT tokens. Bearer tokens in the Authorization header are standard practice.';
  } else if (message.toLowerCase().includes('code example')) {
    return 'Here\'s a quick example: Authorization: Bearer your_token_here';
  } else {
    return 'I can help you with that! Let me provide some information based on your preferences for concise responses.';
  }
}

main();

/**
 * To run this example:
 *
 * 1. Install dependencies:
 *    npm install recallbricks dotenv
 *
 * 2. Set your API key:
 *    export RECALLBRICKS_API_KEY='rb_live_your_key_here'
 *
 * 3. Run the script:
 *    npx ts-node chatbot-memory.ts
 *
 * This demonstrates:
 *   - How to build a stateful chatbot
 *   - Automatic context retrieval
 *   - Cross-session memory
 *   - Personalized responses based on preferences
 *   - Smart predictions for returning users
 */
