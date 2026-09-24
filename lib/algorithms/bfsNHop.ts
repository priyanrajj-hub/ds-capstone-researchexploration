import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* bfsNHop(graph: Graph, startNode: string, maxHop: number): Generator<AlgorithmStep, void, unknown> {
    const visited = new Set<string>();
    const queue: { node: string, hop: number }[] = [];

    if (!graph.getNode(startNode)) {
        yield { type: 'done', message: `Node ${startNode} not found.` };
        return;
    }

    visited.add(startNode);
    queue.push({ node: startNode, hop: 0 });

    yield {
        type: 'info',
        highlightNodes: [startNode],
        message: `Starting BFS at node ${startNode}. Hop level 0.`,
        codeLine: 1
    };

    while (queue.length > 0) {
        const current = queue.shift()!;

        yield {
            type: 'highlight',
            highlightNodes: [current.node],
            message: `Visiting ${current.node} at hop ${current.hop}.`,
            codeLine: 3
        };

        if (current.hop >= maxHop) {
            continue;
        }

        const neighbors = graph.neighbors(current.node);
        for (const neighbor of neighbors) {
            yield {
                type: 'highlight',
                highlightEdges: [{ u: current.node, v: neighbor }],
                message: `Checking edge from ${current.node} to ${neighbor}.`,
                codeLine: 5
            };

            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ node: neighbor, hop: current.hop + 1 });

                yield {
                    type: 'info',
                    highlightNodes: [neighbor],
                    message: `Discovered new node ${neighbor} at hop ${current.hop + 1}. Added to queue.`,
                    codeLine: 7
                };
            } else {
                yield {
                    type: 'info',
                    message: `${neighbor} is already visited. Skipping.`,
                    codeLine: 9
                };
            }
        }
    }

    yield { type: 'done', message: 'BFS traversal complete.' };
}
