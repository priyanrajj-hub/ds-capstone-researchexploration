import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* commonNeighbors(graph: Graph, userU: string, userV: string): Generator<AlgorithmStep, number, unknown> {
    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        highlightNodes: [userU, userV],
        stepExplanation: `Calculating Common Neighbors between ${userU} and ${userV}. We will scan neighbors of U and see if they know V.`,
        codeLine: 1
    };

    const neighborsU = new Set(graph.neighbors(userU));
    const neighborsV = new Set(graph.neighbors(userV));

    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        stepExplanation: `Retrieved neighbors. ${userU} has ${neighborsU.size} neighbors. ${userV} has ${neighborsV.size} neighbors.`,
        codeLine: 2
    };

    let commonCount = 0;
    const commonNodes: string[] = [];
    const currentScores: Record<string, number> = {};

    for (const n of Array.from(neighborsU)) {
        yield {
            stepIndex: 0, totalSteps: 0, action: 'highlight',
            highlightNodes: [n],
            stepExplanation: `Checking if ${userV} also knows ${n}.`,
            codeLine: 4
        };
        if (neighborsV.has(n)) {
            commonCount++;
            commonNodes.push(n);
            currentScores[n] = 1;
            yield {
                stepIndex: 0, totalSteps: 0, action: 'score',
                highlightNodes: [userU, userV, n],
                highlightEdges: [{ u: userU, v: n }, { u: userV, v: n }],
                scores: { ...currentScores },
                stepExplanation: `Match confirmed! ${n} is a mutual connection. Our common neighbor count is now ${commonCount}.`,
                codeLine: 6
            };
        } else {
            yield {
                stepIndex: 0, totalSteps: 0, action: 'skip',
                highlightNodes: [n],
                stepExplanation: `${n} is isolated from ${userV}. Skipping.`,
                codeLine: 7
            };
        }
    }

    yield {
        stepIndex: 0, totalSteps: 0, action: 'done',
        highlightNodes: commonNodes,
        stepExplanation: `Finished. Total common neighbors: ${commonCount}. Final Score = ${commonCount}.`,
        codeLine: 9
    };
    return commonCount;
}
