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

    yield { type: 'info', highlightNodes: [startNode], message: `Starting Personalized PageRank from ${startNode} with alpha=${alpha} (teleport probability).`, codeLine: 1 };

    const visits: Record<string, number> = {};
    const rng = getSeededRandom(seed);

    for (let w = 0; w < numWalks; w++) {
        let current = startNode;
        yield { type: 'info', highlightNodes: [current], message: `--- Walk ${w + 1}/${numWalks} ---`, codeLine: 3 };

        for (let step = 0; step < maxSteps; step++) {
            visits[current] = (visits[current] || 0) + 1;
            yield { type: 'highlight', highlightNodes: [current], scores: { ...visits }, message: `Visiting ${current}. Adding to visit count.`, codeLine: 5 };

            const r = rng();
            if (r < alpha) {
                yield { type: 'info', message: `Random value ${r.toFixed(2)} < alpha. Teleporting back to start node ${startNode}.`, codeLine: 7 };
                break;
            }

            const neighbors = graph.neighbors(current);
            if (neighbors.length === 0) {
                yield { type: 'info', message: `Node ${current} has no neighbors. Ending walk early.`, codeLine: 9 };
                break; // Dead end
            }

            const nextIdx = Math.floor(rng() * neighbors.length);
            const nextNode = neighbors[nextIdx];
            yield { type: 'highlight', highlightEdges: [{ u: current, v: nextNode }], message: `Choosing random neighbor ${nextNode}.`, codeLine: 11 };
            current = nextNode;
        }
    }

    for (const node of Object.keys(visits)) {
        visits[node] = visits[node] / numWalks;
    }

    yield { type: 'done', scores: visits, message: `Finished. Shows probability distribution (visit count / numWalks) initialized from ${startNode}.`, codeLine: 15 };

    return visits;
}
