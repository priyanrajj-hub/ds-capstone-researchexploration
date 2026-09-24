import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* adamicAdar(graph: Graph, userU: string, userV: string): Generator<AlgorithmStep, number, unknown> {
    yield { type: 'info', highlightNodes: [userU, userV], message: `Calculating Adamic-Adar between ${userU} and ${userV}.`, codeLine: 1 };

    const neighborsU = new Set(graph.neighbors(userU));
    const neighborsV = new Set(graph.neighbors(userV));

    let score = 0;

    for (const n of Array.from(neighborsU)) {
        if (neighborsV.has(n)) {
            const degree = graph.degree(n);
            if (degree <= 1) {
                yield { type: 'info', message: `Common neighbor ${n} has degree ${degree}, skipping to avoid div by zero/neg.`, codeLine: 4 };
                continue;
            }

            const contribution = 1 / Math.log(degree);
            score += contribution;

            yield {
                type: 'score',
                highlightNodes: [n],
                message: `${n} has degree ${degree}, so its contribution 1/ln${degree} = ${contribution.toFixed(2)}. Running score ≈ ${score.toFixed(2)}.`,
                codeLine: 5
            };
        }
    }

    yield { type: 'done', message: `Finished. Final Adamic-Adar score: ${score.toFixed(2)}.`, codeLine: 9 };
    return score;
}
