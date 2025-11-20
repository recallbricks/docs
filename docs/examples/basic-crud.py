"""
Basic CRUD Operations Example

This example demonstrates:
- Creating memories
- Retrieving memories by ID
- Searching memories
- Updating memories
- Deleting memories
"""

from recallbricks import RecallBricks
import os
from datetime import datetime

# Initialize client
rb = RecallBricks(os.getenv('RECALLBRICKS_API_KEY'))

def main():
    try:
        print('🧱 RecallBricks Basic CRUD Example\n')

        # ============================================
        # CREATE: Store new memories
        # ============================================
        print('1. Creating memories...')

        memory1 = rb.memories.create(
            content='User prefers dark mode interface',
            metadata={
                'category': 'user_preferences',
                'importance': 'high',
                'user_id': 'user_123'
            }
        )

        print(f'✓ Created memory: {memory1.id}')

        memory2 = rb.memories.create(
            content='User timezone is PST (UTC-8)',
            metadata={
                'category': 'user_preferences',
                'importance': 'medium',
                'user_id': 'user_123'
            }
        )

        print(f'✓ Created memory: {memory2.id}')

        memory3 = rb.memories.create(
            content='User last logged in from San Francisco',
            metadata={
                'category': 'user_activity',
                'importance': 'low',
                'user_id': 'user_123',
                'location': 'San Francisco, CA'
            }
        )

        print(f'✓ Created memory: {memory3.id}\n')

        # ============================================
        # READ: Retrieve specific memory by ID
        # ============================================
        print('2. Retrieving memory by ID...')

        retrieved = rb.memories.get(memory1.id)

        print(f'✓ Retrieved: "{retrieved.content}"')
        print(f'  Category: {retrieved.metadata["category"]}')
        print(f'  Created: {retrieved.created_at}\n')

        # ============================================
        # SEARCH: Semantic search with weighting
        # ============================================
        print('3. Searching memories...')

        search_results = rb.memories.search(
            query='user preferences and settings',
            limit=5,
            weights={
                'semantic': 0.7,  # Prioritize semantic similarity
                'recency': 0.3    # Consider recency
            },
            metadata={
                'user_id': 'user_123'  # Filter by user
            },
            min_score=0.7  # Only high-quality matches
        )

        print(f'✓ Found {len(search_results)} results:')
        for index, result in enumerate(search_results):
            print(f'  {index + 1}. "{result.content}"')
            print(f'     Score: {result.score:.3f} (semantic: {result.semantic_score:.3f}, recency: {result.recency_score:.3f})')
        print()

        # ============================================
        # UPDATE: Modify existing memory
        # ============================================
        print('4. Updating memory...')

        updated = rb.memories.update(
            memory1.id,
            content='User strongly prefers dark mode interface with high contrast',
            metadata={
                'importance': 'critical',  # Updated importance
                'last_confirmed': datetime.utcnow().isoformat()
            }
        )

        print(f'✓ Updated memory: {updated.id}')
        print(f'  New content: "{updated.content}"')
        print(f'  New importance: {updated.metadata["importance"]}\n')

        # ============================================
        # BATCH CREATE: Create multiple at once
        # ============================================
        print('5. Batch creating memories...')

        batch_memories = rb.memories.create_batch([
            {
                'content': 'User prefers email notifications',
                'metadata': {'category': 'notifications', 'user_id': 'user_123'}
            },
            {
                'content': 'User disabled SMS alerts',
                'metadata': {'category': 'notifications', 'user_id': 'user_123'}
            },
            {
                'content': 'User subscribed to weekly digest',
                'metadata': {'category': 'notifications', 'user_id': 'user_123'}
            }
        ])

        print(f'✓ Created {len(batch_memories)} memories in batch\n')

        # ============================================
        # LIST: Get all memories with pagination
        # ============================================
        print('6. Listing all memories...')

        result = rb.memories.list(
            page=1,
            limit=10,
            sort='-createdAt'  # Newest first
        )

        all_memories = result['data']
        pagination = result['pagination']

        print(f'✓ Total memories: {pagination["total"]}')
        print(f'  Showing {len(all_memories)} of {pagination["total"]}')
        print(f'  Page {pagination["page"]} of {pagination["totalPages"]}\n')

        # ============================================
        # DELETE: Remove a memory
        # ============================================
        print('7. Deleting memory...')

        rb.memories.delete(memory3.id)

        print(f'✓ Deleted memory: {memory3.id}\n')

        # ============================================
        # VERIFY: Confirm deletion
        # ============================================
        print('8. Verifying deletion...')

        try:
            rb.memories.get(memory3.id)
            print('✗ Memory still exists (unexpected)')
        except Exception as error:
            if hasattr(error, 'code') and error.code == 'MEMORY_NOT_FOUND':
                print('✓ Memory successfully deleted\n')
            else:
                raise error

        # ============================================
        # Summary
        # ============================================
        print('✅ Basic CRUD operations completed successfully!')
        print('\nKey takeaways:')
        print('  • Use create() for single memories, create_batch() for multiple')
        print('  • search() provides semantic search with customizable weighting')
        print('  • Metadata enables powerful filtering and organization')
        print('  • update() merges new data with existing metadata')
        print('  • All operations return structured objects with full type hints')

    except Exception as error:
        print(f'❌ Error: {str(error)}')
        if hasattr(error, 'code'):
            print(f'   Code: {error.code}')
        exit(1)

if __name__ == '__main__':
    main()

"""
To run this example:

1. Install dependencies:
   pip install recallbricks python-dotenv

2. Set your API key:
   export RECALLBRICKS_API_KEY='rb_live_your_key_here'

3. Run the script:
   python basic-crud.py

Expected output:
  - 6 memories created
  - 1 memory retrieved by ID
  - Search results with scores
  - 1 memory updated
  - 1 memory deleted and verified
"""
