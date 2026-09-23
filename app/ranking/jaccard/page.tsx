import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { BlockMath } from 'react-katex';

export default function JaccardPage() {
    return (
        <PageTemplate
            title="Jaccard Coefficient"
            definition="Normalizing overlaps against total connections to penalize raw popularity."
            whyItExists={
                <>
                    <p>
                        To fix the "Justin Bieber" problem caused by pure Common Neighbors, we divide the intersection (shared friends) by the union (total unique friends of both users).
                    </p>
                    <p>
                        If you share 5 friends with someone who has 10 total friends, Jaccard is <code>5/10 = 0.5</code>. If you share 5 friends with a celebrity who has 1,000 friends, Jaccard shrinks to <code>5/1000 = 0.005</code>, correctly penalizing the irrelevant connection.
                    </p>
                </>
            }
            prevPage={{ name: "Common Neighbors", path: "/ranking/common-neighbors" }}
            nextPage={{ name: "Adamic–Adar Index", path: "/ranking/adamic-adar" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-white/10 flex flex-col items-center mt-6">
                <div className="text-4xl text-white mb-8 bg-black/40 px-12 py-6 rounded-xl border border-white/5">
                    <BlockMath math="\frac{|N(u) \cap N(v)|}{|N(u) \cup N(v)|}" />
                </div>
                <p className="text-gray-400 text-center max-w-2xl">
                    Jaccard ensures that similarity is measured as a percentage of your overall social circles, creating a score bound strictly between 0 and 1.
                </p>
            </div>
        </PageTemplate>
    );
}