import { expect, test, describe } from 'vitest';
import { Graph } from './graph';

describe('Graph Engine', () => {
    test('should add nodes and edges and maintain undirected nature', () => {
        const g = new Graph();
        g.addEdge('A', 'B');

        expect(g.neighbors('A')).toContain('B');
        expect(g.neighbors('B')).toContain('A');
        expect(g.degree('A')).toBe(1);
        expect(g.degree('B')).toBe(1);

        // Ensure nodes exist via getNodes
        const nodes = g.getNodes();
        expect(nodes.length).toBe(2);
        expect(g.getNode('A')).toBeDefined();
        expect(g.getNode('B')).toBeDefined();
    });

    test('should remove edges correctly', () => {
        const g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('A', 'C');

        g.removeEdge('A', 'B'); // removing A-B

        expect(g.neighbors('A').length).toBe(1); // C remains
        expect(g.neighbors('A')).toContain('C');
        expect(g.neighbors('B').length).toBe(0);
        expect(g.degree('A')).toBe(1);
        expect(g.degree('B')).toBe(0);
    });

    test('should compute degree correctly for multiple star-like edges', () => {
        const g = new Graph();
        const center = 'C';
        for (let i = 1; i <= 5; i++) {
            g.addEdge(center, `N${i}`);
        }
        expect(g.degree(center)).toBe(5);
        expect(g.degree('N1')).toBe(1);
    });

    test('should handle duplicate edge additions gracefully (overwrite or ignore but keep correct degree)', () => {
        const g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('A', 'B'); // Add again

        // Degree shouldn't arbitrarily increase since neighbors use a Map
        expect(g.degree('A')).toBe(1);
        expect(g.degree('B')).toBe(1);
    });
});
