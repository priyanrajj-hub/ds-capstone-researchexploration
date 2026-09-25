import { AlgorithmContent } from './types';

export const ALGORITHM_DATA: Record<string, AlgorithmContent> = {
  'bfs-nhop': {
    id: 'bfs-nhop',
    title: 'BFS N-Hop (Friends-of-Friends)',
    realWorldHook: "You add Alice as a friend. Her friend Bob is now 1-hop away — Instagram/LinkedIn surfaces him within hours. BFS N-hop is the foundation of structural viral reach.",
    howItWorks: [
      "Start exactly at your user node.",
      "Queue all immediate verified connections.",
      "De-queue your direct friends, and enqueue their mutual friends.",
      "Immediately stop at hop depth 2 or 3 to prevent memory blowups."
    ],
    whenToUse: "Basic candidate retrieval scaling up to 2-hop distances for dense friend suggestions.",
    whenNotToUse: "Retrieving beyond 3 hops on dense graphs causes an immediate combinatorial explosion.",
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
      note: 'Practically bounded by degree (D^k) where k=hop max limit.'
    },
    comparedTo: [
      { algorithmId: "ppr", tradeoff: "BFS finds guaranteed shortest-hop candidates in O(V+E) but misses structurally-close nodes reachable only through longer paths; PPR catches those at higher compute cost." },
      { algorithmId: "common-neighbors", tradeoff: "BFS gathers candidates indiscriminately by structural depth; Common Neighbors scores those retrieved candidates." }
    ],
    pitfalls: [
      "Forgetting the visited set, resulting in an infinite loop.",
      "Not capping the hop limit (maxHop), causing the entire graph to be loaded into memory."
    ],
    quiz: [
      {
        type: 'mcq',
        prompt: 'Why do production social networks strictly limit BFS traversal to 2 or 3 hops?',
        options: ['Nodes further out are more likely to be bots.', 'Combinatorial explosion causes out-of-memory errors on massive friend networks.', 'The algorithm is physically incapable of visiting 4-hop nodes.'],
        correctAnswer: 'Combinatorial explosion causes out-of-memory errors on massive friend networks.',
        explanation: 'A user with 500 friends whose friends also have 500 friends results in 250,000 nodes at just 2-hops.'
      },
      {
        type: 'predict',
        prompt: 'If maxHop is set to 1, what does BFS output on a social graph?',
        options: ['Friends-of-friends', 'Only the users direct existing friends', 'The entire database'],
        correctAnswer: 'Only the users direct existing friends',
        explanation: 'A 1-hop boundary stops immediately after visiting the direct connections of the root node.'
      }
    ],
    pseudocode: `function bfsNHop(startNode, maxHop) {\n  queue.push({node: startNode, hop: 0});\n  while (queue is not empty) {\n    curr = queue.pop();\n    if (curr.hop >= maxHop) continue;\n    for (neighbor of curr.neighbors) {\n      if (not visited) {\n        visited.add(neighbor);\n        queue.push({node: neighbor, hop: curr.hop + 1});\n      }\n    }\n  }\n}`,
    prevId: null,
    nextId: 'common-neighbors'
  },
  'common-neighbors': {
    id: 'common-neighbors',
    title: 'Common Neighbors',
    realWorldHook: "You and Priya both know Rahul and Meera — that's 2 common neighbors, a strong signal you two should connect.",
    howItWorks: [
      "Find the full set of friends for Person A.",
      "Find the full set of friends for Person B.",
      "Count the exact number of nodes that exist in both sets.",
      "Rank candidates directly by this raw integer amount."
    ],
    whenToUse: "Fast, interpretable baseline scoring directly after candidate retrieval.",
    whenNotToUse: "When user graphs have massive celebrity nodes indiscriminately boosting scores.",
    complexity: {
      time: 'O(|N(u)|)',
      space: 'O(|N(v)|)',
      note: 'Assuming hash set lookups for intersection checks.'
    },
    comparedTo: [
      { algorithmId: "jaccard", tradeoff: "Common Neighbors is biased by sheer degree; Jaccard normalizes the score to prevent a user with 5,000 friends from dominating." }
    ],
    pitfalls: [
      "Allocating massive arrays for intersection rather than fast Hash Sets.",
      "Treating a mutual celebrity friend exactly the same as a niche hometown friend."
    ],
    quiz: [
      {
        type: 'mcq',
        prompt: 'If User A has friends {X,Y,Z} and User B has friends {W,X,Y,Z}, what is the Common Neighbors score?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '3',
        explanation: 'They identically share X, Y, and Z.'
      }
    ],
    pseudocode: `function commonNeighbors(u, v) {\n  let count = 0;\n  for (n of neighbors(u)) {\n    if (neighbors(v).has(n)) { count++; }\n  }\n  return count;\n}`,
    prevId: 'bfs-nhop',
    nextId: 'jaccard'
  },
  'jaccard': {
    id: 'jaccard',
    title: 'Jaccard Similarity',
    realWorldHook: "If a user has 5,000 connections, sharing 5 mutual friends with them shouldn't be as heavily weighted as sharing 5 mutual friends with someone who only has 10 connections total. Jaccard forces this mathematical fairness.",
    howItWorks: [
      "Calculate the intersection (Common Neighbors).",
      "Calculate the total union of all distinct friends between both people.",
      "Divide the intersection by the union to normalize between 0.0 and 1.0."
    ],
    whenToUse: "Scoring candidates when node degree variance is violently high.",
    whenNotToUse: "When dealing with extremely tight localized clusters where union sizes are near identical regardless.",
    complexity: {
      time: 'O(|N(u)| + |N(v)|)',
      space: 'O(|N(u)| + |N(v)|)',
      note: 'Must materialize the union size.'
    },
    comparedTo: [
      { algorithmId: "adamic-adar", tradeoff: "Jaccard penalizes the total size of the network, but Adamic-Adar explicitly down-weights high-degree mutual connectors themselves." }
    ],
    pitfalls: [
      "Blindly calculating union directly instead of using formula: size(A)+size(B)-size(Intersect).",
      "Dividing by zero if both users have zero friends."
    ],
    quiz: [
      {
        type: 'mcq',
        prompt: 'If Intersection is 2 and Union is 10, the Jaccard Similarity is:',
        options: ['0.5', '0.2', '5'],
        correctAnswer: '0.2',
        explanation: '2 divided by 10 is 0.2.'
      }
    ],
    pseudocode: `function jaccard(u, v) {\n  intersect = n(u) AND n(v)\n  union = n(u) OR n(v)\n  return intersect.size / union.size\n}`,
    prevId: 'common-neighbors',
    nextId: 'adamic-adar'
  },
  'adamic-adar': {
    id: 'adamic-adar',
    title: 'Adamic-Adar',
    realWorldHook: "A low-signal 'super-connector' mutual friend counts substantially less than a niche mutual friend. Down-weighting popular hubs isolates true social circles.",
    howItWorks: [
      "Find all mutual friends (intersection).",
      "For each mutual friend, calculate their exact degree (number of friends).",
      "Invert the degree using a logarithm: 1 / Math.log(degree).",
      "Sum these inverted logarithmic weights."
    ],
    whenToUse: "High-precision friend recommendation targeting distinct friend group crossovers.",
    whenNotToUse: "When computing power is tightly constrained (logarithmic math over billions of edges is expensive).",
    complexity: {
      time: 'O(|N(u)|)',
      space: 'O(|N(v)|)',
      note: 'Iteration over intersection.'
    },
    comparedTo: [
      { algorithmId: "jaccard", tradeoff: "Adamic-Adar targets specific node degrees of mutuals, while Jaccard statically analyzes the total border sets of both end-users." }
    ],
    pitfalls: [
      "Math.log(1) is 0, causing a division by zero error if a mutual friend somehow only has 1 degree (which contradicts the definition of a mutual friend, but edge-cases exist in directed graphs)."
    ],
    quiz: [
      {
        type: 'mcq',
        prompt: 'Why does Adamic-Adar use 1/log(degree) instead of raw degree?',
        options: ['To penalize mutual friends who have massive followings', 'To boost mutual friends who are celebrities', 'To speed up calculation'],
        correctAnswer: 'To penalize mutual friends who have massive followings',
        explanation: 'The larger the degree, the smaller 1/log(degree) becomes, minimizing their impact on the final association score.'
      }
    ],
    pseudocode: `function adamicAdar(u, v) {\n  score = 0;\n  for (n of intersection(n(u), n(v))) {\n    score += 1 / Math.log(degree(n));\n  }\n  return score;\n}`,
    prevId: 'jaccard',
    nextId: 'ppr'
  },
  'ppr': {
    id: 'ppr',
    title: 'Personalized PageRank (Random Walks)',
    realWorldHook: "Random walks from you, weighted toward returning to you, randomly surface friends-of-friends-of-friends who are structurally close even without a short hop path. It's the engine behind Twitter's 'Who to Follow'.",
    howItWorks: [
      "Spawn multiple mathematical 'walkers' on the root node.",
      "Each step, roll a probability dice.",
      "If < alpha teleport probability, warp directly back to the root.",
      "Otherwise, jump to a random friend.",
      "Tally every node the walkers pass through."
    ],
    whenToUse: "Deep structural candidate retrieval when direct graphs are sparse.",
    whenNotToUse: "Real-time user queries (requires heavy pre-computation or Monte-Carlo approximation).",
    complexity: {
      time: 'O(W * S)',
      space: 'O(V)',
      note: 'Where W = num walks, S = max steps.'
    },
    comparedTo: [
      { algorithmId: "bfs-nhop", tradeoff: "PPR identifies heavily interconnected long-distance clusters, whereas BFS stubbornly locks to absolute hop boundaries." }
    ],
    pitfalls: [
      "Setting alpha too high clusters answers entirely onto immediate friends.",
      "Running out of memory tracking visit trajectories symmetrically."
    ],
    quiz: [
      {
        type: 'mcq',
        prompt: 'What happens when teleport alpha is set to 0.99?',
        options: ['Walkers almost instantly return to the root node upon moving.', 'Walkers infinitely traverse the graph without bounds.'],
        correctAnswer: 'Walkers almost instantly return to the root node upon moving.',
        explanation: 'A 99% teleport factor forces the rank to aggressively hug the absolute immediate neighborhood.'
      }
    ],
    pseudocode: `function ppr(start, alpha, numWalks, maxSteps) {\n  visits = {}...\n  return visits;\n}`,
    prevId: 'adamic-adar',
    nextId: 'top-k-heap'
  },
  'top-k-heap': {
    id: 'top-k-heap',
    title: 'Top-K Min-Heap',
    realWorldHook: "After candidate retrieval and scoring generates 200,000 potential friends, the backend cannot computationally send 200,000 rows to the neural network for final ranking. A Min-Heap mathematically slices off the top 100 perfectly.",
    howItWorks: [
      "Initialize a fixed size Min-Heap structure.",
      "Iterate blindly through raw candidates.",
      "If the candidate score violently exceeds the smallest score actively in the heap, eject the minimum and insert the new candidate."
    ],
    whenToUse: "Always mandatory when bridging candidate generation to heavy deep-learning re-rankers.",
    whenNotToUse: "When the payload candidate size is explicitly already smaller than K.",
    complexity: {
      time: 'O(N log K)',
      space: 'O(K)',
      note: 'Significantly faster than O(N log N) total sorts.'
    },
    comparedTo: [
      { algorithmId: "bfs-nhop", tradeoff: "Top-K physically limits data pipelines after algorithms like BFS finish overflowing the active buffers." }
    ],
    pitfalls: [
      "Sorting the entire array completely before slicing, wasting O(N log N) processing time."
    ],
    quiz: [
      {
        type: 'mcq',
        prompt: 'Why use a Min-Heap for a Top-K maximum problem?',
        options: ['A Max-Heap requires extracting K times at the end.', 'The Min-Heap keeps the absolute WEAKEST element of the top 100 exposed at the root, making it instant O(1) to check if a new incoming score deserves to replace it.'],
        correctAnswer: 'The Min-Heap keeps the absolute WEAKEST element of the top 100 exposed at the root, making it instant O(1) to check if a new incoming score deserves to replace it.',
        explanation: 'If the new score beats the root (minimum of the top 100), you execute a log(K) replacement. It guarantees the absolute fastest filtering speed.'
      }
    ],
    pseudocode: `function topK(candidates, K) {\n  heap = MinHeap(size=K)...\n  return heap;\n}`,
    prevId: 'ppr',
    nextId: null
  }
};
