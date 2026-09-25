import { Graph } from '../graph/graph';
import { AlgorithmStep } from './types';

export function* bfsNHop(graph: Graph, startNode: string, maxHop: number): Generator<AlgorithmStep, void, unknown> {
    const visited = new Set<string>();
    const queue: { node: string, hop: number }[] = [];

    if (!graph.getNode(startNode)) {
        yield { stepIndex: 0, totalSteps: 0, action: 'done', currentNode: startNode, stepExplanation: `Node ${startNode} not found.` };
        return;
    }

    visited.add(startNode);
    queue.push({ node: startNode, hop: 0 });

    yield {
        stepIndex: 0, totalSteps: 0,
        action: 'enqueue',
        currentNode: startNode,
        queueContents: queue.map(q => q.node),
        visitedSet: Array.from(visited),
        highlightNodes: [startNode],
        stepExplanation: `Starting BFS at root node ${startNode}. Added to Queue.`,
        codeLine: 2
    };

    while (queue.length > 0) {
        const current = queue.shift()!;

        yield {
            stepIndex: 0, totalSteps: 0,
            action: 'visit',
            currentNode: current.node,
            queueContents: queue.map(q => q.node),
            visitedSet: Array.from(visited),
            highlightNodes: [current.node],
            stepExplanation: `De-queued ${current.node}. We are currently at hop distance ${current.hop}.`,
            codeLine: 4
        };

        if (current.hop >= maxHop) {
            yield {
                stepIndex: 0, totalSteps: 0,
                action: 'skip',
                currentNode: current.node,
                queueContents: queue.map(q => q.node),
                visitedSet: Array.from(visited),
                highlightNodes: [current.node],
                stepExplanation: `Hop distance is ${current.hop}, which meets our maxHop limit. Terminating exploration from this node to prevent combinatorial explosion.`,
                codeLine: 5
            };
            continue;
        }

        const neighbors = graph.neighbors(current.node);
        for (const neighbor of neighbors) {
            yield {
                stepIndex: 0, totalSteps: 0,
                action: 'visit',
                currentNode: current.node,
                queueContents: queue.map(q => q.node),
                visitedSet: Array.from(visited),
                highlightEdges: [{ u: current.node, v: neighbor }],
                stepExplanation: `Checking neighbor ${neighbor} of current node ${current.node}.`,
                codeLine: 6
            };

            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ node: neighbor, hop: current.hop + 1 });

                yield {
                    stepIndex: 0, totalSteps: 0,
                    action: 'enqueue',
                    currentNode: neighbor,
                    queueContents: queue.map(q => q.node),
                    visitedSet: Array.from(visited),
                    highlightNodes: [neighbor],
                    stepExplanation: `${neighbor} has not been visited before. Adding it to the visited set and the queue for future exploration at hop ${current.hop + 1}.`,
                    codeLine: 9
                };
            } else {
                yield {
                    stepIndex: 0, totalSteps: 0,
                    action: 'skip',
                    currentNode: neighbor,
                    queueContents: queue.map(q => q.node),
                    visitedSet: Array.from(visited),
                    highlightNodes: [neighbor],
                    stepExplanation: `${neighbor} is completely skipped because it was already visited via a much shorter path.`,
                    codeLine: 7
                };
            }
        }
    }

    yield { stepIndex: 0, totalSteps: 0, action: 'done', currentNode: '-', stepExplanation: 'BFS traversal fully completed. Max depth boundaries were respected.' };
}
