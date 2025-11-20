"""
Chatbot Memory Example

This example demonstrates:
- Building a stateful chatbot with RecallBricks
- Storing conversation history
- Retrieving relevant context
- Using predictive recall for smart responses
- Session management
"""

from recallbricks import RecallBricks
import os
from datetime import datetime
import time

rb = RecallBricks(os.getenv('RECALLBRICKS_API_KEY'))

# Simulated user sessions
user_id = 'user_12345'
session_id = f'session_{int(time.time())}'

def main():
    try:
        print('💬 RecallBricks Chatbot Memory Example\n')
        print(f'User: {user_id}')
        print(f'Session: {session_id}\n')

        # ============================================
        # Initialize: Store user preferences
        # ============================================
        print('=== Session Start ===\n')

        rb.memories.create_batch([
            {
                'content': 'User prefers concise responses',
                'metadata': {
                    'user_id': user_id,
                    'type': 'preference',
                    'category': 'communication_style'
                }
            },
            {
                'content': 'User is a senior software engineer',
                'metadata': {
                    'user_id': user_id,
                    'type': 'profile',
                    'category': 'professional_info'
                }
            },
            {
                'content': 'User timezone: PST (UTC-8)',
                'metadata': {
                    'user_id': user_id,
                    'type': 'profile',
                    'category': 'location'
                }
            }
        ])

        print('✓ User preferences initialized\n')

        # ============================================
        # TURN 1: First message
        # ============================================
        print('--- Turn 1 ---\n')
        handle_message('What are the best practices for API design?', 1)
        print()

        # ============================================
        # TURN 2: Follow-up question
        # ============================================
        print('--- Turn 2 ---\n')
        handle_message('How about authentication specifically?', 2)
        print()

        # ============================================
        # TURN 3: Reference to earlier context
        # ============================================
        print('--- Turn 3 ---\n')
        handle_message('Can you give me a code example?', 3)
        print()

        # ============================================
        # Session End: Summarize conversation
        # ============================================
        print('=== Session End ===\n')

        conversation_memories = rb.memories.search(
            query='conversation',
            metadata={
                'user_id': user_id,
                'session_id': session_id
            },
            weights={'semantic': 0.3, 'recency': 0.7},
            limit=10
        )

        print('Conversation Summary:')
        print(f'  Total turns: 3')
        print(f'  Topics discussed: API design, authentication, code examples')
        print(f'  Memories stored: {len(conversation_memories)}\n')

        # ============================================
        # New Session: Returning user
        # ============================================
        print('=== New Session (User Returns) ===\n')

        new_session_id = f'session_{int(time.time()) + 1000}'

        print(f'New Session: {new_session_id}\n')
        print('User: "Hey, I\'m back!"\n')

        # Use predictive recall to understand what user might need
        prediction = rb.metacognition.predict(
            context=f"""
                Returning user greeting.
                User ID: {user_id}
                Previous session: Discussed API design and authentication
                Session start
            """
        )

        print('AI Prediction for returning user:')
        print(f'  Confidence: {prediction.confidence * 100:.1f}%\n')

        print('Suggested Context:')
        high_confidence_suggestions = [
            m for m in prediction.suggested_memories
            if m.confidence > 0.8
        ][:3]

        for index, mem in enumerate(high_confidence_suggestions):
            print(f'  {index + 1}. {mem.content}')
            print(f'     Confidence: {mem.confidence * 100:.1f}%')

        print('\nBot Response:')
        print('  "Welcome back! Last time we discussed API design and authentication.')
        print('   Would you like to continue with code examples?"')
        print()

        # ============================================
        # Summary
        # ============================================
        print('✅ Chatbot Memory Example Completed!\n')
        print('Key features demonstrated:')
        print('  • Store conversation history automatically')
        print('  • Retrieve relevant context using semantic search')
        print('  • Use predictive recall for smart suggestions')
        print('  • Maintain user preferences across sessions')
        print('  • Track conversation flow with metadata')
        print('  • Welcome returning users with context awareness')

    except Exception as error:
        print(f'❌ Error: {str(error)}')
        exit(1)

def handle_message(user_message, turn_number):
    """Handle a single chatbot turn"""
    print(f'User: "{user_message}"')

    # 1. Use predictive recall to get relevant context
    prediction = rb.metacognition.predict(
        context=f"""
            User message: "{user_message}"
            Turn: {turn_number}
            User ID: {user_id}
            Session ID: {session_id}
        """,
        limit=3,
        min_confidence=0.7
    )

    print('\nRelevant Context Retrieved:')
    for index, mem in enumerate(prediction.suggested_memories):
        print(f'  {index + 1}. {mem.content}')

    # 2. Generate response (simulated)
    bot_response = generate_response(user_message, prediction.suggested_memories)

    print(f'\nBot: "{bot_response}"')

    # 3. Store this exchange as memory
    rb.memories.create_batch([
        {
            'content': f'User asked: "{user_message}"',
            'metadata': {
                'user_id': user_id,
                'session_id': session_id,
                'turn': turn_number,
                'type': 'user_message',
                'timestamp': datetime.utcnow().isoformat()
            }
        },
        {
            'content': f'Bot responded: "{bot_response}"',
            'metadata': {
                'user_id': user_id,
                'session_id': session_id,
                'turn': turn_number,
                'type': 'bot_message',
                'timestamp': datetime.utcnow().isoformat()
            }
        }
    ])

    print('\n✓ Conversation stored in memory')

def generate_response(message, context):
    """Simulate response generation"""
    # In a real chatbot, this would use an LLM with the retrieved context
    message_lower = message.lower()

    if 'api design' in message_lower:
        return 'Best practices for API design include: RESTful principles, versioning, clear documentation, consistent naming, and proper error handling.'
    elif 'authentication' in message_lower:
        return 'For authentication, I recommend using OAuth 2.0 or JWT tokens. Bearer tokens in the Authorization header are standard practice.'
    elif 'code example' in message_lower:
        return 'Here\'s a quick example: Authorization: Bearer your_token_here'
    else:
        return 'I can help you with that! Let me provide some information based on your preferences for concise responses.'

if __name__ == '__main__':
    main()

"""
To run this example:

1. Install dependencies:
   pip install recallbricks python-dotenv

2. Set your API key:
   export RECALLBRICKS_API_KEY='rb_live_your_key_here'

3. Run the script:
   python chatbot-memory.py

This demonstrates:
  - How to build a stateful chatbot
  - Automatic context retrieval
  - Cross-session memory
  - Personalized responses based on preferences
  - Smart predictions for returning users
"""
