import { Graph } from './graph';

export function getTinyTutorialGraph(): Graph {
    const g = new Graph();
    const edges = [
        ['A', 'B'], ['A', 'C'], ['A', 'D'],
        ['B', 'X'], ['C', 'X'], ['D', 'X'],
        ['D', 'Y'], ['D', 'Z'], ['D', 'W']
    ];
    edges.forEach(([u, v]) => g.addEdge(u, v));
    return g;
}

export function getCommunityGraph(): Graph {
    const g = new Graph();
    // Generate 30 node community
    for (let i = 1; i <= 15; i++) {
        for (let j = i + 1; j <= 15; j++) {
            // 30% density inside community 1
            if (Math.random() < 0.3) g.addEdge(`C1_${i}`, `C1_${j}`);
        }
    }
    for (let i = 16; i <= 30; i++) {
        for (let j = i + 1; j <= 30; j++) {
            // 30% density inside community 2
            if (Math.random() < 0.3) g.addEdge(`C2_${i}`, `C2_${j}`);
        }
    }
    // Bridge between communities
    g.addEdge('C1_1', 'C2_16');
    return g;
}

export function getHubAndSpokeGraph(): Graph {
    const g = new Graph();
    const hub = 'HUB';
    for (let i = 1; i <= 15; i++) {
        g.addEdge(hub, `SPOKE_${i}`);
    }
    return g;
}
