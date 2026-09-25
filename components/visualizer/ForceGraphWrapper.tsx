"use client";
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { Graph } from '../../lib/graph';
import { AlgorithmStep } from '../../lib/algorithms/types';

interface WrapperProps {
    graph: Graph;
    currentStep?: AlgorithmStep | null;
    onNodeClick?: (id: string) => void;
}

export default function ForceGraphWrapper({ graph, currentStep, onNodeClick }: WrapperProps) {
    const fgRef = useRef<ForceGraphMethods>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [initialZoomDone, setInitialZoomDone] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                if (width > 0 && height > 0) setDimensions({ width, height });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const graphData = useMemo(() => {
        const extractedLinks: { source: string, target: string }[] = [];
        graph.getNodes().forEach(u => {
            graph.neighbors(u.id).forEach(v => {
                if (u.id < v) extractedLinks.push({ source: u.id, target: v });
            });
        });

        return {
            nodes: graph.getNodes().map(n => ({
                id: n.id,
                name: n.label,
                // Assign deterministic, non-zero starting points to prevent D3 NaN repulsive explosions at [0,0,0]
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                z: (Math.random() - 0.5) * 200,
            })),
            links: extractedLinks
        };
    }, [graph]);

    const getNodeColor = useCallback((node: any) => {
        let isHighlighted = currentStep?.highlightNodes?.includes(node.id);
        if (isHighlighted) return (currentStep && currentStep.action === 'score') ? "#10B981" : "#1C7293";
        return "#21295C";
    }, [currentStep]);

    const getLinkColor = useCallback((link: any) => {
        const u = link.source.id || link.source;
        const v = link.target.id || link.target;
        const hl = currentStep?.highlightEdges?.some(e => (e.u === u && e.v === v) || (e.v === u && e.u === v));
        return hl ? "#1C7293" : "#5B6B75";
    }, [currentStep]);

    if (graphData.nodes.length === 0) {
        return <div className="flex items-center justify-center w-full h-full text-teal font-bold animate-pulse">Initializing Visualization Core...</div>;
    }

    return (
        <div ref={containerRef} className="w-full h-full relative">
            {graphData.nodes.length > 0 ? (
                <ForceGraph3D
                    ref={fgRef as any}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeResolution={32}
                    nodeColor={getNodeColor}
                    linkColor={getLinkColor}
                    linkWidth={(link: any) => {
                        const u = link.source.id || link.source;
                        const v = link.target.id || link.target;
                        const hl = currentStep?.highlightEdges?.some(e => (e.u === u && e.v === v) || (e.v === u && e.u === v));
                        return hl ? 3 : 1;
                    }}
                    nodeThreeObjectExtend={true}
                    nodeThreeObject={(node: any) => {
                        if (node.id === 'A') {
                            console.log(`[DEBUG] Node A pos:`, node.x, node.y, node.z);
                        }
                        const sprite = new SpriteText(node.name);
                        sprite.color = '#ffffff';
                        sprite.textHeight = 4;
                        sprite.position.y = 8;
                        return sprite;
                    }}
                    onEngineStop={() => {
                        if (!initialZoomDone && fgRef.current) {
                            const N = graphData.nodes.length;
                            if (N > 0) {
                                try {
                                    fgRef.current.zoomToFit(800, 40);
                                } catch (e) {
                                    console.error("ZoomToFit bounds failed", e);
                                }
                            }
                            setInitialZoomDone(true);
                        }
                    }}
                    onNodeClick={(node: any) => onNodeClick?.(node.id)}
                    backgroundColor="rgba(0,0,0,0)"
                    showNavInfo={false}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-teal font-bold animate-pulse absolute inset-0">Initializing Visualization Core...</div>
            )}
        </div>
    );
}
