/**
 * Multi-Agent Collaboration Example
 *
 * This example demonstrates Phase 3 metacognition:
 * - Registering multiple agents
 * - Agents contributing memories
 * - Reputation tracking
 * - Collaborative synthesis
 * - Agent comparison
 */

import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY!);

async function main() {
  try {
    console.log('🤝 RecallBricks Multi-Agent Collaboration Example\n');

    // ============================================
    // SETUP: Register specialized agents
    // ============================================
    console.log('1. Registering Specialized Agents\n');

    const webResearcher = await rb.collaboration.registerAgent({
      agentId: 'web-researcher',
      role: 'research',
      capabilities: ['web_search', 'fact_checking', 'source_verification'],
      metadata: {
        team: 'research',
        specialization: 'web_intelligence'
      }
    });

    console.log(`✓ Registered: ${webResearcher.agentId}`);
    console.log(`  Role: ${webResearcher.role}`);
    console.log(`  Initial Reputation: ${webResearcher.reputationScore}\n`);

    const dataAnalyst = await rb.collaboration.registerAgent({
      agentId: 'data-analyst',
      role: 'analysis',
      capabilities: ['data_processing', 'statistical_analysis', 'pattern_detection'],
      metadata: {
        team: 'analytics',
        specialization: 'quantitative_analysis'
      }
    });

    console.log(`✓ Registered: ${dataAnalyst.agentId}`);
    console.log(`  Role: ${dataAnalyst.role}\n`);

    const marketResearcher = await rb.collaboration.registerAgent({
      agentId: 'market-researcher',
      role: 'market_intelligence',
      capabilities: ['market_analysis', 'competitive_intelligence', 'trend_forecasting'],
      metadata: {
        team: 'research',
        specialization: 'market_trends'
      }
    });

    console.log(`✓ Registered: ${marketResearcher.agentId}\n`);

    // ============================================
    // CONTRIBUTION: Agents create memories
    // ============================================
    console.log('2. Agents Contributing Knowledge\n');

    // Web Researcher findings
    const webMemories = await rb.memories.createBatch([
      {
        content: 'Study shows 73% of developers use AI coding tools in 2024',
        metadata: {
          agentId: 'web-researcher',
          source: 'Stack Overflow Developer Survey 2024',
          confidence: 0.95
        }
      },
      {
        content: 'GitHub Copilot reported 1M+ paying subscribers',
        metadata: {
          agentId: 'web-researcher',
          source: 'GitHub Blog',
          confidence: 0.98
        }
      }
    ]);

    console.log(`✓ Web Researcher: Created ${webMemories.length} memories`);

    // Data Analyst findings
    const dataMemories = await rb.memories.createBatch([
      {
        content: 'Internal survey: 68% of our users adopted AI tools in Q4 2024',
        metadata: {
          agentId: 'data-analyst',
          source: 'Internal Data',
          confidence: 0.92
        }
      },
      {
        content: 'Average productivity increase: 35% with AI assistance',
        metadata: {
          agentId: 'data-analyst',
          source: 'User Analytics',
          confidence: 0.89
        }
      }
    ]);

    console.log(`✓ Data Analyst: Created ${dataMemories.length} memories`);

    // Market Researcher findings
    const marketMemories = await rb.memories.createBatch([
      {
        content: 'AI developer tools market size: $4.2B in 2024, growing 45% YoY',
        metadata: {
          agentId: 'market-researcher',
          source: 'Gartner Market Research',
          confidence: 0.91
        }
      },
      {
        content: 'Top competitors: GitHub Copilot, Cursor, Tabnine',
        metadata: {
          agentId: 'market-researcher',
          source: 'Competitive Analysis',
          confidence: 0.87
        }
      }
    ]);

    console.log(`✓ Market Researcher: Created ${marketMemories.length} memories\n`);

    // ============================================
    // REPUTATION: Check agent performance
    // ============================================
    console.log('3. Agent Reputation Scores\n');

    const agents = ['web-researcher', 'data-analyst', 'market-researcher'];

    for (const agentId of agents) {
      const reputation = await rb.collaboration.getReputation(agentId);

      console.log(`${agentId}:`);
      console.log(`  Reputation Score: ${(reputation.reputationScore * 100).toFixed(1)}%`);
      console.log(`  Tier: ${reputation.tier}`);
      console.log(`  Total Contributions: ${reputation.totalContributions}`);
      console.log(`  Average Confidence: ${(reputation.averageConfidence * 100).toFixed(1)}%\n`);
    }

    // ============================================
    // SYNTHESIS: Combine agent knowledge
    // ============================================
    console.log('4. Collaborative Knowledge Synthesis\n');

    const synthesis = await rb.collaboration.synthesize({
      agentMemories: [
        {
          agentId: 'web-researcher',
          memories: webMemories.map(m => m.id),
          reputation: 0.94  // High reputation
        },
        {
          agentId: 'data-analyst',
          memories: dataMemories.map(m => m.id),
          reputation: 0.91
        },
        {
          agentId: 'market-researcher',
          memories: marketMemories.map(m => m.id),
          reputation: 0.88
        }
      ],
      topic: 'AI developer tools adoption and market trends',
      minConfidence: 0.85
    });

    console.log('Synthesized Insights:');
    synthesis.synthesizedMemories.forEach((insight, index) => {
      console.log(`\n  ${index + 1}. ${insight.content}`);
      console.log(`     Contributing Agents: ${insight.contributingAgents.join(', ')}`);
      console.log(`     Confidence: ${(insight.confidence * 100).toFixed(1)}%`);
    });

    console.log(`\nTop Contributors:`);
    synthesis.topContributors.forEach((contributor, index) => {
      console.log(`  ${index + 1}. ${contributor.agentId} (${(contributor.contribution * 100).toFixed(1)}% contribution)`);
    });

    console.log(`\nAggregate Confidence: ${(synthesis.aggregateConfidence * 100).toFixed(1)}%\n`);

    // ============================================
    // FILTERING: Get high-reputation memories
    // ============================================
    console.log('5. Filtering by Reputation\n');

    const highReputationMemories = await rb.collaboration.getAgentMemories({
      minReputation: 0.9,  // Only top-tier agents
      limit: 5
    });

    console.log(`Memories from high-reputation agents (>90%):`);
    highReputationMemories.forEach((memory, index) => {
      console.log(`  ${index + 1}. ${memory.content}`);
      console.log(`     Agent: ${memory.agentId} (${(memory.agentReputation * 100).toFixed(1)}%)\n`);
    });

    // ============================================
    // COMPARISON: Compare agent performance
    // ============================================
    console.log('6. Agent Performance Comparison\n');

    const comparison = await rb.collaboration.compareAgents({
      agentIds: agents,
      metrics: ['reputationScore', 'totalContributions', 'averageConfidence']
    });

    console.log('Performance Rankings:');
    comparison.agents.forEach((agent, index) => {
      console.log(`  ${index + 1}. ${agent.agentId}`);
      console.log(`     Reputation: ${(agent.reputationScore * 100).toFixed(1)}%`);
      console.log(`     Contributions: ${agent.totalContributions}`);
      console.log(`     Avg Confidence: ${(agent.averageConfidence * 100).toFixed(1)}%`);
      console.log(`     Rank: ${agent.rank}\n`);
    });

    console.log(`Top Performer: ${comparison.topPerformer}\n`);

    if (comparison.insights && comparison.insights.length > 0) {
      console.log('Insights:');
      comparison.insights.forEach(insight => {
        console.log(`  • ${insight}`);
      });
      console.log();
    }

    // ============================================
    // USE CASE: Quality-based routing
    // ============================================
    console.log('7. Use Case: Route Query to Best Agent\n');

    const query = 'What are the latest AI tool market statistics?';

    console.log(`Query: "${query}"\n`);

    // Find best agent for this query
    const bestAgent = comparison.agents.find(a =>
      a.agentId === 'market-researcher'  // Specialized for market data
    );

    if (bestAgent) {
      const agentMemories = await rb.collaboration.getAgentMemories({
        agentId: bestAgent.agentId,
        limit: 3
      });

      console.log(`Routing to: ${bestAgent.agentId} (Reputation: ${(bestAgent.reputationScore * 100).toFixed(1)}%)`);
      console.log(`\nResults:`);
      agentMemories.forEach((memory, index) => {
        console.log(`  ${index + 1}. ${memory.content}`);
      });
    }
    console.log();

    // ============================================
    // USE CASE: Consensus building
    // ============================================
    console.log('8. Use Case: Multi-Agent Consensus\n');

    console.log('Question: "What percentage of developers use AI tools?"');
    console.log('Agent Findings:');
    console.log('  • Web Researcher: 73% (source: survey)');
    console.log('  • Data Analyst: 68% (source: internal data)');
    console.log('  • Market Researcher: 70% estimated from market size\n');

    console.log('Consensus (reputation-weighted):');
    console.log('  Weighted Average: ~70.5%');
    console.log('  Confidence: High (multiple independent sources)\n');

    // ============================================
    // UPDATE: Modify agent capabilities
    // ============================================
    console.log('9. Updating Agent\n');

    await rb.collaboration.updateAgent('web-researcher', {
      capabilities: ['web_search', 'fact_checking', 'source_verification', 'real_time_monitoring'],
      metadata: {
        team: 'research',
        specialization: 'web_intelligence',
        version: '2.0'
      }
    });

    console.log('✓ Updated web-researcher with new capabilities\n');

    // ============================================
    // Summary
    // ============================================
    console.log('✅ Multi-Agent Collaboration Example Completed!\n');
    console.log('Key takeaways:');
    console.log('  • Each agent builds reputation based on contribution quality');
    console.log('  • High-reputation agents have more influence in synthesis');
    console.log('  • Filter memories by reputation for quality assurance');
    console.log('  • Compare agents to identify top performers');
    console.log('  • Route queries to specialized, high-reputation agents');
    console.log('  • Build consensus through reputation-weighted aggregation');
    console.log('  • System automatically tracks and rewards quality');

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
 *    npx ts-node multi-agent.ts
 *
 * Real-world applications:
 *   - Research teams with specialized agents
 *   - Customer support with quality filtering
 *   - Content moderation with consensus
 *   - Distributed AI systems with regional agents
 */
