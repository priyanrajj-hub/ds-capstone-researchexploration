import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* jaccardSimilarity(graph: Graph, userU: string, userV: string): Generator<AlgorithmStep, number, unknown> {
    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        highlightNodes: [userU, userV],
        stepExplanation: `Calculating Jaccard Similarity between ${userU} and ${userV}. We need Intersection / Union.`,
        codeLine: 1
    };

    const neighborsU = new Set(graph.neighbors(userU));
    const neighborsV = new Set(graph.neighbors(userV));

    let intersectionCount = 0;
    const currentScores: Record<string, number> = {};

    for (const n of Array.from(neighborsU)) {
        if (neighborsV.has(n)) {
            intersectionCount++;
            currentScores[n] = 1;
            yield {
                stepIndex: 0, totalSteps: 0, action: 'highlight',
                highlightNodes: [n],
                scores: { ...currentScores },
                stepExplanation: `Found common neighbor ${n}. Intersection size increases to: ${intersectionCount}`,
                codeLine: 4
            };
        } else {
            yield {
                stepIndex: 0, totalSteps: 0, action: 'skip',
                highlightNodes: [n],
                stepExplanation: `${n} is not a common neighbor. Moving on.`,
                codeLine: 5
            };
        }
    }

    const unionCount = neighborsU.size + neighborsV.size - intersectionCount;
    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        stepExplanation: `We calculate the Union size geometrically: |N(u)| + |N(v)| - |Intersection|. ${neighborsU.size} + ${neighborsV.size} - ${intersectionCount} = ${unionCount}`,
        codeLine: 7
    };

    const jaccard = unionCount === 0 ? 0 : intersectionCount / unionCount;

    yield {
        stepIndex: 0, totalSteps: 0, action: 'done',
        stepExplanation: `Finished. Jaccard Similarity = Intersection (${intersectionCount}) / Union (${unionCount}) = ${jaccard.toFixed(2)}.`,
        codeLine: 9
    };
    return jaccard;
}
