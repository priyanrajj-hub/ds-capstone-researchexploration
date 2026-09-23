import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function ScalePage() {
    return (
        <PageTemplate
            title="Billion-User Scale"
            definition="The engineering nightmare of mapping humanity."
            whyItExists={
                <>
                    <p>
                        The algorithms demonstrated here run instantly on 50 nodes. What happens when the node count hits 3,000,000,000 and edges hit 300,000,000,000?
                    </p>
                    <p>
                        You can't fit the graph in memory on one machine. It must be partitioned over distributed clusters (e.g., Apache Giraph, Spark GraphX). If two friends end up stored on different server racks, calculating their Adamic-Adar score requires expensive cross-network API hops, creating massive latency bottlenecks.
                    </p>
                </>
            }
            prevPage={{ name: "Real Applications", path: "/industry/applications" }}
            nextPage={{ name: "Limitations", path: "/reflection/limitations" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border-t-4 border-red-500 mt-6 grid md:grid-cols-2 gap-8">
                <div><h3 className="text-xl font-bold text-white mb-2">Sharding Failures</h3><p className="text-sm text-gray-400">Random partitioning creates millions of edge cuts. Meta uses balanced edge-partition algorithms to keep friend networks co-located on the same hardware.</p></div>
                <div><h3 className="text-xl font-bold text-white mb-2">Asynchronous Processing</h3><p className="text-sm text-gray-400">You don't compute all recommendations live on login. They are batch-processed dynamically overnight using Hadoop clusters and cached.</p></div>
            </div>
        </PageTemplate>
    );
}