import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function NHopPage() {
    return (
        <PageTemplate
            title="N-Hop Neighborhoods"
            definition="Limiting the search space organically without arbitrary boundaries."
            whyItExists={
                <>
                    <p>
                        If we used a 3-hop or 4-hop search algorithm instead of a strict 2-hop BFS, we would theoretically discover better recommendations. But social graphs exhibit the <i>Small World Phenomenon</i>.
                    </p>
                    <p>
                        At 4 hops, your neighborhood likely encompasses tens of millions of people. At 6 hops, it encompasses the entire planetary population. Bounding our candidate generation exactly at N=2 is the single most critical performance optimization making instant recommendation possible.
                    </p>
                </>
            }
            prevPage={{ name: "BFS Traversal", path: "/candidates/bfs" }}
            nextPage={{ name: "Common Neighbors", path: "/ranking/common-neighbors" }}
        >
            <div className="p-8 bg-black/20 rounded-2xl border border-[#E86A33]/20 mt-6 text-center">
                <h3 className="text-3xl font-serif text-white mb-6">The Six Degrees of Computation</h3>
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white/5 p-4 rounded text-gray-300 w-full max-w-md flex justify-between"><span>N = 1 (Friends)</span><span className="text-[#40c057] font-mono">~300 nodes</span></div>
                    <div className="bg-white/5 p-4 rounded text-gray-300 w-full max-w-md flex justify-between"><span>N = 2 (Candidates)</span><span className="text-yellow-400 font-mono">~40,000 nodes</span></div>
                    <div className="bg-white/5 p-4 rounded text-gray-300 w-full max-w-md flex justify-between"><span>N = 3 (Warning)</span><span className="text-[#E86A33] font-mono">~5,000,000 nodes</span></div>
                    <div className="bg-white/5 p-4 rounded text-gray-300 w-full max-w-md flex justify-between border border-red-500/50"><span>N = 4 (OOM Crash)</span><span className="text-red-500 font-mono">~400,000,000 nodes</span></div>
                </div>
            </div>
        </PageTemplate>
    );
}