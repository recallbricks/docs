/**
 * Basic CRUD Operations Example
 *
 * This example demonstrates:
 * - Creating memories
 * - Retrieving memories by ID
 * - Searching memories
 * - Updating memories
 * - Deleting memories
 */

import { RecallBricks } from 'recallbricks';

// Initialize client
const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY!);

async function main() {
  try {
    console.log('🧱 RecallBricks Basic CRUD Example\n');

    // ============================================
    // CREATE: Store new memories
    // ============================================
    console.log('1. Creating memories...');

    const memory1 = await rb.memories.create({
      content: 'User prefers dark mode interface',
      metadata: {
        category: 'user_preferences',
        importance: 'high',
        user_id: 'user_123'
      }
    });

    console.log(`✓ Created memory: ${memory1.id}`);

    const memory2 = await rb.memories.create({
      content: 'User timezone is PST (UTC-8)',
      metadata: {
        category: 'user_preferences',
        importance: 'medium',
        user_id: 'user_123'
      }
    });

    console.log(`✓ Created memory: ${memory2.id}`);

    const memory3 = await rb.memories.create({
      content: 'User last logged in from San Francisco',
      metadata: {
        category: 'user_activity',
        importance: 'low',
        user_id: 'user_123',
        location: 'San Francisco, CA'
      }
    });

    console.log(`✓ Created memory: ${memory3.id}\n`);

    // ============================================
    // READ: Retrieve specific memory by ID
    // ============================================
    console.log('2. Retrieving memory by ID...');

    const retrieved = await rb.memories.get(memory1.id);

    console.log(`✓ Retrieved: "${retrieved.content}"`);
    console.log(`  Category: ${retrieved.metadata.category}`);
    console.log(`  Created: ${retrieved.createdAt}\n`);

    // ============================================
    // SEARCH: Semantic search with weighting
    // ============================================
    console.log('3. Searching memories...');

    const searchResults = await rb.memories.search({
      query: 'user preferences and settings',
      limit: 5,
      weights: {
        semantic: 0.7,  // Prioritize semantic similarity
        recency: 0.3    // Consider recency
      },
      metadata: {
        user_id: 'user_123'  // Filter by user
      },
      minScore: 0.7  // Only high-quality matches
    });

    console.log(`✓ Found ${searchResults.length} results:`);
    searchResults.forEach((result, index) => {
      console.log(`  ${index + 1}. "${result.content}"`);
      console.log(`     Score: ${result.score.toFixed(3)} (semantic: ${result.semanticScore.toFixed(3)}, recency: ${result.recencyScore.toFixed(3)})`);
    });
    console.log();

    // ============================================
    // UPDATE: Modify existing memory
    // ============================================
    console.log('4. Updating memory...');

    const updated = await rb.memories.update(memory1.id, {
      content: 'User strongly prefers dark mode interface with high contrast',
      metadata: {
        importance: 'critical',  // Updated importance
        last_confirmed: new Date().toISOString()
      }
    });

    console.log(`✓ Updated memory: ${updated.id}`);
    console.log(`  New content: "${updated.content}"`);
    console.log(`  New importance: ${updated.metadata.importance}\n`);

    // ============================================
    // BATCH CREATE: Create multiple at once
    // ============================================
    console.log('5. Batch creating memories...');

    const batchMemories = await rb.memories.createBatch([
      {
        content: 'User prefers email notifications',
        metadata: { category: 'notifications', user_id: 'user_123' }
      },
      {
        content: 'User disabled SMS alerts',
        metadata: { category: 'notifications', user_id: 'user_123' }
      },
      {
        content: 'User subscribed to weekly digest',
        metadata: { category: 'notifications', user_id: 'user_123' }
      }
    ]);

    console.log(`✓ Created ${batchMemories.length} memories in batch\n`);

    // ============================================
    // LIST: Get all memories with pagination
    // ============================================
    console.log('6. Listing all memories...');

    const { data: allMemories, pagination } = await rb.memories.list({
      page: 1,
      limit: 10,
      sort: '-createdAt'  // Newest first
    });

    console.log(`✓ Total memories: ${pagination.total}`);
    console.log(`  Showing ${allMemories.length} of ${pagination.total}`);
    console.log(`  Page ${pagination.page} of ${pagination.totalPages}\n`);

    // ============================================
    // DELETE: Remove a memory
    // ============================================
    console.log('7. Deleting memory...');

    await rb.memories.delete(memory3.id);

    console.log(`✓ Deleted memory: ${memory3.id}\n`);

    // ============================================
    // VERIFY: Confirm deletion
    // ============================================
    console.log('8. Verifying deletion...');

    try {
      await rb.memories.get(memory3.id);
      console.log('✗ Memory still exists (unexpected)');
    } catch (error: any) {
      if (error.code === 'MEMORY_NOT_FOUND') {
        console.log('✓ Memory successfully deleted\n');
      } else {
        throw error;
      }
    }

    // ============================================
    // Summary
    // ============================================
    console.log('✅ Basic CRUD operations completed successfully!');
    console.log('\nKey takeaways:');
    console.log('  • Use create() for single memories, createBatch() for multiple');
    console.log('  • search() provides semantic search with customizable weighting');
    console.log('  • Metadata enables powerful filtering and organization');
    console.log('  • update() merges new data with existing metadata');
    console.log('  • All operations are async and return strongly-typed results');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    process.exit(1);
  }
}

// Run the example
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
 *    npx ts-node basic-crud.ts
 *
 * Expected output:
 *   - 6 memories created
 *   - 1 memory retrieved by ID
 *   - Search results with scores
 *   - 1 memory updated
 *   - 1 memory deleted and verified
 */
