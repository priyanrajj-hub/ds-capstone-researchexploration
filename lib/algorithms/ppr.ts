import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

// Simple seeded RNG for deterministic random walks (LCG)
export function getSeededRandom(seed: number) {
    let z = seed;
    return function () {
        z = (z * 16807) % 2147483647;
        return (z - 1) / 2147483646;
    };
}

export function* personalizedPageRank(
    graph: Graph,
    startNode: string,
    alpha: number = 0.15,
    numWalks: number = 100,
    maxSteps: number = 10,
    seed: number = 42
): Generator<AlgorithmStep, Record<string, number>, unknown> {

    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        highlightNodes: [startNode],
        stepExplanation: `Starting Personalized PageRank (Random Walk with Restart) from ${startNode}. We will simulate multiple "drunk walks" through the graph. The alpha=${alpha} parameter dictates the probability of teleporting back home.`,
        codeLine: 1
    };

    const visits: Record<string, number> = {};
    const rng = getSeededRandom(seed);

    for (let w = 0; w < numWalks; w++) {
        let current = startNode;
        yield {
            stepIndex: 0, totalSteps: 0, action: 'info',
            highlightNodes: [current],
            stepExplanation: `--- Walk ${w + 1}/${numWalks} begins at ${startNode} ---`,
            codeLine: 3
        };

        for (let step = 0; step < maxSteps; step++) {
            visits[current] = (visits[current] || 0) + 1;

            yield {
                stepIndex: 0, totalSteps: 0, action: 'score',
                highlightNodes: [current],
                scores: { ...visits },
                stepExplanation: `Step ${step + 1}: Arrived at ${current}. Incrementing its visit count.`,
                codeLine: 5
            };

            const r = rng();
            if (r < alpha) {
                yield {
                    stepIndex: 0, totalSteps: 0, action: 'highlight',
                    highlightNodes: [startNode],
                    stepExplanation: `Random chance ${r.toFixed(2)} is less than alpha ${alpha}. The walker teleports directly back to the root node ${startNode} to prevent wandering infinitely.`,
                    codeLine: 7
                };
                break;
            }

            const neighbors = graph.neighbors(current);
            if (neighbors.length === 0) {
                yield {
                    stepIndex: 0, totalSteps: 0, action: 'info',
                    stepExplanation: `Node ${current} has zero outward edges. The walk terminates early due to a dead end.`,
                    codeLine: 9
                };
                break; // Dead end
            }

            const nextIdx = Math.floor(rng() * neighbors.length);
            const nextNode = neighbors[nextIdx];
            yield {
                stepIndex: 0, totalSteps: 0, action: 'visit',
                highlightEdges: [{ u: current, v: nextNode }],
                currentNode: current,
                visitedSet: [nextNode],
                stepExplanation: `Random probability roll dictated selecting neighbor ${nextNode} out of ${neighbors.length} options. Moving there now.`,
                codeLine: 11
            };
            current = nextNode;
        }
    }

    // Normalize probabilities against total walks for visualization readability
    for (const node of Object.keys(visits)) {
        visits[node] = visits[node] / numWalks;
    }

    yield {
        stepIndex: 0, totalSteps: 0, action: 'done',
        scores: visits,
        stepExplanation: `Finished. The final scores reflect the structural probability distribution (number of visits / total walks) terminating at each node relative to ${startNode}.`,
        codeLine: 15
    };

    return visits;
}
