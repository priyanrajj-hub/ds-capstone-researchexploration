import { describe, it, expect } from 'vitest';
import { Graph } from '../lib/graph/graph';
import { bfsNHop } from '../lib/algorithms/bfs';

describe('Algorithm Generators', () => {
    it('should generate valid BFS N-hop steps', () => {
        const g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('B', 'C');

        const generator = bfsNHop(g, 'A', 2);

        const step1 = generator.next().value;
        expect(step1).toBeDefined();
        expect(step1.type).toBe('info');
        // Because generator yields an initialization info step first

        const step2 = generator.next().value;
        expect(step2?.type).toBe('visit');
        expect(step2?.currentNode).toBe('A');
    });
});
