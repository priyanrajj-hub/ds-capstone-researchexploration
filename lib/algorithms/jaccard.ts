import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* jaccardSimilarity(graph: Graph, userU: string, userV: string): Generator<AlgorithmStep, number, unknown> {
    yield { type: 'info', highlightNodes: [userU, userV], message: `Calculating Jaccard Similarity between ${userU} and ${userV}.`, codeLine: 1 };

    const neighborsU = new Set(graph.neighbors(userU));
    const neighborsV = new Set(graph.neighbors(userV));

    let intersectionCount = 0;
    for (const n of Array.from(neighborsU)) {
        if (neighborsV.has(n)) {
            intersectionCount++;
            yield { type: 'highlight', highlightNodes: [n], message: `Found common neighbor ${n}. Intersection size: ${intersectionCount}`, codeLine: 4 };
        }
    }

    const unionCount = neighborsU.size + neighborsV.size - intersectionCount;
    yield { type: 'info', message: `Union size is |N(u)| + |N(v)| - |Intersection| = ${neighborsU.size} + ${neighborsV.size} - ${intersectionCount} = ${unionCount}`, codeLine: 7 };

    const jaccard = unionCount === 0 ? 0 : intersectionCount / unionCount;

    yield { type: 'done', message: `Finished. Jaccard Similarity = ${intersectionCount} / ${unionCount} = ${jaccard.toFixed(2)}.`, codeLine: 9 };
    return jaccard;
}
