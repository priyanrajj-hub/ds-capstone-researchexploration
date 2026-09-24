import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* commonNeighbors(graph: Graph, userU: string, userV: string): Generator<AlgorithmStep, number, unknown> {
    yield { type: 'info', highlightNodes: [userU, userV], message: `Calculating Common Neighbors between ${userU} and ${userV}.`, codeLine: 1 };

    const neighborsU = new Set(graph.neighbors(userU));
    const neighborsV = new Set(graph.neighbors(userV));

    yield { type: 'info', message: `${userU} has ${neighborsU.size} neighbors. ${userV} has ${neighborsV.size} neighbors.`, codeLine: 2 };

    let commonCount = 0;
    const commonNodes: string[] = [];

    for (const n of Array.from(neighborsU)) {
        yield { type: 'highlight', highlightNodes: [n], message: `Checking if ${userV} also knows ${n}.`, codeLine: 4 };
        if (neighborsV.has(n)) {
            commonCount++;
            commonNodes.push(n);
            yield {
                type: 'score',
                highlightNodes: [userU, userV, n],
                highlightEdges: [{ u: userU, v: n }, { u: userV, v: n }],
                message: `Yes! ${n} is a common neighbor. Count = ${commonCount}.`,
                codeLine: 6
            };
        }
    }

    yield { type: 'done', highlightNodes: commonNodes, message: `Finished. Total common neighbors: ${commonCount}.`, codeLine: 9 };
    return commonCount;
}
