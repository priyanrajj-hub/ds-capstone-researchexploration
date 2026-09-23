"use client";
import React, { useState, useEffect } from 'react';

export default function SimulationRace({ graph, selectedNodeId = 7 }: { graph?: any, selectedNodeId?: number | null }) {
    // If graph is provided via props (shared state), use it. Otherwise, defaults handled safely.
    const activeGraph = graph || { list: new Map(), edges: [], size: 50 };

    // Safely parse map from array format if coming from global state
    const getGraphList = () => {
        const m = new Map();
        if (activeGraph.nodes) {
            activeGraph.nodes.forEach((n: any) => m.set(n.id, []));
            activeGraph.edges.forEach((e: any) => {
                m.get(e.source)?.push(e.target);
                m.get(e.target)?.push(e.source);
            });
            return m;
        }
        return activeGraph.list;
    };

    const listMap = getGraphList();
    const activeEdges = activeGraph.nodes ? activeGraph.edges : activeGraph.edges;
    const activeSize = activeGraph.nodes ? activeGraph.nodes.length : activeGraph.size;

    const [isRunning, setIsRunning] = useState(false);

    // Counters
    const [matrixCount, setMatrixCount] = useState(0);
    const [edgeCount, setEdgeCount] = useState(0);
    const [adjCount, setAdjCount] = useState(0);

    const [matrixFinished, setMatrixFinished] = useState(false);
    const [edgeFinished, setEdgeFinished] = useState(false);
    const [adjFinished, setAdjFinished] = useState(false);

    const runSimulation = () => {
        setIsRunning(true);
        setMatrixCount(0); setEdgeCount(0); setAdjCount(0);
        setMatrixFinished(false); setEdgeFinished(false); setAdjFinished(false);

        const targetNode = selectedNodeId !== null ? selectedNodeId : 0;

        // Simulate Adjacency List (Instant jump O(degree))
        const neighbors = listMap.get(targetNode) || [];
        let listLocalCount = 1; // Jump to bucket
        setTimeout(() => {
            setAdjCount(listLocalCount + neighbors.length); // Jump to each neighbor's bucket
            setAdjFinished(true);
        }, 300);

        // Simulate Edge List (Scan all edges O(E), twice for 2-hop)
        const totalEdges = activeEdges.length;
        let edgeLocalCount = 0;
        const edgeTimer = setInterval(() => {
            edgeLocalCount += Math.max(1, Math.floor(totalEdges / 20)); // Accelerate visuals
            if (edgeLocalCount >= totalEdges + (neighbors.length * totalEdges)) {
                edgeLocalCount = totalEdges + (neighbors.length * totalEdges);
                clearInterval(edgeTimer);
                setEdgeFinished(true);
            }
            setEdgeCount(edgeLocalCount);
        }, 50);

        // Simulate Matrix (Scan all V, then V for each neighbor)
        const totalCells = activeSize * activeSize;
        let matrixLocalCount = 0;
        const matrixTimer = setInterval(() => {
            matrixLocalCount += Math.max(50, Math.floor(totalCells / 20)); // Scan rapidly
            const targetCells = activeSize + (neighbors.length * activeSize);
            if (matrixLocalCount >= targetCells) {
                matrixLocalCount = targetCells;
                clearInterval(matrixTimer);
                setMatrixFinished(true);
            }
            setMatrixCount(matrixLocalCount);
        }, 50);

        setTimeout(() => { if (!matrixFinished) setIsRunning(false); }, 3000); // Failsafe
    };

    if (!graph || graph.nodes.length === 0) return null;

    return (
        <div className="bg-black/30 p-8 rounded-2xl border border-white/10 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold font-serif text-white">Live Time-Complexity Race</h3>
                    <p className="text-gray-400">Finding 2nd-Degree friends for <strong className="text-[#E86A33]">Node {selectedNodeId !== null ?`#${selectedNodeId}` : '(Unselected)'}</strong></p>
                </div>
                <button
                    onClick={runSimulation}
                    disabled={(isRunning && (!matrixFinished || !edgeFinished || !adjFinished)) || selectedNodeId === null}
                    className="px-6 py-3 bg-[#40c057] text-white font-bold rounded-lg hover:bg-[#37b24d] transition shadow-lg disabled:opacity-50"
                >
                    {selectedNodeId === null ? 'Select Node Above To Race' : '▶ Run Live Simulation'}
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Adjacency Matrix */}
                <div className="bg-navy/40 p-6 rounded-xl border border-white/5 relative">
                    <h4 className="font-bold text-gray-200 mb-2">Adjacency Matrix</h4>
                    <div className="h-32 w-full grid grid-cols-10 grid-rows-10 gap-0.5 opacity-50 mb-4 bg-black/50 p-2 rounded overflow-hidden">
                        {Array.from({ length: Math.min(100, activeSize * activeSize) }).map((_, i) => (
                            <div key={i} className={`w-full h-full rounded-sm ${isRunning && !matrixFinished && i < (matrixCount % 100) ? 'bg-red-500' : 'bg-gray-700'}`} />
                        ))}
                    </div>
                    <div className="text-3xl font-bold text-red-400">{matrixCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Cells Scanned</div>
                    {matrixFinished && <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold text-red-200 text-xl">Loss (O(V))</div>}
                </div>

                {/* Edge List */}
                <div className="bg-navy/40 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                    <h4 className="font-bold text-gray-200 mb-2">Edge List</h4>
                    <div className="h-32 w-full flex flex-col gap-1 overflow-hidden opacity-50 mb-4 bg-black/50 p-2 rounded">
                        {activeEdges.slice(0, 15).map((e: any, i: number) => (
                            <div key={i} className={`w-full h-2 rounded-sm ${isRunning && !edgeFinished && i < (edgeCount % 15) ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                        ))}
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">{edgeCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Rows Scanned</div>
                    {edgeFinished && <div className="absolute inset-0 bg-yellow-900/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold text-yellow-200 text-xl">Loss (O(E))</div>}
                </div>

                {/* Adjacency List */}
                <div className="bg-navy/40 p-6 rounded-xl border border-white/5 relative">
                    <h4 className="font-bold text-gray-200 mb-2">Adjacency List (Map)</h4>
                    <div className="h-32 w-full flex items-center justify-center opacity-80 mb-4 bg-black/50 p-2 rounded">
                        <div className={`w-16 h-16 rounded-full border-4 border-[#40c057] flex items-center justify-center ${isRunning ? 'scale-110 shadow-[0_0_20px_#40c057]' : ''} transition-all`}>
                        <span className="font-bold text-[#40c057]">#{selectedNodeId !== null ? selectedNodeId : '?'}</span>
                    </div>
                </div>
                <div className="text-3xl font-bold text-[#40c057]">{adjCount.toLocaleString()}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Buckets Jumped</div>
                {adjFinished && <div className="absolute inset-0 border-2 border-[#40c057] rounded-xl flex items-center justify-center space-y-4 flex-col bg-green-900/10 pointer-events-none">
                    <div className="font-bold text-[#40c057] text-2xl animate-bounce">WINNER</div>
                </div>}
            </div>
        </div>

            {
        matrixFinished && edgeFinished && adjFinished && (
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-lg text-gray-300">
                Same computational target running against the identical active dataset, <strong className="text-red-400">{(matrixCount / Math.max(1, adjCount)).toFixed(0)}×</strong> more work on a matrix, <strong className="text-yellow-400">{(edgeCount / Math.max(1, adjCount)).toFixed(0)}×</strong> more on a flat SQL list — <strong className="text-white">proving explicitly why the Industry relies on Graph topology mapping.</strong>
            </div>
        )
    }
        </div >
    );
}
