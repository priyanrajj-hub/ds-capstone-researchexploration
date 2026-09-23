import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { BlockMath, InlineMath } from 'react-katex';

export default function CommonNeighborsPage() {
    return (
        <PageTemplate
            title="Common Neighbors"
            definition="The simplest heuristic: count the overlaps."
            whyItExists={
                <>
                    <p>
                        Once BFS gives us our candidate bucket, we need a way to rank them. The most intuitive metric is intersection: how many friends do you and this candidate share?
                    </p>
                    <p>
                        This is fast and easily calculated across huge numbers of candidates, but it fails to normalize for popularity.
                    </p>
                </>
            }
            prevPage={{ name: "N-Hop Neighborhoods", path: "/candidates/n-hop" }}
            nextPage={{ name: "Jaccard Coefficient", path: "/ranking/jaccard" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-white/10 flex flex-col items-center mt-6">
                <div className="text-3xl text-white mb-8">
                    <BlockMath math="|N(u) \cap N(v)|" />
                </div>
                <div className="grid md:grid-cols-2 gap-8 w-full">
                    <div className="bg-white/5 p-6 rounded-lg text-gray-300 border-l-4 border-[#40c057]">
                        <h4 className="text-[#40c057] font-bold mb-2">Strengths</h4>
                        <p>Extremely cheap to compute (simple array intersection). Forms the baseline for all major recommendation funnels in production.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg text-gray-300 border-l-4 border-red-500">
                        <h4 className="text-red-500 font-bold mb-2">The "Justin Bieber" Problem</h4>
                        <p>If you both follow Justin Bieber, it counts as a shared connection—but means absolutely nothing socially. It is heavily biased toward massive public hub figures.</p>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}