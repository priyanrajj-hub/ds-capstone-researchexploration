import { GraphNode } from './types';

export class Graph {
    private nodes: Map<string, GraphNode> = new Map();
    private adjacencyList: Map<string, Map<string, number>> = new Map();

    constructor() { }

    addNode(node: GraphNode): void {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node);
            this.adjacencyList.set(node.id, new Map());
        }
    }

    addEdge(u: string, v: string, weight: number = 1): void {
        if (!this.nodes.has(u)) {
            this.addNode({ id: u, label: u });
        }
        if (!this.nodes.has(v)) {
            this.addNode({ id: v, label: v });
        }

        // Undirected graph logic for social network relationships
        this.adjacencyList.get(u)!.set(v, weight);
        this.adjacencyList.get(v)!.set(u, weight);
    }

    removeEdge(u: string, v: string): void {
        if (this.adjacencyList.has(u)) {
            this.adjacencyList.get(u)!.delete(v);
        }
        if (this.adjacencyList.has(v)) {
            this.adjacencyList.get(v)!.delete(u);
        }
    }

    neighbors(u: string): string[] {
        if (!this.adjacencyList.has(u)) return [];
        return Array.from(this.adjacencyList.get(u)!.keys());
    }

    degree(u: string): number {
        return this.neighbors(u).length;
    }

    getNode(u: string): GraphNode | undefined {
        return this.nodes.get(u);
    }

    getNodes(): GraphNode[] {
        return Array.from(this.nodes.values());
    }

    getEdgeWeight(u: string, v: string): number {
        if (!this.adjacencyList.has(u)) return 0;
        return this.adjacencyList.get(u)!.get(v) ?? 0;
    }
}
