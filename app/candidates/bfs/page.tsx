"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import PageTemplate from '@/components/PageTemplate';

const GraphScene = dynamic(() => import('@/components/GraphScene'), { ssr: false });

export type GraphData = {
    nodes: { id: number; x: number; y: number; z: number }[];
    edges: { source: number; target: number }[];
    size: number;
};

const generateSyntheticGraph = (nodeCount: number, edgeCount: number): GraphData => {
    let nodes = [];
    let edges = [];
    // Generate scale-free-ish graph
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ id: i, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 });
    }
    for (let i = 0; i < edgeCount; i++) {
        edges.push({
            // Bias towards lower node IDs (preferential attachment simulation)
            source: Math.floor(Math.pow(Math.random(), 2) * nodeCount),
            target: Math.floor(Math.pow(Math.random(), 2) * nodeCount)
        });
    }
    return { nodes, edges, size: nodeCount };
};

export default function CandidateGenerationPage() {
    const [graph, setGraph] = useState<GraphData>(() => generateSyntheticGraph(50, 80));
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    return (
        <PageTemplate
            title="Candidate Generation via BFS"
            definition="Finding 2nd-degree friends without checking the entire planet."
            whyItExists={
                <>
                    <p>
                        A social network might have 3 billion users. If we checked every user against every other user (pairwise) to see who they might know, we would have to compute <strong>{String.fromCharCode(8211)}4.5 quintillion comparisons</strong> every time they log in. That is mathematically impossible.
                    </p>
                    <p>
                        Instead, Breadth-First Search (BFS) bounds the search space. By using the explicit structure of the graph, we only ever look at users who are exactly two "hops" away — the friends of your friends. If someone is 3 hops away, we don't even compute them.
                    </p>
                    <p className="text-[#E86A33]">
                        Click any node below to watch BFS discover its 2nd-degree candidates frame by frame. This IS the algorithm the rest of this page describes.
                    </p>
                </>
            }
            complexity={{ space: "O(V + E)", time: "O(Deg²)" }}
            industryLink="/industry/applications"
            prevPage={{ name: "Matrix vs List", path: "/structures/comparison" }}
            nextPage={{ name: "N-Hop Neighborhoods", path: "/candidates/n-hop" }}
        >
            <div className="w-full bg-black/20 rounded-2xl border border-white/10 p-1">
                <GraphScene
                    graph={graph}
                    setGraph={setGraph}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                />
            </div>
        </PageTemplate>
    );
}
