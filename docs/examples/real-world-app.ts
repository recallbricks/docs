/**
 * Real-World Application Example
 *
 * A comprehensive example demonstrating RecallBricks in a production-like
 * customer support application with multiple features:
 * - Multi-agent support team
 * - Customer interaction history
 * - Predictive issue resolution
 * - Quality assurance through reputation
 * - Performance monitoring
 */

import { RecallBricks } from 'recallbricks';

const rb = new RecallBricks(process.env.RECALLBRICKS_API_KEY!);

// Application state
const supportAgents = ['agent-alice', 'agent-bob', 'agent-charlie'];
const customers = ['customer-001', 'customer-002'];

async function main() {
  try {
    console.log('🏢 RecallBricks: Real-World Customer Support Application\n');
    console.log('='.repeat(60));
    console.log();

    // ============================================
    // SETUP: Initialize support system
    // ============================================
    await initializeSupportSystem();

    // ============================================
    // SCENARIO 1: New customer ticket
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('SCENARIO 1: New Customer Ticket');
    console.log('='.repeat(60) + '\n');

    await handleNewTicket({
      ticketId: 'TICKET-001',
      customerId: 'customer-001',
      issue: 'API authentication failing with 401 error',
      priority: 'high'
    });

    // ============================================
    // SCENARIO 2: Returning customer
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('SCENARIO 2: Returning Customer');
    console.log('='.repeat(60) + '\n');

    await handleReturningCustomer({
      customerId: 'customer-001',
      newIssue: 'Rate limit exceeded error'
    });

    // ============================================
    // SCENARIO 3: Quality assurance
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('SCENARIO 3: Quality Assurance & Agent Performance');
    console.log('='.repeat(60) + '\n');

    await performQualityAssurance();

    // ============================================
    // SCENARIO 4: Predictive support
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('SCENARIO 4: Predictive Support');
    console.log('='.repeat(60) + '\n');

    await predictiveSupport({
      customerId: 'customer-002',
      context: 'Customer viewing API documentation for the first time'
    });

    // ============================================
    // SCENARIO 5: Knowledge synthesis
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('SCENARIO 5: Multi-Agent Knowledge Synthesis');
    console.log('='.repeat(60) + '\n');

    await synthesizeKnowledge();

    // ============================================
    // MONITORING: System performance
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('MONITORING: System Performance');
    console.log('='.repeat(60) + '\n');

    await monitorPerformance();

    // ============================================
    // Summary
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ Real-World Application Example Complete');
    console.log('='.repeat(60) + '\n');

    console.log('This example demonstrated:');
    console.log('  ✓ Multi-agent support team with reputation tracking');
    console.log('  ✓ Customer history and context retrieval');
    console.log('  ✓ Predictive issue resolution');
    console.log('  ✓ Quality assurance through agent filtering');
    console.log('  ✓ Knowledge synthesis across agents');
    console.log('  ✓ Performance monitoring and optimization');
    console.log();

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Initialize support system with agents and knowledge base
 */
async function initializeSupportSystem(): Promise<void> {
  console.log('Initializing Support System...\n');

  // Register support agents
  for (const agentId of supportAgents) {
    await rb.collaboration.registerAgent({
      agentId,
      role: 'customer_support',
      capabilities: ['troubleshooting', 'documentation', 'escalation']
    });
    console.log(`✓ Registered agent: ${agentId}`);
  }

  // Create knowledge base
  await rb.memories.createBatch([
    {
      content: 'Solution: 401 errors are usually due to expired or invalid API keys. Check the key format and expiration.',
      metadata: {
        agentId: 'agent-alice',
        category: 'solution',
        issue_type: 'authentication',
        success_rate: 0.95
      }
    },
    {
      content: 'Solution: Rate limit errors can be resolved by upgrading tier or implementing exponential backoff.',
      metadata: {
        agentId: 'agent-bob',
        category: 'solution',
        issue_type: 'rate_limit',
        success_rate: 0.92
      }
    },
    {
      content: 'Troubleshooting tip: Always check API key format: rb_live_* or rb_test_*',
      metadata: {
        agentId: 'agent-charlie',
        category: 'tip',
        issue_type: 'authentication'
      }
    }
  ]);

  console.log('✓ Knowledge base initialized');
}

/**
 * Handle a new support ticket
 */
async function handleNewTicket(ticket: {
  ticketId: string;
  customerId: string;
  issue: string;
  priority: string;
}): Promise<void> {
  console.log(`New Ticket: ${ticket.ticketId}`);
  console.log(`Customer: ${ticket.customerId}`);
  console.log(`Issue: "${ticket.issue}"`);
  console.log(`Priority: ${ticket.priority}\n`);

  // Step 1: Use AI to predict relevant solutions
  console.log('Step 1: AI-Powered Solution Search\n');

  const prediction = await rb.metacognition.predict({
    context: `
      Customer issue: "${ticket.issue}"
      Priority: ${ticket.priority}
      Customer: ${ticket.customerId}
    `,
    minConfidence: 0.8
  });

  console.log(`AI Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
  console.log('\nSuggested Solutions:');
  prediction.suggestedMemories.forEach((mem, index) => {
    console.log(`  ${index + 1}. ${mem.content}`);
    console.log(`     Confidence: ${(mem.confidence * 100).toFixed(1)}%`);
  });
  console.log();

  // Step 2: Assign to best agent
  console.log('Step 2: Agent Assignment\n');

  const agentComparison = await rb.collaboration.compareAgents({
    agentIds: supportAgents
  });

  const assignedAgent = agentComparison.topPerformer;
  console.log(`✓ Assigned to: ${assignedAgent} (Top performer)\n`);

  // Step 3: Store ticket in memory
  console.log('Step 3: Storing Ticket History\n');

  await rb.memories.create({
    content: `Ticket ${ticket.ticketId}: ${ticket.issue}. Resolved by ${assignedAgent}.`,
    metadata: {
      customer_id: ticket.customerId,
      ticket_id: ticket.ticketId,
      agent_id: assignedAgent,
      issue_type: 'authentication',
      resolved: true,
      resolution_time: 15  // minutes
    }
  });

  console.log('✓ Ticket stored in customer history');
}

/**
 * Handle returning customer with context awareness
 */
async function handleReturningCustomer(data: {
  customerId: string;
  newIssue: string;
}): Promise<void> {
  console.log(`Returning Customer: ${data.customerId}`);
  console.log(`New Issue: "${data.newIssue}"\n`);

  // Retrieve customer history
  console.log('Retrieving Customer History...\n');

  const history = await rb.memories.search({
    query: 'customer issues tickets',
    metadata: {
      customer_id: data.customerId
    },
    weights: { semantic: 0.4, recency: 0.6 },
    limit: 5
  });

  console.log('Previous Interactions:');
  history.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.content}`);
  });
  console.log();

  // Predict solution based on history + new issue
  const prediction = await rb.metacognition.predict({
    context: `
      Returning customer: ${data.customerId}
      Previous issue: Authentication errors
      New issue: "${data.newIssue}"
      Customer tier: Premium
    `
  });

  console.log('AI Recommendation:');
  console.log(`  "${prediction.suggestedMemories[0]?.content}"`);
  console.log(`  Confidence: ${(prediction.suggestedMemories[0]?.confidence * 100).toFixed(1)}%`);
  console.log();

  console.log('✓ Customer receives personalized support based on history');
}

/**
 * Perform quality assurance using agent reputation
 */
async function performQualityAssurance(): Promise<void> {
  console.log('Running Quality Assurance...\n');

  // Get high-quality solutions only
  const qualitySolutions = await rb.collaboration.getAgentMemories({
    minReputation: 0.85,
    category: 'solution'
  });

  console.log('High-Quality Solutions (reputation > 85%):');
  console.log(`  Total: ${qualitySolutions.length} solutions\n`);

  qualitySolutions.slice(0, 3).forEach((solution, index) => {
    console.log(`  ${index + 1}. ${solution.content}`);
    console.log(`     Agent: ${solution.agentId}`);
    console.log(`     Reputation: ${(solution.agentReputation * 100).toFixed(1)}%\n`);
  });

  // Identify underperforming agents
  const agentComparison = await rb.collaboration.compareAgents({
    agentIds: supportAgents
  });

  const lowPerformers = agentComparison.agents.filter(a => a.reputationScore < 0.7);

  if (lowPerformers.length > 0) {
    console.log('⚠️  Agents Needing Training:');
    lowPerformers.forEach(agent => {
      console.log(`  • ${agent.agentId} (${(agent.reputationScore * 100).toFixed(1)}%)`);
    });
  } else {
    console.log('✓ All agents performing well (>70% reputation)');
  }
}

/**
 * Predictive support: Anticipate customer needs
 */
async function predictiveSupport(data: {
  customerId: string;
  context: string;
}): Promise<void> {
  console.log(`Customer: ${data.customerId}`);
  console.log(`Context: ${data.context}\n`);

  const prediction = await rb.metacognition.predict({
    context: data.context,
    limit: 3
  });

  console.log('Proactive Assistance Suggestions:');
  console.log(`  Confidence: ${(prediction.confidence * 100).toFixed(1)}%\n`);

  prediction.suggestedMemories.forEach((mem, index) => {
    console.log(`  ${index + 1}. ${mem.content}`);
    console.log(`     Show as tooltip/help: ${mem.confidence > 0.85 ? 'Yes' : 'Optional'}\n`);
  });

  console.log('✓ Proactive help displayed to customer before they ask');
}

/**
 * Synthesize knowledge across support team
 */
async function synthesizeKnowledge(): Promise<void> {
  console.log('Synthesizing Team Knowledge...\n');

  // Get agent reputations
  const reputations: { [key: string]: number } = {};
  for (const agentId of supportAgents) {
    const rep = await rb.collaboration.getReputation(agentId);
    reputations[agentId] = rep.reputationScore;
  }

  // Synthesize knowledge from all agents
  const synthesis = await rb.collaboration.synthesize({
    agentMemories: supportAgents.map(agentId => ({
      agentId,
      reputation: reputations[agentId]
    })),
    topic: 'common customer issues and solutions',
    minConfidence: 0.8
  });

  console.log('Team Knowledge Synthesis:');
  console.log(`  Aggregate Confidence: ${(synthesis.aggregateConfidence * 100).toFixed(1)}%\n`);

  synthesis.synthesizedMemories.slice(0, 3).forEach((insight, index) => {
    console.log(`  ${index + 1}. ${insight.content}`);
    console.log(`     Contributing Agents: ${insight.contributingAgents.join(', ')}\n`);
  });

  console.log('✓ Team knowledge synthesized and ready for documentation');
}

/**
 * Monitor system performance
 */
async function monitorPerformance(): Promise<void> {
  console.log('Checking System Performance...\n');

  // Health check
  const health = await rb.health();
  console.log(`System Health: ${health.status}`);
  console.log(`API Version: ${health.version}\n`);

  // Usage stats
  const usage = await rb.metrics.getUsage({ timeRange: '7d' });
  console.log('Usage (Last 7 Days):');
  console.log(`  API Calls: ${usage.summary.apiCalls}`);
  console.log(`  Memories Created: ${usage.summary.memoriesCreated}`);
  console.log(`  Searches: ${usage.summary.searchesPerformed}`);
  console.log(`  Predictions: ${usage.summary.predictionsRequested}\n`);

  // Performance metrics
  const metrics = await rb.metrics.getSystem();
  console.log('Performance Metrics:');
  console.log(`  Avg Response Time: ${metrics.performance.avgResponseTime}ms`);
  console.log(`  P95 Latency: ${metrics.performance.p95Latency}ms`);
  console.log(`  Error Rate: ${(metrics.performance.errorRate * 100).toFixed(3)}%\n`);

  // Metacognition metrics
  const metacogMetrics = await rb.metacognition.getMetrics();
  console.log('AI Learning Progress:');
  console.log(`  Observations: ${metacogMetrics.learningProgress.totalObservations}`);
  console.log(`  Patterns Detected: ${metacogMetrics.learningProgress.patternsDetected}`);
  console.log(`  System Confidence: ${(metacogMetrics.learningProgress.confidenceLevel * 100).toFixed(1)}%`);
  console.log();

  console.log('Optimization Gains:');
  console.log(`  Speed: ${metacogMetrics.optimizationGains.speedImprovement}`);
  console.log(`  Accuracy: ${metacogMetrics.optimizationGains.accuracyImprovement}`);
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
 *    npx ts-node real-world-app.ts
 *
 * This comprehensive example demonstrates:
 *   - Complete customer support system
 *   - Multi-agent collaboration
 *   - Quality assurance through reputation
 *   - Predictive support
 *   - Performance monitoring
 *   - Production-ready patterns
 */
