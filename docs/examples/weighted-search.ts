/**
 * Weighted Search Example
 *
 * This example demonstrates:
 * - Semantic vs recency weighting
 * - When to use different strategies
 * - Comparing search results
 * - Optimal weight selection
 */

import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY!);

async function main() {
  try {
    console.log('⚖️  RecallBricks Weighted Search Example\n');

    // ============================================
    // Setup: Create memories with different ages
    // ============================================
    console.log('Setting up test memories...\n');

    const oldMemory = await rb.memories.create({
      content: 'Comprehensive guide to API authentication with detailed examples and security best practices',
      metadata: { category: 'documentation', type: 'comprehensive' }
    });

    // Wait a bit to create age difference
    await sleep(2000);

    const recentMemory = await rb.memories.create({
      content: 'Quick tip: Use Bearer tokens for API auth',
      metadata: { category: 'documentation', type: 'quick_tip' }
    });

    console.log('✓ Created old (comprehensive) and recent (quick tip) memories\n');

    // ============================================
    // STRATEGY 1: Semantic-Heavy (Theory/Docs)
    // ============================================
    console.log('1. Semantic-Heavy Search (Best for: Documentation, Research)\n');

    const semanticResults = await rb.memories.search({
      query: 'API authentication guide',
      weights: {
        semantic: 0.9,  // 90% semantic similarity
        recency: 0.1    // 10% recency
      },
      limit: 5
    });

    console.log('Results (prioritizing semantic match):');
    semanticResults.forEach((result, index) => {
      console.log(`  ${index + 1}. "${result.content.substring(0, 60)}..."`);
      console.log(`     Total Score: ${result.score.toFixed(3)}`);
      console.log(`     Semantic: ${result.semanticScore.toFixed(3)}, Recency: ${result.recencyScore.toFixed(3)}\n`);
    });

    // ============================================
    // STRATEGY 2: Recency-Heavy (News/Activity)
    // ============================================
    console.log('2. Recency-Heavy Search (Best for: News, Activity, Trends)\n');

    const recencyResults = await rb.memories.search({
      query: 'API authentication',
      weights: {
        semantic: 0.2,  // 20% semantic similarity
        recency: 0.8    // 80% recency
      },
      limit: 5
    });

    console.log('Results (prioritizing recent):');
    recencyResults.forEach((result, index) => {
      console.log(`  ${index + 1}. "${result.content.substring(0, 60)}..."`);
      console.log(`     Total Score: ${result.score.toFixed(3)}`);
      console.log(`     Semantic: ${result.semanticScore.toFixed(3)}, Recency: ${result.recencyScore.toFixed(3)}\n`);
    });

    // ============================================
    // STRATEGY 3: Balanced (General Purpose)
    // ============================================
    console.log('3. Balanced Search (Best for: General queries)\n');

    const balancedResults = await rb.memories.search({
      query: 'API authentication',
      weights: {
        semantic: 0.5,  // 50% semantic
        recency: 0.5    // 50% recency
      },
      limit: 5
    });

    console.log('Results (balanced approach):');
    balancedResults.forEach((result, index) => {
      console.log(`  ${index + 1}. "${result.content.substring(0, 60)}..."`);
      console.log(`     Total Score: ${result.score.toFixed(3)}`);
      console.log(`     Semantic: ${result.semanticScore.toFixed(3)}, Recency: ${result.recencyScore.toFixed(3)}\n`);
    });

    // ============================================
    // STRATEGY 4: Use AI-learned optimal weights
    // ============================================
    console.log('4. AI-Optimized Weights\n');

    const patterns = await rb.metacognition.getPatterns();
    const optimalWeights = patterns.queryPatterns.optimalWeights;

    console.log('AI-Learned Optimal Weights:');
    console.log(`  Semantic: ${optimalWeights.semantic}`);
    console.log(`  Recency: ${optimalWeights.recency}\n`);

    const aiOptimizedResults = await rb.memories.search({
      query: 'API authentication',
      weights: optimalWeights,
      limit: 5
    });

    console.log('Results (using AI-learned weights):');
    aiOptimizedResults.forEach((result, index) => {
      console.log(`  ${index + 1}. "${result.content.substring(0, 60)}..."`);
      console.log(`     Score: ${result.score.toFixed(3)}\n`);
    });

    // ============================================
    // USE CASE 1: News Feed
    // ============================================
    console.log('5. Real-World Use Case: News Feed\n');

    await rb.memories.createBatch([
      {
        content: 'Breaking: AI model GPT-5 announced today',
        metadata: { category: 'news', type: 'breaking' }
      },
      {
        content: 'Historical overview of AI development from 1950s to today',
        metadata: { category: 'news', type: 'evergreen' }
      }
    ]);

    const newsResults = await rb.memories.search({
      query: 'AI news',
      weights: { semantic: 0.3, recency: 0.7 },  // Heavily favor recent
      metadata: { category: 'news' }
    });

    console.log('News Feed (recent news first):');
    newsResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.content}`);
    });
    console.log();

    // ============================================
    // USE CASE 2: Documentation Search
    // ============================================
    console.log('6. Real-World Use Case: Documentation Search\n');

    await rb.memories.createBatch([
      {
        content: 'API Rate Limits: Detailed explanation of all tiers',
        metadata: { category: 'docs', type: 'comprehensive' }
      },
      {
        content: 'Rate limit update: Tier 3 now 200 req/sec (updated yesterday)',
        metadata: { category: 'docs', type: 'update' }
      }
    ]);

    const docsResults = await rb.memories.search({
      query: 'rate limits',
      weights: { semantic: 0.85, recency: 0.15 },  // Favor comprehensive docs
      metadata: { category: 'docs' }
    });

    console.log('Documentation (comprehensive first):');
    docsResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.content}`);
    });
    console.log();

    // ============================================
    // USE CASE 3: User Activity Tracking
    // ============================================
    console.log('7. Real-World Use Case: User Activity\n');

    await rb.memories.createBatch([
      {
        content: 'User viewed pricing page',
        metadata: { category: 'activity', user_id: 'user_123' }
      },
      {
        content: 'User signed up 3 months ago',
        metadata: { category: 'activity', user_id: 'user_123' }
      }
    ]);

    const activityResults = await rb.memories.search({
      query: 'user activity',
      weights: { semantic: 0.2, recency: 0.8 },  // Recent activity matters most
      metadata: { user_id: 'user_123' }
    });

    console.log('User Activity (recent first):');
    activityResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.content}`);
    });
    console.log();

    // ============================================
    // COMPARISON: All strategies side-by-side
    // ============================================
    console.log('8. Strategy Comparison\n');

    const query = 'authentication guide';

    const strategies = [
      { name: 'Semantic-Heavy', weights: { semantic: 0.9, recency: 0.1 } },
      { name: 'Balanced', weights: { semantic: 0.5, recency: 0.5 } },
      { name: 'Recency-Heavy', weights: { semantic: 0.1, recency: 0.9 } }
    ];

    for (const strategy of strategies) {
      const results = await rb.memories.search({
        query,
        weights: strategy.weights,
        limit: 1
      });

      console.log(`${strategy.name}:`);
      console.log(`  Weights: Semantic ${strategy.weights.semantic}, Recency ${strategy.weights.recency}`);
      console.log(`  Top Result: "${results[0]?.content.substring(0, 50)}..."`);
      console.log(`  Score: ${results[0]?.score.toFixed(3)}\n`);
    }

    // ============================================
    // Summary
    // ============================================
    console.log('✅ Weighted Search Example Completed!\n');
    console.log('Key takeaways:');
    console.log('  • Semantic-heavy (0.9/0.1): Best for docs, research, theory');
    console.log('  • Recency-heavy (0.1/0.9): Best for news, activity, trends');
    console.log('  • Balanced (0.5/0.5): Good default for general queries');
    console.log('  • AI-optimized: Let RecallBricks learn optimal weights');
    console.log('  • Different use cases need different strategies');
    console.log('  • Weights dramatically affect which results rank highest');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
 *    npx ts-node weighted-search.ts
 *
 * When to use each strategy:
 *   - Semantic-heavy: Documentation, research, evergreen content
 *   - Recency-heavy: News, user activity, real-time data
 *   - Balanced: General purpose, mixed content
 *   - AI-optimized: Trust the system to learn what works
 */
