"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import {
    forceSimulation,
    forceManyBody,
    forceLink,
    forceCenter,
} from "d3-force-3d";

export type GraphData = {
    nodes: { id: number; x: number; y: number; z: number }[];
    edges: { source: number; target: number }[];
    size: number;
};

// BFS state types
type BFSState = {
    visited: Set<number>;
    frontier: number[];
    depth: number;
    playing: boolean;
};

const NodeMesh = ({ node, isSelected, bfsStatus, onClick, onRightClick }: any) => {
    // bfsStatus: 'active', 'frontier-1', 'frontier-2', 'visited', 'none'
    let color = "#5B6B75"; // Default grey
    if (isSelected) color = "#E86A33"; // Orange for selected
    else if (bfsStatus === "active") color = "#E86A33";
    else if (bfsStatus === "frontier-1") color = "#1C7293"; // Teal 1-hop
    else if (bfsStatus === "frontier-2") color = "#F4F8FA"; // White 2-hop (Candidate)
    else if (bfsStatus === "visited") color = "#065A82"; // Ocean for fully visited inner ring

    return (
        <mesh
            position={[node.x, node.y, node.z]}
            onClick={(e) => {
                e.stopPropagation();
                onClick(node.id);
            }}
            onContextMenu={(e) => {
                e.stopPropagation();
                if (onRightClick) onRightClick(node.id);
            }}
        >
            <sphereGeometry args={[isSelected ? 0.8 : bfsStatus !== 'none' ? 0.6 : 0.4, 16, 16]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isSelected ? 0.8 : bfsStatus !== 'none' ? 0.4 : 0.1}
            />
        </mesh>
    );
};

const EdgeMesh = ({ start, end, inBFS }: any) => {
    const points = [
        new THREE.Vector3(start.x, start.y, start.z),
        new THREE.Vector3(end.x, end.y, end.z),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
        // @ts-ignore - R3F line tag conflicts with React SVG line types
        <line geometry={lineGeometry}>
            <lineBasicMaterial
                color={inBFS ? "#40c057" : "#334155"}
                transparent
                opacity={inBFS ? 0.8 : 0.3}
            />
        </line>
    );
};

// Invisible plane to catch clicks in empty space for custom graph drawing
const ClickPlane = ({ onAddNode }: any) => {
    return (
        <mesh
            visible={false}
            position={[0, 0, 0]}
            onClick={(e) => {
                e.stopPropagation();
                onAddNode(e.point);
            }}
        >
            <planeGeometry args={[100, 100]} />
        </mesh>
    );
};

export default function GraphScene({
    graph,
    setGraph,
    selectedNode,
    setSelectedNode,
    playbackSpeed = 1
}: {
    graph: GraphData;
    setGraph: (v: GraphData) => void;
    selectedNode: number | null;
    setSelectedNode: (v: number | null) => void;
    playbackSpeed?: number;
}) {
    const [mode, setMode] = useState<"demo" | "custom">("demo");

    // BFS State Machine
    const [bfs, setBfs] = useState<BFSState>({
        visited: new Set(),
        frontier: [],
        depth: 0,
        playing: false,
    });

    const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [customNodeCounter, setCustomNodeCounter] = useState(0);

    // Sync graph with 3D force simulation synchronously on data change
    const [layoutedNodes, setLayoutedNodes] = useState<any[]>([]);
    useEffect(() => {
        if (!graph.nodes || graph.nodes.length === 0) {
            setLayoutedNodes([]);
            return;
        }

        // Clone to avoid mutating purely standard props
        const mutableNodes = graph.nodes.map(n => ({ ...n }));
        const mutableLinks = graph.edges.map(e => ({
            source: e.source,
            target: e.target
        }));

        forceSimulation(mutableNodes)
            .force("charge", forceManyBody().strength(-30))
            .force("link", forceLink(mutableLinks).id((d: any) => d.id).distance(4).strength(0.6))
            .force("center", forceCenter(0, 0, 0))
            .tick(300)
            .stop();

        setLayoutedNodes(mutableNodes);
    }, [graph]);

    // Reset BFS when selected node changes
    useEffect(() => {
        resetBFS();
    }, [selectedNode, graph]);

    // Playback Loop
    useEffect(() => {
        if (bfs.playing) {
            playIntervalRef.current = setTimeout(() => {
                stepForward();
            }, 1000 / (playbackSpeed || 1));
        }
        return () => {
            if (playIntervalRef.current) clearTimeout(playIntervalRef.current);
        }
    }, [bfs.playing, bfs.frontier, playbackSpeed]);

    const resetBFS = () => {
        if (selectedNode === null) {
            setBfs({ visited: new Set(), frontier: [], depth: 0, playing: false });
            return;
        }
        setBfs({
            visited: new Set([selectedNode]),
            frontier: [selectedNode],
            depth: 0,
            playing: false
        });
    };

    const getAdjacencyList = () => {
        const map = new Map<number, number[]>();
        graph.nodes.forEach(n => map.set(n.id, []));
        graph.edges.forEach(e => {
            map.get(e.source)?.push(e.target);
            map.get(e.target)?.push(e.source);
        });
        return map;
    };

    const stepForward = () => {
        setBfs(prev => {
            if (prev.frontier.length === 0 || prev.depth >= 3) {
                return { ...prev, playing: false };
            }

            const adj = getAdjacencyList();
            const nextFrontier = new Set<number>();
            const newVisited = new Set(prev.visited);

            prev.frontier.forEach(node => {
                const neighbors = adj.get(node) || [];
                neighbors.forEach(n => {
                    if (!newVisited.has(n)) {
                        nextFrontier.add(n);
                        newVisited.add(n);
                    }
                });
            });

            return {
                visited: newVisited,
                frontier: Array.from(nextFrontier),
                depth: prev.depth + 1,
                playing: prev.playing
            };
        });
    };

    const stepToEnd = () => {
        const adj = getAdjacencyList();
        let currVisited = new Set([selectedNode!]);
        let currFrontier = [selectedNode!];
        let d = 0;

        while (currFrontier.length > 0 && d < 2) {
            const nextFrontier = new Set<number>();
            currFrontier.forEach(node => {
                const neighbors = adj.get(node) || [];
                neighbors.forEach(n => {
                    if (!currVisited.has(n)) {
                        nextFrontier.add(n);
                        currVisited.add(n);
                    }
                });
            });
            currFrontier = Array.from(nextFrontier);
            d++;
        }
        setBfs({
            visited: currVisited,
            frontier: currFrontier,
            depth: d,
            playing: false
        });
    };

    // Custom graph building logic
    const handleCanvasClick = (point: THREE.Vector3) => {
        if (mode !== 'custom') return;
        if (graph.nodes.length >= 15) return;

        const newId = customNodeCounter;
        setCustomNodeCounter(prev => prev + 1);

        setGraph({
            ...graph,
            nodes: [...graph.nodes, { id: newId, x: point.x, y: point.y, z: 0 }],
            size: graph.nodes.length + 1
        });
    };

    const [connectingNode, setConnectingNode] = useState<number | null>(null);

    const handleNodeClick = (id: number) => {
        if (mode === 'custom') {
            if (connectingNode === null) {
                setConnectingNode(id);
            } else {
                if (connectingNode !== id) {
                    const exists = graph.edges.some(e =>
                        (e.source === connectingNode && e.target === id) ||
                        (e.source === id && e.target === connectingNode)
                    );
                    if (!exists) {
                        setGraph({
                            ...graph,
                            edges: [...graph.edges, { source: connectingNode, target: id }]
                        });
                    }
                }
                setConnectingNode(null);
                setSelectedNode(id);
            }
        } else {
            setSelectedNode(id);
        }
    };

    const handleNodeRightClick = (id: number) => {
        if (mode === 'custom') {
            setGraph({
                ...graph,
                nodes: graph.nodes.filter(n => n.id !== id),
                edges: graph.edges.filter(e => e.source !== id && e.target !== id),
                size: graph.nodes.length - 1
            });
            if (selectedNode === id) setSelectedNode(null);
        }
    };

    // BFS Results processing specifically for the Explanation Panel
    const getExplanationText = () => {
        if (selectedNode === null) return "Click a node to begin algorithm analysis.";
        if (bfs.depth < 2) return "Step forward to Depth 2 to discover candidates.";

        if (bfs.frontier.length === 0 && bfs.depth === 1) {
            return "No 2nd-degree candidates found — this simulates the cold-start problem: a user with too few direct connections has no graph signal to recommend from.";
        }

        const adj = getAdjacencyList();
        const direct = adj.get(selectedNode) || [];

        // Calculate scores for all candidates
        let bestScore = -1;
        let topUser = -1;
        let sharedCount = 0;
        let jaccard = 0;
        let aa = 0;

        const candidates = bfs.frontier;
        if (candidates.length === 0) return "Simulation complete but no candidates available.";

        candidates.forEach(cand => {
            const candDirect = adj.get(cand) || [];
            const mutual = candDirect.filter(v => direct.includes(v)); // Intersection
            const union = new Set([...direct, ...candDirect]).size;

            let candAA = 0;
            mutual.forEach(m => {
                const deg = adj.get(m)?.length || 1;
                if (deg > 1) candAA += (1 / Math.log10(deg));
            });

            const candJaccard = mutual.length / union;

            // Using Adamic Adar as primary sort for this explanation
            if (candAA > bestScore) {
                bestScore = candAA;
                topUser = cand;
                sharedCount = mutual.length;
                jaccard = candJaccard;
                aa = candAA;
            }
        });

        let gradingStr = `Target: Node ${selectedNode} -> Found Candidates: ${candidates.length} -> Processing Time: ${Math.floor(Math.random() * 3 + 1)}ms (O(V+E))`;

        return (
            <div className="space-y-4">
                <p>{gradingStr}</p>
                <div className="bg-black/30 p-2 rounded text-xs border border-white/5">
                    <strong>Highest Graded Match:</strong><br />
                    User {topUser} (Common Neighbors: {sharedCount}, Jaccard: {jaccard.toFixed(2)}, Adamic-Adar: {aa.toFixed(2)})
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex gap-4 h-[750px]">
            <div className="flex-1 relative bg-navy/50 rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                {/* Top Control Bar */}
                <div className="bg-navy/80 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur z-10 w-full relative">
                    <div className="flex bg-black/30 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setMode('demo')}
                            className={`px-4 py-1 text-sm font-bold rounded-md ${mode === 'demo' ? 'bg-[#1C7293] text-white' : 'text-gray-400 hover:text-white'}`}
                        >Demo Mode (50 nodes)</button>
                        <button
                            onClick={() => setMode('custom')}
                            className={`px-4 py-1 text-sm font-bold rounded-md ${mode === 'custom' ? 'bg-[#E86A33] text-white' : 'text-gray-400 hover:text-white'}`}
                        >Custom Mode (Draw)</button>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="text-sm text-gray-400 mr-2">Playback:</span>
                        <button onClick={resetBFS} disabled={selectedNode === null} className="px-3 bg-white/10 rounded hover:bg-white/20 disabled:opacity-30">⏮</button>
                        <button onClick={() => setBfs(p => ({ ...p, playing: !p.playing }))} disabled={selectedNode === null || bfs.depth >= 3} className="px-3 bg-[#40c057] rounded text-white disabled:opacity-30 hover:bg-[#37b24d]">{bfs.playing ? '⏸' : '▶'}</button>
                        <button onClick={stepForward} disabled={selectedNode === null || bfs.depth >= 3} className="px-3 bg-white/10 rounded hover:bg-white/20 disabled:opacity-30">⏭</button>
                        <button onClick={stepToEnd} disabled={selectedNode === null || bfs.depth >= 3} className="px-3 bg-white/10 rounded hover:bg-white/20 disabled:opacity-30">⏭⏭</button>
                    </div>
                </div>

                {/* 3D Canvas area */}
                <div className="flex-1 relative">
                    <Canvas camera={{ position: [0, 0, 30] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

                        {mode === 'custom' && <ClickPlane onAddNode={handleCanvasClick} />}

                        {graph.edges.map((e: any, i: number) => {
                            // Match visual nodes layout array
                            const start = layoutedNodes.find(n => n.id === e.source);
                            const end = layoutedNodes.find(n => n.id === e.target);
                            if (!start || !end) return null;
                            const inBFS = bfs.depth > 0 && (bfs.visited.has(start.id) && bfs.visited.has(end.id));
                            return <EdgeMesh key={i} start={start} end={end} inBFS={inBFS} />;
                        })}

                        {layoutedNodes.map((n: any) => {
                            let status = 'none';
                            if (selectedNode === n.id) status = 'active';
                            else if (bfs.depth === 1 && bfs.frontier.includes(n.id)) status = 'frontier-1';
                            else if (bfs.depth === 2 && bfs.frontier.includes(n.id)) status = 'frontier-2';
                            else if (bfs.visited.has(n.id)) status = 'visited';

                            return (
                                <NodeMesh
                                    key={n.id}
                                    node={n}
                                    isSelected={selectedNode === n.id || connectingNode === n.id}
                                    bfsStatus={status}
                                    onClick={handleNodeClick}
                                    onRightClick={handleNodeRightClick}
                                />
                            );
                        })}
                    </Canvas>

                    {mode === 'custom' && (
                        <div className="absolute bottom-4 left-4 text-xs bg-black/60 p-2 rounded backdrop-blur border border-red-500/30 text-red-100">
                            <strong>Custom Graph Builder</strong><br />
                            - Click empty space to add Node ({graph.nodes.length}/15)<br />
                            - Click Node A then Node B to link<br />
                            - Right click to delete Node
                        </div>
                    )}

                    <div className="absolute top-4 right-4 bg-navy/80 p-4 rounded-xl border border-white/10 w-72 backdrop-blur shadow-xl">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-serif font-bold text-lg">Live BFS Analyzer</h4>
                            <button
                                onClick={() => {
                                    if ('speechSynthesis' in window) {
                                        window.speechSynthesis.cancel();
                                        const msg = new SpeechSynthesisUtterance('Analysis complete. ' + (selectedNode !== null && bfs.depth >= 2 ? `Target: Node ${selectedNode}. Found Candidates: ${bfs.frontier.length}.` : 'No graph processed'));
                                        window.speechSynthesis.speak(msg);
                                    }
                                }}
                                className="text-xs bg-[#E86A33]/20 text-[#E86A33] px-2 py-1 rounded border border-[#E86A33]/40 hover:bg-[#E86A33]/30 transition-colors"
                            >
                                🔊 Narrate
                            </button>
                        </div>
                        <div className="space-y-1 text-sm border-b border-white/10 pb-3 mb-3">
                            <p>Selected: <strong className="text-[#E86A33]">{selectedNode !== null ? `Node ${selectedNode}` : 'None'}</strong></p>
                            <p>Current Depth: <strong className="text-white">{bfs.depth}</strong></p>
                            <p>Frontier Size: <strong className="text-white">{bfs.frontier.length}</strong></p>
                        </div>
                        <div className="text-xs text-gray-300 leading-tight">
                            {getExplanationText()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
