/**
 * Predictive Recall Example
 *
 * This example demonstrates metacognition Phase 2A:
 * - AI predicts what memories you'll need
 * - Confidence-based filtering
 * - Learning from usage patterns
 * - Optimal strategy suggestions
 */

import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY!);

async function main() {
  try {
    console.log('🧠 RecallBricks Predictive Recall Example\n');

    // ============================================
    // Setup: Create sample memories
    // ============================================
    console.log('Setting up sample memories...\n');

    await rb.memories.createBatch([
      {
        content: 'User prefers concise documentation with code examples',
        metadata: { category: 'preferences', type: 'documentation' }
      },
      {
        content: 'User dislikes verbose explanations',
        metadata: { category: 'preferences', type: 'communication' }
      },
      {
        content: 'API authentication uses Bearer tokens',
        metadata: { category: 'api_docs', type: 'authentication' }
      },
      {
        content: 'Rate limits: Tier 1 = 10 req/sec, Tier 2 = 50 req/sec',
        metadata: { category: 'api_docs', type: 'limits' }
      },
      {
        content: 'User last asked about Python SDK installation',
        metadata: { category: 'activity', type: 'recent_query' }
      }
    ]);

    // ============================================
    // PREDICTION 1: Simple context
    // ============================================
    console.log('1. Basic Prediction\n');

    const prediction1 = await rb.metacognition.predict({
      context: 'User asking about API documentation style preferences'
    });

    console.log('Prediction:');
    console.log(`  Overall Confidence: ${(prediction1.confidence * 100).toFixed(1)}%`);
    console.log(`  Reasoning: ${prediction1.reasoning}\n`);

    console.log('Suggested Memories:');
    prediction1.suggestedMemories.forEach((memory, index) => {
      console.log(`  ${index + 1}. "${memory.content}"`);
      console.log(`     Confidence: ${(memory.confidence * 100).toFixed(1)}%`);
      console.log(`     Reasoning: ${memory.reasoning}\n`);
    });

    // ============================================
    // PREDICTION 2: With confidence filtering
    // ============================================
    console.log('2. High-Confidence Predictions Only\n');

    const prediction2 = await rb.metacognition.predict({
      context: 'User needs information about API authentication',
      minConfidence: 0.85,  // Only very confident predictions
      limit: 3
    });

    console.log(`Found ${prediction2.suggestedMemories.length} high-confidence suggestions:`);
    prediction2.suggestedMemories.forEach((memory, index) => {
      console.log(`  ${index + 1}. "${memory.content}"`);
      console.log(`     Confidence: ${(memory.confidence * 100).toFixed(1)}%\n`);
    });

    // ============================================
    // PREDICTION 3: Rich contextual prediction
    // ============================================
    console.log('3. Rich Context Prediction\n');

    const richContext = `
      User: "How do I get started with the Python SDK?"
      Session: New (first interaction)
      User Tier: Premium
      Previous Activity: Asked about installation 5 minutes ago
    `;

    const prediction3 = await rb.metacognition.predict({
      context: richContext,
      includeStrategy: true
    });

    console.log('AI-Suggested Search Strategy:');
    console.log(`  Semantic Weight: ${prediction3.suggestedStrategy.weights.semantic}`);
    console.log(`  Recency Weight: ${prediction3.suggestedStrategy.weights.recency}`);
    console.log(`  Suggested Limit: ${prediction3.suggestedStrategy.limit}`);
    if (prediction3.suggestedStrategy.filters) {
      console.log(`  Filters: ${JSON.stringify(prediction3.suggestedStrategy.filters)}`);
    }
    console.log();

    // ============================================
    // PREDICTION 4: Using predictions in search
    // ============================================
    console.log('4. Applying Predicted Strategy\n');

    // Get prediction
    const prediction = await rb.metacognition.predict({
      context: 'User wants Python SDK documentation'
    });

    // Apply the suggested strategy to actual search
    const results = await rb.memories.search({
      query: 'Python SDK',
      weights: prediction.suggestedStrategy.weights,
      limit: prediction.suggestedStrategy.limit
    });

    console.log('Search Results (using AI-suggested strategy):');
    results.forEach((result, index) => {
      console.log(`  ${index + 1}. "${result.content}"`);
      console.log(`     Score: ${result.score.toFixed(3)}\n`);
    });

    // ============================================
    // PREDICTION 5: Hybrid approach
    // ============================================
    console.log('5. Hybrid: Predictions + Traditional Search\n');

    const hybridPrediction = await rb.metacognition.predict({
      context: 'User asking about rate limits'
    });

    // Use high-confidence predictions
    const highConfidence = hybridPrediction.suggestedMemories.filter(
      m => m.confidence > 0.9
    );

    console.log(`High-confidence predictions (>${90}%): ${highConfidence.length}`);

    if (highConfidence.length > 0) {
      console.log('Using predicted memories directly:');
      highConfidence.forEach((mem, i) => {
        console.log(`  ${i + 1}. ${mem.content}`);
      });
    } else {
      console.log('No high-confidence predictions, falling back to search...');
      const fallbackResults = await rb.memories.search({
        query: 'rate limits',
        limit: 3
      });
      console.log(`Found ${fallbackResults.length} results via search.`);
    }
    console.log();

    // ============================================
    // LEARNING: Get usage patterns
    // ============================================
    console.log('6. Learning Patterns\n');

    const patterns = await rb.metacognition.getPatterns();

    console.log('System Learning:');
    console.log(`  Most Queried Topics: ${patterns.queryPatterns.mostQueried.join(', ')}`);
    console.log(`  Optimal Weights: semantic=${patterns.queryPatterns.optimalWeights.semantic}, recency=${patterns.queryPatterns.optimalWeights.recency}`);
    console.log(`  Avg Retrieval Time: ${patterns.queryPatterns.avgRetrievalTime}ms`);
    console.log(`  Cache Hit Rate: ${(patterns.performanceMetrics.cacheHitRate * 100).toFixed(1)}%\n`);

    // ============================================
    // FEEDBACK: Help the system learn
    // ============================================
    console.log('7. Providing Feedback\n');

    await rb.metacognition.feedback({
      predictionId: prediction1.id,
      useful: true,
      usedMemories: [prediction1.suggestedMemories[0].id]
    });

    console.log('✓ Feedback submitted');
    console.log('  This helps RecallBricks improve future predictions!\n');

    // ============================================
    // METRICS: Learning progress
    // ============================================
    console.log('8. Metacognitive Metrics\n');

    const metrics = await rb.metacognition.getMetrics();

    console.log('Learning Progress:');
    console.log(`  Total Observations: ${metrics.learningProgress.totalObservations}`);
    console.log(`  Patterns Detected: ${metrics.learningProgress.patternsDetected}`);
    console.log(`  Confidence Level: ${(metrics.learningProgress.confidenceLevel * 100).toFixed(1)}%`);
    console.log();

    console.log('Optimization Gains:');
    console.log(`  Speed: ${metrics.optimizationGains.speedImprovement}`);
    console.log(`  Accuracy: ${metrics.optimizationGains.accuracyImprovement}`);
    console.log(`  Cache Efficiency: ${metrics.optimizationGains.cacheEfficiency}\n`);

    // ============================================
    // Summary
    // ============================================
    console.log('✅ Predictive Recall Example Completed!\n');
    console.log('Key takeaways:');
    console.log('  • Predictions save you from manually crafting queries');
    console.log('  • Confidence scores let you decide when to trust predictions');
    console.log('  • Rich context = better predictions');
    console.log('  • Suggested strategies optimize your searches automatically');
    console.log('  • Feedback makes the system smarter over time');
    console.log('  • The system learns and improves continuously');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    process.exit(1);
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
 *    npx ts-node predictive-recall.ts
 *
 * Expected behavior:
 *   - AI predicts relevant memories from context
 *   - Confidence scores guide usage decisions
 *   - Suggested strategies optimize searches
 *   - Feedback improves future predictions
 */
