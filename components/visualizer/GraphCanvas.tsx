import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Graph } from '../../lib/graph/graph';
import { AlgorithmStep } from '../../lib/algorithms/types';
import { Box, Layers } from 'lucide-react';

const ForceGraph3DWrapper = dynamic(() => import('./ForceGraphWrapper'), { ssr: false });

interface GraphCanvasProps {
    graph: Graph;
    onGraphChange?: () => void;
    currentStep?: AlgorithmStep | null;
    onNodeClick?: (nodeId: string) => void;
}

export function GraphCanvas({ graph, onGraphChange, currentStep, onNodeClick }: GraphCanvasProps) {
    const [, setTick] = useState(0);
    const [dragNode, setDragNode] = useState<string | null>(null);
    const [edgeDrawStart, setEdgeDrawStart] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [is3D, setIs3D] = useState(false);

    useEffect(() => {
        // Default to 2D on mobile or reduced motion
        if (typeof window !== 'undefined') {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isMobile = window.innerWidth < 768;
            setIs3D(!(prefersReduced || isMobile));
        }
    }, []);

    useEffect(() => {
        graph.getNodes().forEach((n, i) => {
            if (n.x === undefined || n.y === undefined) {
                n.x = 400 + 150 * Math.cos(2 * Math.PI * i / graph.getNodes().length);
                n.y = 250 + 150 * Math.sin(2 * Math.PI * i / graph.getNodes().length);
            }
        });
        setTick(t => t + 1);
    }, [graph]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.detail === 2 && svgRef.current) {
            const pt = svgRef.current.createSVGPoint();
            pt.x = e.clientX; pt.y = e.clientY;
            const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
            const newId = `N${graph.getNodes().length + 1}`;
            graph.addNode({ id: newId, label: newId, x: svgP.x, y: svgP.y });
            onGraphChange?.();
            setTick(t => t + 1);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!svgRef.current) return;
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
        setMousePos({ x: svgP.x, y: svgP.y });

        if (dragNode) {
            const n = graph.getNode(dragNode);
            if (n) {
                n.x = svgP.x;
                n.y = svgP.y;
                setTick(t => t + 1);
            }
        }
    };

    const handlePointerUp = () => {
        setDragNode(null);
        setEdgeDrawStart(null);
    };

    const nodes = graph.getNodes();

    return (
        <div className="w-full h-full relative min-h-[500px]">
            {/* Toggle Overlay */}
            <div className="absolute top-4 left-4 z-10 flex bg-navy/80 rounded-lg p-1 border border-white/10 backdrop-blur">
                <button onClick={() => setIs3D(false)} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!is3D ? 'bg-teal text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <Layers size={14} /> 2D SVG
                </button>
                <button onClick={() => setIs3D(true)} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${is3D ? 'bg-teal text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                    <Box size={14} /> 3D WebGL
                </button>
            </div>

            {is3D ? (
                <div className="w-full h-full absolute inset-0 cursor-move">
                    <ForceGraph3DWrapper graph={graph} currentStep={currentStep} onNodeClick={onNodeClick} />
                </div>
            ) : (
                <svg
                    ref={svgRef}
                    className="w-full h-full absolute inset-0 bg-transparent border-none cursor-crosshair touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    viewBox="0 0 800 500"
                >
                    <text x="10" y="480" fill="gray" fontSize="10">Double click: Add node. Shift+Drag: Add edge.</text>

                    {nodes.map(u =>
                        graph.neighbors(u.id).map(v => {
                            if (u.id > v) return null; // Undirected
                            const target = graph.getNode(v);
                            if (!u.x || !u.y || !target?.x || !target?.y) return null;

                            const hl = currentStep?.highlightEdges?.some(e => (e.u === u.id && e.v === v) || (e.v === u.id && e.u === v));
                            return (
                                <line
                                    key={`${u.id}-${v}`}
                                    x1={u.x} y1={u.y} x2={target.x} y2={target.y}
                                    stroke={hl ? "#1C7293" : "#5B6B75"}
                                    strokeWidth={hl ? 3 : 1}
                                    className="transition-colors duration-300"
                                />
                            );
                        })
                    )}

                    {edgeDrawStart && graph.getNode(edgeDrawStart) && (
                        <line
                            x1={graph.getNode(edgeDrawStart)!.x} y1={graph.getNode(edgeDrawStart)!.y}
                            x2={mousePos.x} y2={mousePos.y}
                            stroke="#1C7293" strokeWidth={2} strokeDasharray="5,5"
                        />
                    )}

                    {nodes.map(node => {
                        let isHighlighted = currentStep?.highlightNodes?.includes(node.id);
                        const score = currentStep?.scores?.[node.id];
                        let fillColor = "#21295C";
                        if (isHighlighted) fillColor = (currentStep && currentStep.action === 'score') ? "#10B981" : "#1C7293";

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x || 0}, ${node.y || 0})`}
                                className="cursor-pointer transition-transform duration-300"
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    if (e.shiftKey) setEdgeDrawStart(node.id);
                                    else setDragNode(node.id);
                                }}
                                onPointerUp={(e) => {
                                    e.stopPropagation();
                                    if (edgeDrawStart && edgeDrawStart !== node.id) {
                                        graph.addEdge(edgeDrawStart, node.id);
                                        onGraphChange?.();
                                        setTick(t => t + 1);
                                    }
                                    setEdgeDrawStart(null);
                                    setDragNode(null);
                                }}
                            >
                                <circle r={20} fill={fillColor} stroke={isHighlighted ? "#fff" : "#065A82"} strokeWidth={2} className="transition-colors duration-300" />
                                <text fill="#fff" textAnchor="middle" dy={5} fontSize={12} className="font-bold pointer-events-none">{node.label}</text>
                                {score !== undefined && <text fill="#10B981" textAnchor="middle" dy={-25} fontSize={14} className="font-bold pointer-events-none">{score.toFixed(2)}</text>}
                            </g>
                        );
                    })}
                </svg>
            )}
        </div>
    );
}
