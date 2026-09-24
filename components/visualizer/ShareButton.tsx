import React from 'react';
import { Share2 } from 'lucide-react';
import { Graph } from '../../lib/graph/graph';

export function ShareButton({ graph, params = {} }: { graph: Graph, params?: Record<string, any> }) {
    const handleShare = () => {
        // Serialize graph edges/nodes and params
        const state = {
            nodes: graph.getNodes().map(n => ({ id: n.id, x: n.x, y: n.y })),
            edges: graph.getNodes().flatMap(u => graph.neighbors(u.id).filter(v => u.id < v).map(v => [u.id, v])),
            params
        };
        const b64 = btoa(JSON.stringify(state));
        const url = new URL(window.location.href);
        url.searchParams.set('state', b64);
        window.history.replaceState({ path: url.toString() }, '', url.toString());
        navigator.clipboard.writeText(url.toString());
        alert("URL copied to clipboard! Share this exact layout and algorithm state.");
    };

    return (
        <button onClick={handleShare} className="flex items-center gap-2 p-2 px-4 bg-navy hover:bg-ocean border border-white/20 rounded-lg font-bold text-sm transition-colors text-white shadow-md">
            <Share2 size={16} /> Share Setup
        </button>
    );
}
