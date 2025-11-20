"""
Predictive Recall Example

This example demonstrates metacognition Phase 2A:
- AI predicts what memories you'll need
- Confidence-based filtering
- Learning from usage patterns
- Optimal strategy suggestions
"""

from recallbricks import RecallBricks
import os

rb = RecallBricks(os.getenv('RECALLBRICKS_API_KEY'))

def main():
    try:
        print('🧠 RecallBricks Predictive Recall Example\n')

        # ============================================
        # Setup: Create sample memories
        # ============================================
        print('Setting up sample memories...\n')

        rb.memories.create_batch([
            {
                'content': 'User prefers concise documentation with code examples',
                'metadata': {'category': 'preferences', 'type': 'documentation'}
            },
            {
                'content': 'User dislikes verbose explanations',
                'metadata': {'category': 'preferences', 'type': 'communication'}
            },
            {
                'content': 'API authentication uses Bearer tokens',
                'metadata': {'category': 'api_docs', 'type': 'authentication'}
            },
            {
                'content': 'Rate limits: Tier 1 = 10 req/sec, Tier 2 = 50 req/sec',
                'metadata': {'category': 'api_docs', 'type': 'limits'}
            },
            {
                'content': 'User last asked about Python SDK installation',
                'metadata': {'category': 'activity', 'type': 'recent_query'}
            }
        ])

        # ============================================
        # PREDICTION 1: Simple context
        # ============================================
        print('1. Basic Prediction\n')

        prediction1 = rb.metacognition.predict(
            context='User asking about API documentation style preferences'
        )

        print('Prediction:')
        print(f'  Overall Confidence: {prediction1.confidence * 100:.1f}%')
        print(f'  Reasoning: {prediction1.reasoning}\n')

        print('Suggested Memories:')
        for index, memory in enumerate(prediction1.suggested_memories):
            print(f'  {index + 1}. "{memory.content}"')
            print(f'     Confidence: {memory.confidence * 100:.1f}%')
            print(f'     Reasoning: {memory.reasoning}\n')

        # ============================================
        # PREDICTION 2: With confidence filtering
        # ============================================
        print('2. High-Confidence Predictions Only\n')

        prediction2 = rb.metacognition.predict(
            context='User needs information about API authentication',
            min_confidence=0.85,  # Only very confident predictions
            limit=3
        )

        print(f'Found {len(prediction2.suggested_memories)} high-confidence suggestions:')
        for index, memory in enumerate(prediction2.suggested_memories):
            print(f'  {index + 1}. "{memory.content}"')
            print(f'     Confidence: {memory.confidence * 100:.1f}%\n')

        # ============================================
        # PREDICTION 3: Rich contextual prediction
        # ============================================
        print('3. Rich Context Prediction\n')

        rich_context = """
            User: "How do I get started with the Python SDK?"
            Session: New (first interaction)
            User Tier: Premium
            Previous Activity: Asked about installation 5 minutes ago
        """

        prediction3 = rb.metacognition.predict(
            context=rich_context,
            include_strategy=True
        )

        print('AI-Suggested Search Strategy:')
        print(f'  Semantic Weight: {prediction3.suggested_strategy.weights.semantic}')
        print(f'  Recency Weight: {prediction3.suggested_strategy.weights.recency}')
        print(f'  Suggested Limit: {prediction3.suggested_strategy.limit}')
        if prediction3.suggested_strategy.filters:
            print(f'  Filters: {prediction3.suggested_strategy.filters}')
        print()

        # ============================================
        # PREDICTION 4: Using predictions in search
        # ============================================
        print('4. Applying Predicted Strategy\n')

        # Get prediction
        prediction = rb.metacognition.predict(
            context='User wants Python SDK documentation'
        )

        # Apply the suggested strategy to actual search
        results = rb.memories.search(
            query='Python SDK',
            weights=prediction.suggested_strategy.weights,
            limit=prediction.suggested_strategy.limit
        )

        print('Search Results (using AI-suggested strategy):')
        for index, result in enumerate(results):
            print(f'  {index + 1}. "{result.content}"')
            print(f'     Score: {result.score:.3f}\n')

        # ============================================
        # PREDICTION 5: Hybrid approach
        # ============================================
        print('5. Hybrid: Predictions + Traditional Search\n')

        hybrid_prediction = rb.metacognition.predict(
            context='User asking about rate limits'
        )

        # Use high-confidence predictions
        high_confidence = [
            m for m in hybrid_prediction.suggested_memories
            if m.confidence > 0.9
        ]

        print(f'High-confidence predictions (>90%): {len(high_confidence)}')

        if high_confidence:
            print('Using predicted memories directly:')
            for i, mem in enumerate(high_confidence):
                print(f'  {i + 1}. {mem.content}')
        else:
            print('No high-confidence predictions, falling back to search...')
            fallback_results = rb.memories.search(query='rate limits', limit=3)
            print(f'Found {len(fallback_results)} results via search.')
        print()

        # ============================================
        # LEARNING: Get usage patterns
        # ============================================
        print('6. Learning Patterns\n')

        patterns = rb.metacognition.get_patterns()

        print('System Learning:')
        print(f'  Most Queried Topics: {", ".join(patterns.query_patterns.most_queried)}')
        print(f'  Optimal Weights: semantic={patterns.query_patterns.optimal_weights.semantic}, recency={patterns.query_patterns.optimal_weights.recency}')
        print(f'  Avg Retrieval Time: {patterns.query_patterns.avg_retrieval_time}ms')
        print(f'  Cache Hit Rate: {patterns.performance_metrics.cache_hit_rate * 100:.1f}%\n')

        # ============================================
        # FEEDBACK: Help the system learn
        # ============================================
        print('7. Providing Feedback\n')

        rb.metacognition.feedback(
            prediction_id=prediction1.id,
            useful=True,
            used_memories=[prediction1.suggested_memories[0].id]
        )

        print('✓ Feedback submitted')
        print('  This helps RecallBricks improve future predictions!\n')

        # ============================================
        # METRICS: Learning progress
        # ============================================
        print('8. Metacognitive Metrics\n')

        metrics = rb.metacognition.get_metrics()

        print('Learning Progress:')
        print(f'  Total Observations: {metrics.learning_progress.total_observations}')
        print(f'  Patterns Detected: {metrics.learning_progress.patterns_detected}')
        print(f'  Confidence Level: {metrics.learning_progress.confidence_level * 100:.1f}%')
        print()

        print('Optimization Gains:')
        print(f'  Speed: {metrics.optimization_gains.speed_improvement}')
        print(f'  Accuracy: {metrics.optimization_gains.accuracy_improvement}')
        print(f'  Cache Efficiency: {metrics.optimization_gains.cache_efficiency}\n')

        # ============================================
        # Summary
        # ============================================
        print('✅ Predictive Recall Example Completed!\n')
        print('Key takeaways:')
        print('  • Predictions save you from manually crafting queries')
        print('  • Confidence scores let you decide when to trust predictions')
        print('  • Rich context = better predictions')
        print('  • Suggested strategies optimize your searches automatically')
        print('  • Feedback makes the system smarter over time')
        print('  • The system learns and improves continuously')

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
   python predictive-recall.py

Expected behavior:
  - AI predicts relevant memories from context
  - Confidence scores guide usage decisions
  - Suggested strategies optimize searches
  - Feedback improves future predictions
"""
