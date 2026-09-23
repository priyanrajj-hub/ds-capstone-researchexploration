import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { BlockMath } from 'react-katex';

export default function AdamicAdarPage() {
    return (
        <PageTemplate
            title="Adamic–Adar Index"
            definition="Weighting the rarity of a shared connection."
            whyItExists={
                <>
                    <p>
                        Developed in 2003 to analyze social networks, the Adamic-Adar index flips the formula. Instead of evaluating the two users being compared, it evaluates the <i>quality of the mutual friend bridging them</i>.
                    </p>
                    <p>
                        It assigns a high weight to shared friends who have very few connections, and a tiny weight to shared friends with massive connections. Sharing an obscure niche connection is mathematically proven to be a stronger social signal than sharing a mainstream hub.
                    </p>
                </>
            }
            prevPage={{ name: "Jaccard Coefficient", path: "/ranking/jaccard" }}
            nextPage={{ name: "Preferential Attachment", path: "/ranking/preferential-attachment" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-[#1C7293]/30 flex flex-col items-center mt-6">
                <div className="text-4xl text-white mb-8 bg-black/40 px-12 py-6 rounded-xl border border-white/5 shadow-[0_0_30px_rgba(28,114,147,0.3)]">
                    <BlockMath math="\sum_{z \in N(u) \cap N(v)} \frac{1}{\log |N(z)|}" />
                </div>
                <div className="text-center max-w-2xl text-gray-300">
                    This is the exact algorithm running under the hood when our BFS visualizer outputs its <b>Highest Graded Match</b> in the exploration panel!
                </div>
            </div>
        </PageTemplate>
    );
}