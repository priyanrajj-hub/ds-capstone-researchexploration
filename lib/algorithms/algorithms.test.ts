import { expect, test, describe } from 'vitest';
import { getTinyTutorialGraph } from '../graph/sample-graphs';
import { commonNeighbors } from './commonNeighbors';
import { jaccardSimilarity } from './jaccard';
import { adamicAdar } from './adamicAdar';

function runGeneratorToEnd<T>(gen: Generator<any, T, unknown>): T {
    let result = gen.next();
    while (!result.done) {
        result = gen.next();
    }
    return result.value as T;
}

describe('Graph Algorithms (Prompt 2 Tests)', () => {
    const g = getTinyTutorialGraph();

    test('Common Neighbors of A and X should be 3 (B, C, D)', () => {
        const cn = runGeneratorToEnd(commonNeighbors(g, 'A', 'X'));
        expect(cn).toBe(3);
    });

    test('Jaccard Similarity of A and Y should be 0.33', () => {
        // A's neighbors: B, C, D
        // Y's neighbors: D
        // Intersection: D (1)
        // Union: B, C, D (3) => 1/3 = 0.333
        const jq = runGeneratorToEnd(jaccardSimilarity(g, 'A', 'Y'));
        expect(jq).toBeCloseTo(0.333, 2);
    });

    test('Adamic-Adar of A and X should be approx 3.51', () => {
        // Mutuals of A and X: B, C, D
        // B degree: 2 (A, X)
        // C degree: 2 (A, X)
        // D degree: 5 (A, X, Y, Z, W)
        // 1/ln(2) + 1/ln(2) + 1/ln(5) = 1.442 + 1.442 + 0.621 = 3.505
        const aa = runGeneratorToEnd(adamicAdar(g, 'A', 'X'));
        expect(aa).toBeCloseTo(3.505, 1); // allow some rounding leeway
    });
});
