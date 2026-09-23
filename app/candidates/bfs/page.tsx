"use client";
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
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
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ id: i, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 });
    }
    for (let i = 0; i < edgeCount; i++) {
        edges.push({
            source: Math.floor(Math.pow(Math.random(), 2) * nodeCount),
            target: Math.floor(Math.pow(Math.random(), 2) * nodeCount)
        });
    }
    return { nodes, edges, size: nodeCount };
};

const facebookDenseGraph = () => generateSyntheticGraph(50, 200); // 50 nodes, 200 edges (highly interconnected)
const linkedinSparseGraph = () => generateSyntheticGraph(50, 60); // 50 nodes, 60 edges (long sparse chains)

function BFSToolbarControls() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Init state from URL if present
    const initMode = searchParams.get('mode') || 'sparse';
    const initNodes = Number(searchParams.get('nodes')) || 50;
    const initSpeed = Number(searchParams.get('speed')) || 1;

    const [graphType, setGraphType] = useState<string>(initMode);
    const [graph, setGraph] = useState<GraphData>(
        initMode === 'dense' ? facebookDenseGraph() :
            initMode === 'sparse' ? linkedinSparseGraph() :
                { nodes: [], edges: [], size: 0 } // custom handled below
    );
    const [selectedNode, setSelectedNode] = useState<number | null>(null);
    const [speed, setSpeed] = useState<number>(initSpeed);

    const [customCsv, setCustomCsv] = useState("0,1\n1,2\n2,3\n1,4");

    // Sync state to URL without refreshing page
    useEffect(() => {
        const query = new URLSearchParams();
        query.set('mode', graphType);
        query.set('nodes', graphType === 'custom' ? graph.size.toString() : '50');
        query.set('speed', speed.toString());
        router.replace(`?${query.toString()}`, { scroll: false });
    }, [graphType, graph.size, speed, router]);

    const handleLoadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setGraphType(val);
        setSelectedNode(null);
        if (val === 'dense') setGraph(facebookDenseGraph());
        if (val === 'sparse') setGraph(linkedinSparseGraph());
    };

    const handleRenderCsv = () => {
        const lines = customCsv.trim().split('\n');
        const nodesSet = new Set<string>();
        const parsedEdges: { source: string, target: string }[] = [];

        lines.forEach(l => {
            const parts = l.split(',');
            if (parts.length >= 2) {
                const s = parts[0].trim();
                const t = parts[1].trim();
                nodesSet.add(s);
                nodesSet.add(t);
                parsedEdges.push({ source: s, target: t });
            }
        });

        const idMap = Array.from(nodesSet);
        const nodeArr = idMap.map((id, idx) => ({ id: idx, label: id, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 }));

        const edgeArr = parsedEdges.map(e => ({
            source: idMap.indexOf(e.source),
            target: idMap.indexOf(e.target)
        }));

        setGraph({ nodes: nodeArr, edges: edgeArr, size: nodeArr.length });
        setSelectedNode(null);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center bg-black/30 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col w-48">
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1">Graph Simulation</label>
                    <select
                        value={graphType}
                        onChange={handleLoadPreset}
                        className="bg-navy border border-[#1C7293] p-2 rounded text-sm text-gray-200 outline-none"
                    >
                        <option value="sparse">Load Example: LinkedIn (Sparse)</option>
                        <option value="dense">Load Example: Facebook (Dense)</option>
                        <option value="custom">Custom Mode (CSV)</option>
                    </select>
                </div>
                <div className="flex flex-col w-32">
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1">Playback Speed</label>
                    <select
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="bg-navy border border-white/20 p-2 rounded text-sm text-gray-200 outline-none"
                    >
                        <option value={0.5}>0.5x Slower</option>
                        <option value={1}>1x Normal</option>
                        <option value={2}>2x Faster</option>
                    </select>
                </div>
                <div className="flex flex-col flex-1 pl-4 border-l border-white/10">
                    <p className="text-xs text-gray-400">
                        Share this exact simulation state:
                        <span className="ml-2 px-2 py-1 bg-black/50 rounded font-mono text-[#40c057]">
                            ?mode={graphType}&amp;nodes={graphType === 'custom' ? graph.size : '50'}&amp;speed={speed}
                        </span>
                    </p>
                </div>
            </div>

            {graphType === 'custom' && (
                <div className="bg-black/20 p-4 rounded-lg flex gap-4 border border-[#E86A33]/30">
                    <textarea
                        className="flex-1 bg-black/40 border border-white/10 rounded p-2 text-sm font-mono text-gray-300 h-24 focus:border-[#E86A33] outline-none"
                        value={customCsv}
                        onChange={(e) => setCustomCsv(e.target.value)}
                        placeholder="0,1\n1,2"
                    />
                    <button
                        onClick={handleRenderCsv}
                        className="bg-[#E86A33] hover:bg-[#d4561f] text-white px-6 py-2 rounded font-bold h-max mt-auto transition-colors"
                    >
                        Render Raw Data
                    </button>
                </div>
            )}

            <div className="w-full bg-black/20 rounded-2xl border border-white/10 p-1">
                <GraphScene
                    graph={graph}
                    setGraph={setGraph}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    playbackSpeed={speed}
                />
            </div>
        </div>
    );
}

export default function CandidateGenerationPage() {
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
                        Select "Facebook" or "LinkedIn", manipulate the speed, or paste a raw CSV. The URL updates instantly so you can export your findings for grading.
                    </p>
                </>
            }
            complexity={{ space: "O(V + E)", time: "O(Deg²)" }}
            industryLink="/industry/applications"
            prevPage={{ name: "Matrix vs List", path: "/structures/comparison" }}
            nextPage={{ name: "N-Hop Neighborhoods", path: "/candidates/n-hop" }}
        >
            <Suspense fallback={<div className="h-[750px] flex items-center justify-center">Loading simulation...</div>}>
                <BFSToolbarControls />
            </Suspense>
        </PageTemplate>
    );
}
