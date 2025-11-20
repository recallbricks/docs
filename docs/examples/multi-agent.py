"""
Multi-Agent Collaboration Example

This example demonstrates Phase 3 metacognition:
- Registering multiple agents
- Agents contributing memories
- Reputation tracking
- Collaborative synthesis
- Agent comparison
"""

from recallbricks import RecallBricks
import os

rb = RecallBricks(os.getenv('RECALLBRICKS_API_KEY'))

def main():
    try:
        print('🤝 RecallBricks Multi-Agent Collaboration Example\n')

        # ============================================
        # SETUP: Register specialized agents
        # ============================================
        print('1. Registering Specialized Agents\n')

        web_researcher = rb.collaboration.register_agent(
            agent_id='web-researcher',
            role='research',
            capabilities=['web_search', 'fact_checking', 'source_verification'],
            metadata={
                'team': 'research',
                'specialization': 'web_intelligence'
            }
        )

        print(f'✓ Registered: {web_researcher.agent_id}')
        print(f'  Role: {web_researcher.role}')
        print(f'  Initial Reputation: {web_researcher.reputation_score}\n')

        data_analyst = rb.collaboration.register_agent(
            agent_id='data-analyst',
            role='analysis',
            capabilities=['data_processing', 'statistical_analysis', 'pattern_detection'],
            metadata={
                'team': 'analytics',
                'specialization': 'quantitative_analysis'
            }
        )

        print(f'✓ Registered: {data_analyst.agent_id}')
        print(f'  Role: {data_analyst.role}\n')

        market_researcher = rb.collaboration.register_agent(
            agent_id='market-researcher',
            role='market_intelligence',
            capabilities=['market_analysis', 'competitive_intelligence', 'trend_forecasting'],
            metadata={
                'team': 'research',
                'specialization': 'market_trends'
            }
        )

        print(f'✓ Registered: {market_researcher.agent_id}\n')

        # ============================================
        # CONTRIBUTION: Agents create memories
        # ============================================
        print('2. Agents Contributing Knowledge\n')

        # Web Researcher findings
        web_memories = rb.memories.create_batch([
            {
                'content': 'Study shows 73% of developers use AI coding tools in 2024',
                'metadata': {
                    'agentId': 'web-researcher',
                    'source': 'Stack Overflow Developer Survey 2024',
                    'confidence': 0.95
                }
            },
            {
                'content': 'GitHub Copilot reported 1M+ paying subscribers',
                'metadata': {
                    'agentId': 'web-researcher',
                    'source': 'GitHub Blog',
                    'confidence': 0.98
                }
            }
        ])

        print(f'✓ Web Researcher: Created {len(web_memories)} memories')

        # Data Analyst findings
        data_memories = rb.memories.create_batch([
            {
                'content': 'Internal survey: 68% of our users adopted AI tools in Q4 2024',
                'metadata': {
                    'agentId': 'data-analyst',
                    'source': 'Internal Data',
                    'confidence': 0.92
                }
            },
            {
                'content': 'Average productivity increase: 35% with AI assistance',
                'metadata': {
                    'agentId': 'data-analyst',
                    'source': 'User Analytics',
                    'confidence': 0.89
                }
            }
        ])

        print(f'✓ Data Analyst: Created {len(data_memories)} memories')

        # Market Researcher findings
        market_memories = rb.memories.create_batch([
            {
                'content': 'AI developer tools market size: $4.2B in 2024, growing 45% YoY',
                'metadata': {
                    'agentId': 'market-researcher',
                    'source': 'Gartner Market Research',
                    'confidence': 0.91
                }
            },
            {
                'content': 'Top competitors: GitHub Copilot, Cursor, Tabnine',
                'metadata': {
                    'agentId': 'market-researcher',
                    'source': 'Competitive Analysis',
                    'confidence': 0.87
                }
            }
        ])

        print(f'✓ Market Researcher: Created {len(market_memories)} memories\n')

        # ============================================
        # REPUTATION: Check agent performance
        # ============================================
        print('3. Agent Reputation Scores\n')

        agents = ['web-researcher', 'data-analyst', 'market-researcher']

        for agent_id in agents:
            reputation = rb.collaboration.get_reputation(agent_id)

            print(f'{agent_id}:')
            print(f'  Reputation Score: {reputation.reputation_score * 100:.1f}%')
            print(f'  Tier: {reputation.tier}')
            print(f'  Total Contributions: {reputation.total_contributions}')
            print(f'  Average Confidence: {reputation.average_confidence * 100:.1f}%\n')

        # ============================================
        # SYNTHESIS: Combine agent knowledge
        # ============================================
        print('4. Collaborative Knowledge Synthesis\n')

        synthesis = rb.collaboration.synthesize(
            agent_memories=[
                {
                    'agent_id': 'web-researcher',
                    'memories': [m.id for m in web_memories],
                    'reputation': 0.94
                },
                {
                    'agent_id': 'data-analyst',
                    'memories': [m.id for m in data_memories],
                    'reputation': 0.91
                },
                {
                    'agent_id': 'market-researcher',
                    'memories': [m.id for m in market_memories],
                    'reputation': 0.88
                }
            ],
            topic='AI developer tools adoption and market trends',
            min_confidence=0.85
        )

        print('Synthesized Insights:')
        for index, insight in enumerate(synthesis.synthesized_memories):
            print(f'\n  {index + 1}. {insight.content}')
            print(f'     Contributing Agents: {", ".join(insight.contributing_agents)}')
            print(f'     Confidence: {insight.confidence * 100:.1f}%')

        print(f'\nTop Contributors:')
        for index, contributor in enumerate(synthesis.top_contributors):
            print(f'  {index + 1}. {contributor.agent_id} ({contributor.contribution * 100:.1f}% contribution)')

        print(f'\nAggregate Confidence: {synthesis.aggregate_confidence * 100:.1f}%\n')

        # ============================================
        # FILTERING: Get high-reputation memories
        # ============================================
        print('5. Filtering by Reputation\n')

        high_reputation_memories = rb.collaboration.get_agent_memories(
            min_reputation=0.9,  # Only top-tier agents
            limit=5
        )

        print(f'Memories from high-reputation agents (>90%):')
        for index, memory in enumerate(high_reputation_memories):
            print(f'  {index + 1}. {memory.content}')
            print(f'     Agent: {memory.agent_id} ({memory.agent_reputation * 100:.1f}%)\n')

        # ============================================
        # COMPARISON: Compare agent performance
        # ============================================
        print('6. Agent Performance Comparison\n')

        comparison = rb.collaboration.compare_agents(
            agent_ids=agents,
            metrics=['reputation_score', 'total_contributions', 'average_confidence']
        )

        print('Performance Rankings:')
        for index, agent in enumerate(comparison.agents):
            print(f'  {index + 1}. {agent.agent_id}')
            print(f'     Reputation: {agent.reputation_score * 100:.1f}%')
            print(f'     Contributions: {agent.total_contributions}')
            print(f'     Avg Confidence: {agent.average_confidence * 100:.1f}%')
            print(f'     Rank: {agent.rank}\n')

        print(f'Top Performer: {comparison.top_performer}\n')

        if comparison.insights:
            print('Insights:')
            for insight in comparison.insights:
                print(f'  • {insight}')
            print()

        # ============================================
        # UPDATE: Modify agent capabilities
        # ============================================
        print('7. Updating Agent\n')

        rb.collaboration.update_agent(
            'web-researcher',
            capabilities=['web_search', 'fact_checking', 'source_verification', 'real_time_monitoring'],
            metadata={
                'team': 'research',
                'specialization': 'web_intelligence',
                'version': '2.0'
            }
        )

        print('✓ Updated web-researcher with new capabilities\n')

        # ============================================
        # Summary
        # ============================================
        print('✅ Multi-Agent Collaboration Example Completed!\n')
        print('Key takeaways:')
        print('  • Each agent builds reputation based on contribution quality')
        print('  • High-reputation agents have more influence in synthesis')
        print('  • Filter memories by reputation for quality assurance')
        print('  • Compare agents to identify top performers')
        print('  • Route queries to specialized, high-reputation agents')
        print('  • Build consensus through reputation-weighted aggregation')
        print('  • System automatically tracks and rewards quality')

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
   python multi-agent.py

Real-world applications:
  - Research teams with specialized agents
  - Customer support with quality filtering
  - Content moderation with consensus
  - Distributed AI systems with regional agents
"""
