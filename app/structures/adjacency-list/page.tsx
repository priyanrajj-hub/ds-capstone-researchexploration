import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function AdjacencyListPage() {
    return (
        <PageTemplate
            title="Adjacency List"
            definition="The universally adopted architecture backing every trillion-edge network on Earth."
            whyItExists={
                <p>
                    Each node is a hash map key pointing to an array of neighbors. It takes O(V + E) space—perfect for sparse maps. Lookup for all neighbors is O(Degree), bounding our search instantly.
                </p>
            }
            complexity={{ space: "O(V + E)", time: "O(Degree)" }}
            industryLink="/industry/applications"
            prevPage={{ name: "Edge List", path: "/structures/edge-list" }}
            nextPage={{ name: "Matrix vs List", path: "/structures/comparison" }}
        >
            <div className="h-64 flex items-center justify-center bg-black/20 rounded-2xl border border-[#40c057]/20">
                <span className="text-gray-400 font-mono tracking-widest">[ Adjacency List Visualizer Mount Point ]</span>
            </div>
        </PageTemplate>
    );
}
