export interface AlgorithmContent {
    id: string; // e.g., 'bfs-nhop'
    title: string;
    intuition: string;
    pseudocode: string;
    complexity: {
        time: string;
        space: string;
    };
    whenItFails: string;
    workedExample: string;
    prevId: string | null;
    nextId: string | null;
}

export const ALGORITHM_DATA: Record<string, AlgorithmContent> = {
    'bfs-nhop': {
        id: 'bfs-nhop',
        title: 'BFS N-Hop (Friends-of-Friends)',
        intuition: "The simplest form of candidate generation. Start at the user, explore their direct connections (1-hop), and then explore the connections of those connections (2-hop). Triadic closure ensures this is highly effective.",
        pseudocode: `function bfsNHop(startNode, maxHop) {
  queue.push({node: startNode, hop: 0});
  while (queue is not empty) {
    curr = queue.pop();
    if (curr.hop >= maxHop) continue;
    for (neighbor of curr.neighbors) {
      if (not visited) {
        visited.add(neighbor);
        queue.push({node: neighbor, hop: curr.hop + 1});
      }
    }
  }
}`,
        complexity: { time: 'O(d^k) where d is avg degree, k is hop depth', space: 'O(d^k) Queue size' },
        whenItFails: "Explodes practically on celebrity hubs. If user follows Justin Bieber, BFS adds all 100M Bieber followers to the queue, exhausting RAM and time.",
        workedExample: "Start A. Hop 1: B, C, D. Hop 2 (candidates): X, Y, Z, W.",
        prevId: null,
        nextId: 'common-neighbors'
    },
    'common-neighbors': {
        id: 'common-neighbors',
        title: 'Common Neighbors',
        intuition: "The simplest scoring heuristic. If you share 5 friends with someone, you are more likely to know them than someone with whom you share 1 friend.",
        pseudocode: `function commonNeighbors(u, v) {
  let count = 0;
  for (n of neighbors(u)) {
    if (neighbors(v).has(n)) {
      count++;
    }
  }
  return count;
}`,
        complexity: { time: 'O(|N(u)|) assuming hash set lookup for N(v)', space: 'O(|N(v)|)' },
        whenItFails: "Biased by degree. If you share one massive celebrity with someone, it counts as 1. If you share one obscure niche hobbyist friend, it also counts as 1. Doesn't distinguish quality.",
        workedExample: "A's friends: {B,C,D}. X's friends: {B,C,D}. Intersection size is 3.",
        prevId: 'bfs-nhop',
        nextId: 'jaccard'
    },
    'jaccard': {
        id: 'jaccard',
        title: 'Jaccard Similarity',
        intuition: "Normalizes the Common Neighbors score by dividing by the total distinct friends both people have. This penalizes pairs where one person has a massive number of friends.",
        pseudocode: `function jaccard(u, v) {
  intersect = n(u) AND n(v)
  union = n(u) OR n(v)
  return intersect.size / union.size
}`,
        complexity: { time: 'O(|N(u)| + |N(v)|)', space: 'O(|N(u)| + |N(v)|)' },
        whenItFails: "Still treats all mutual connections identically regardless of their popularity. Still struggles with massive hubs indirectly.",
        workedExample: "A has 3 friends, Y has 1 friend (D). Intersection=1. Union=3+1-1=3. Score = 1/3 = 0.33.",
        prevId: 'common-neighbors',
        nextId: 'adamic-adar'
    },
    'adamic-adar': {
        id: 'adamic-adar',
        title: 'Adamic-Adar',
        intuition: "Weights common friends inversely to their popularity. Sharing an obscure mutual friend is a much stronger signal of real-world closeness than sharing Barack Obama.",
        pseudocode: `function adamicAdar(u, v) {
  score = 0;
  for (n of intersection(n(u), n(v))) {
    score += 1 / Math.log(degree(n));
  }
  return score;
}`,
        complexity: { time: 'O(|N(u)|)', space: 'O(|N(v)|) for hash set' },
        whenItFails: "Can produce infinity if a mutual friend has degree 1 (though practically mutual friends have degree >=2). Less interpretable raw score than Jaccard.",
        workedExample: "A and X share B, C, D. B has 2 friends, C has 2, D has 5. Score = 1/ln2 + 1/ln2 + 1/ln5 = 1.44 + 1.44 + 0.62 = 3.5.",
        prevId: 'jaccard',
        nextId: 'ppr'
    },
    'ppr': {
        id: 'ppr',
        title: 'Personalized PageRank (Random Walks)',
        intuition: "Runs random walks starting from you. At each step, it either walks to a random friend, or teleports back to you. The most frequently visited nodes are your top recommendations. Foundational to Pinterest Pixie and Twitter.",
        pseudocode: `function ppr(start, alpha, numWalks, maxSteps) {
  visits = {}
  for i to numWalks:
    curr = start
    for step to maxSteps:
      visits[curr]++
      if random() < alpha: break // teleport
      curr = randomNeighbor(curr)
  return visits / numWalks
}`,
        complexity: { time: 'O(W * S) Walks * Steps', space: 'O(V) to store visit counts' },
        whenItFails: "Requires heavy compute at scale. Usually approximated (e.g. Monte Carlo or push algorithm) because running exact PageRank for every user is O(V^2).",
        workedExample: "With teleport alpha=0.15, walkers tend to stay tightly clustered around the start node's local neighborhood, naturally emphasizing close communities.",
        prevId: 'adamic-adar',
        nextId: 'top-k-heap'
    },
    'top-k-heap': {
        id: 'top-k-heap',
        title: 'Top-K Min-Heap',
        intuition: "Once millions of scores are calculated, we only want the top 100 to send to the heavy ranker. Sorting a million items is O(N log N). Keeping a min-heap of size K is O(N log K).",
        pseudocode: `function topK(candidates, K) {
  heap = MinHeap(size=K)
  for c in candidates:
    if heap.size < K:
      heap.push(c)
    else if c.score > heap.min():
      heap.popMin()
      heap.push(c)
  return heap
}`,
        complexity: { time: 'O(N log K)', space: 'O(K)' },
        whenItFails: "Fails in distributed settings without map-reduce. Single machine heap takes too long if N is in the billions.",
        workedExample: "K=3. Insertions: 5, 2, 8 (Heap: 2, 5, 8). Insert 9 (replaces 2 -> Heap: 5, 8, 9). Insert 1 (ignored).",
        prevId: 'ppr',
        nextId: null
    }
};
