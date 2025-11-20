"""
Weighted Search Example

This example demonstrates:
- Semantic vs recency weighting
- When to use different strategies
- Comparing search results
- Optimal weight selection
"""

from recallbricks import RecallBricks
import os
import time

rb = RecallBricks(os.getenv('RECALLBRICKS_API_KEY'))

def main():
    try:
        print('⚖️  RecallBricks Weighted Search Example\n')

        # ============================================
        # Setup: Create memories with different ages
        # ============================================
        print('Setting up test memories...\n')

        old_memory = rb.memories.create(
            content='Comprehensive guide to API authentication with detailed examples and security best practices',
            metadata={'category': 'documentation', 'type': 'comprehensive'}
        )

        # Wait a bit to create age difference
        time.sleep(2)

        recent_memory = rb.memories.create(
            content='Quick tip: Use Bearer tokens for API auth',
            metadata={'category': 'documentation', 'type': 'quick_tip'}
        )

        print('✓ Created old (comprehensive) and recent (quick tip) memories\n')

        # ============================================
        # STRATEGY 1: Semantic-Heavy (Theory/Docs)
        # ============================================
        print('1. Semantic-Heavy Search (Best for: Documentation, Research)\n')

        semantic_results = rb.memories.search(
            query='API authentication guide',
            weights={
                'semantic': 0.9,  # 90% semantic similarity
                'recency': 0.1    # 10% recency
            },
            limit=5
        )

        print('Results (prioritizing semantic match):')
        for index, result in enumerate(semantic_results):
            print(f'  {index + 1}. "{result.content[:60]}..."')
            print(f'     Total Score: {result.score:.3f}')
            print(f'     Semantic: {result.semantic_score:.3f}, Recency: {result.recency_score:.3f}\n')

        # ============================================
        # STRATEGY 2: Recency-Heavy (News/Activity)
        # ============================================
        print('2. Recency-Heavy Search (Best for: News, Activity, Trends)\n')

        recency_results = rb.memories.search(
            query='API authentication',
            weights={
                'semantic': 0.2,  # 20% semantic similarity
                'recency': 0.8    # 80% recency
            },
            limit=5
        )

        print('Results (prioritizing recent):')
        for index, result in enumerate(recency_results):
            print(f'  {index + 1}. "{result.content[:60]}..."')
            print(f'     Total Score: {result.score:.3f}')
            print(f'     Semantic: {result.semantic_score:.3f}, Recency: {result.recency_score:.3f}\n')

        # ============================================
        # STRATEGY 3: Balanced (General Purpose)
        # ============================================
        print('3. Balanced Search (Best for: General queries)\n')

        balanced_results = rb.memories.search(
            query='API authentication',
            weights={
                'semantic': 0.5,  # 50% semantic
                'recency': 0.5    # 50% recency
            },
            limit=5
        )

        print('Results (balanced approach):')
        for index, result in enumerate(balanced_results):
            print(f'  {index + 1}. "{result.content[:60]}..."')
            print(f'     Total Score: {result.score:.3f}')
            print(f'     Semantic: {result.semantic_score:.3f}, Recency: {result.recency_score:.3f}\n')

        # ============================================
        # STRATEGY 4: Use AI-learned optimal weights
        # ============================================
        print('4. AI-Optimized Weights\n')

        patterns = rb.metacognition.get_patterns()
        optimal_weights = patterns.query_patterns.optimal_weights

        print('AI-Learned Optimal Weights:')
        print(f'  Semantic: {optimal_weights.semantic}')
        print(f'  Recency: {optimal_weights.recency}\n')

        ai_optimized_results = rb.memories.search(
            query='API authentication',
            weights=optimal_weights,
            limit=5
        )

        print('Results (using AI-learned weights):')
        for index, result in enumerate(ai_optimized_results):
            print(f'  {index + 1}. "{result.content[:60]}..."')
            print(f'     Score: {result.score:.3f}\n')

        # ============================================
        # USE CASE 1: News Feed
        # ============================================
        print('5. Real-World Use Case: News Feed\n')

        rb.memories.create_batch([
            {
                'content': 'Breaking: AI model GPT-5 announced today',
                'metadata': {'category': 'news', 'type': 'breaking'}
            },
            {
                'content': 'Historical overview of AI development from 1950s to today',
                'metadata': {'category': 'news', 'type': 'evergreen'}
            }
        ])

        news_results = rb.memories.search(
            query='AI news',
            weights={'semantic': 0.3, 'recency': 0.7},  # Heavily favor recent
            metadata={'category': 'news'}
        )

        print('News Feed (recent news first):')
        for index, result in enumerate(news_results):
            print(f'  {index + 1}. {result.content}')
        print()

        # ============================================
        # USE CASE 2: Documentation Search
        # ============================================
        print('6. Real-World Use Case: Documentation Search\n')

        rb.memories.create_batch([
            {
                'content': 'API Rate Limits: Detailed explanation of all tiers',
                'metadata': {'category': 'docs', 'type': 'comprehensive'}
            },
            {
                'content': 'Rate limit update: Tier 3 now 200 req/sec (updated yesterday)',
                'metadata': {'category': 'docs', 'type': 'update'}
            }
        ])

        docs_results = rb.memories.search(
            query='rate limits',
            weights={'semantic': 0.85, 'recency': 0.15},  # Favor comprehensive docs
            metadata={'category': 'docs'}
        )

        print('Documentation (comprehensive first):')
        for index, result in enumerate(docs_results):
            print(f'  {index + 1}. {result.content}')
        print()

        # ============================================
        # USE CASE 3: User Activity Tracking
        # ============================================
        print('7. Real-World Use Case: User Activity\n')

        rb.memories.create_batch([
            {
                'content': 'User viewed pricing page',
                'metadata': {'category': 'activity', 'user_id': 'user_123'}
            },
            {
                'content': 'User signed up 3 months ago',
                'metadata': {'category': 'activity', 'user_id': 'user_123'}
            }
        ])

        activity_results = rb.memories.search(
            query='user activity',
            weights={'semantic': 0.2, 'recency': 0.8},  # Recent activity matters most
            metadata={'user_id': 'user_123'}
        )

        print('User Activity (recent first):')
        for index, result in enumerate(activity_results):
            print(f'  {index + 1}. {result.content}')
        print()

        # ============================================
        # COMPARISON: All strategies side-by-side
        # ============================================
        print('8. Strategy Comparison\n')

        query = 'authentication guide'

        strategies = [
            {'name': 'Semantic-Heavy', 'weights': {'semantic': 0.9, 'recency': 0.1}},
            {'name': 'Balanced', 'weights': {'semantic': 0.5, 'recency': 0.5}},
            {'name': 'Recency-Heavy', 'weights': {'semantic': 0.1, 'recency': 0.9}}
        ]

        for strategy in strategies:
            results = rb.memories.search(
                query=query,
                weights=strategy['weights'],
                limit=1
            )

            print(f"{strategy['name']}:")
            print(f"  Weights: Semantic {strategy['weights']['semantic']}, Recency {strategy['weights']['recency']}")
            if results:
                print(f'  Top Result: "{results[0].content[:50]}..."')
                print(f'  Score: {results[0].score:.3f}\n')

        # ============================================
        # Summary
        # ============================================
        print('✅ Weighted Search Example Completed!\n')
        print('Key takeaways:')
        print('  • Semantic-heavy (0.9/0.1): Best for docs, research, theory')
        print('  • Recency-heavy (0.1/0.9): Best for news, activity, trends')
        print('  • Balanced (0.5/0.5): Good default for general queries')
        print('  • AI-optimized: Let RecallBricks learn optimal weights')
        print('  • Different use cases need different strategies')
        print('  • Weights dramatically affect which results rank highest')

    except Exception as error:
        print(f'❌ Error: {str(error)}')
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
   python weighted-search.py

When to use each strategy:
  - Semantic-heavy: Documentation, research, evergreen content
  - Recency-heavy: News, user activity, real-time data
  - Balanced: General purpose, mixed content
  - AI-optimized: Trust the system to learn what works
"""
