import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* adamicAdar(graph: Graph, userU: string, userV: string): Generator<AlgorithmStep, number, unknown> {
    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        highlightNodes: [userU, userV],
        stepExplanation: `Calculating Adamic-Adar between ${userU} and ${userV}. This prioritizes rare, highly-specific common connections over popular hubs.`,
        codeLine: 1
    };

    const neighborsU = new Set(graph.neighbors(userU));
    const neighborsV = new Set(graph.neighbors(userV));

    let score = 0;
    const currentScores: Record<string, number> = {};

    for (const n of Array.from(neighborsU)) {
        if (neighborsV.has(n)) {
            const degree = graph.degree(n);
            if (degree <= 1) {
                yield {
                    stepIndex: 0, totalSteps: 0, action: 'skip',
                    stepExplanation: `Common neighbor ${n} has degree ${degree}, skipping to avoid numerical instability (div by zero/negative log).`,
                    codeLine: 4
                };
                continue;
            }

            const contribution = 1 / Math.log(degree);
            score += contribution;
            currentScores[n] = contribution;

            yield {
                stepIndex: 0, totalSteps: 0, action: 'score',
                highlightNodes: [n],
                scores: { ...currentScores },
                stepExplanation: `${n} is a common neighbor. Its degree is ${degree}, so its Adamic-Adar weight is 1/ln(${degree}) = ${contribution.toFixed(2)}. Aggregate score ≈ ${score.toFixed(2)}.`,
                codeLine: 5
            };
        } else {
            yield {
                stepIndex: 0, totalSteps: 0, action: 'skip',
                highlightNodes: [n],
                stepExplanation: `${n} is not a common neighbor.`,
                codeLine: 8
            };
        }
    }

    yield {
        stepIndex: 0, totalSteps: 0, action: 'done',
        stepExplanation: `Finished. Final Adamic-Adar summation score: ${score.toFixed(2)}.`,
        codeLine: 9
    };
    return score;
}
