import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function AdjacencyMatrixPage() {
    return (
        <PageTemplate
            title="Adjacency Matrix"
            definition="The simplest but most wasteful structure perfectly modeling dense networks."
            whyItExists={
                <p>
                    A matrix provides instantaneous O(1) lookups for edge existence. However, in sparse social graphs, 99.9% of the cells are empty, wasting an enormous O(V²) memory boundary.
                </p>
            }
            complexity={{ space: "O(V²)", time: "O(1)" }}
            prevPage={{ name: "Why a Graph?", path: "/problem/why-graph" }}
            nextPage={{ name: "Edge List", path: "/structures/edge-list" }}
        >
            <div className="h-64 flex items-center justify-center bg-black/20 rounded-2xl border border-[#1C7293]/20">
                <span className="text-gray-400 font-mono tracking-widest">[ Matrix Visualizer Mount Point ]</span>
            </div>
        </PageTemplate>
    );
}
