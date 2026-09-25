"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
    const [initialZoomDone, setInitialZoomDone] = useState(false);

    const graphData = useMemo(() => {
        const extractedLinks: { source: string, target: string }[] = [];
        graph.getNodes().forEach(u => {
            graph.neighbors(u.id).forEach(v => {
                if (u.id < v) extractedLinks.push({ source: u.id, target: v });
            });
        });

        return {
            nodes: graph.getNodes().map(n => ({ id: n.id, name: n.label })),
            links: extractedLinks
        };
    }, [graph, currentStep]);

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

    return (
        <ForceGraph3D
            ref={fgRef as any}
            graphData={graphData}
            nodeResolution={32}
            linkColor={getLinkColor}
            linkWidth={(link: any) => {
                const u = link.source.id || link.source;
                const v = link.target.id || link.target;
                const hl = currentStep?.highlightEdges?.some(e => (e.u === u && e.v === v) || (e.v === u && e.u === v));
                return hl ? 3 : 1;
            }}
            nodeThreeObject={(node: any) => {
                const group = new THREE.Group();
                const color = getNodeColor(node);

                // Sphere
                const geometry = new THREE.SphereGeometry(5);
                const material = new THREE.MeshLambertMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.9
                });
                const sphere = new THREE.Mesh(geometry, material);
                group.add(sphere);

                // Label
                const sprite = new SpriteText(node.name);
                sprite.color = '#ffffff';
                sprite.textHeight = 4;
                sprite.position.y = 8;
                group.add(sprite);

                return group;
            }}
            onEngineStop={() => {
                if (!initialZoomDone && fgRef.current) {
                    fgRef.current.zoomToFit(400, 50);
                    setInitialZoomDone(true);
                }
            }}
            onNodeClick={(node: any) => onNodeClick?.(node.id)}
            backgroundColor="rgba(0,0,0,0)"
            showNavInfo={false}
        />
    );
}
