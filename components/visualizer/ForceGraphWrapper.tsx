"use client";
import React, { useCallback, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { Graph } from '../../lib/graph';
import { AlgorithmStep } from '../../lib/algorithms/types';

export default function ForceGraphWrapper({ graph, currentStep }: { graph: Graph, currentStep?: AlgorithmStep | null }) {
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
    }, [graph, currentStep]); // We trigger re-render if graph changes.
    // Note: react-force-graph mutates the data objects, so recreating them is safer for deterministic topology

    const getNodeColor = useCallback((node: any) => {
        let isHighlighted = currentStep?.highlightNodes?.includes(node.id);
        if (isHighlighted) return (currentStep && currentStep.type === 'score') ? "#10B981" : "#1C7293";
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
            backgroundColor="rgba(0,0,0,0)"
            showNavInfo={false}
        />
    );
}
