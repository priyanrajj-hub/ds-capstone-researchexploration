import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function PPRPage() {
    return (
        <PageTemplate
            title="Personalized PageRank (PPR)"
            definition="Random Walk with Restart: Modeling digital word-of-mouth."
            whyItExists={
                <>
                    <p>
                        Instead of just stopping at 2-hop edges, what if we simulated a user "randomly walking" through their friends, then friends of friends, occasionally "teleporting" back to the source node?
                    </p>
                    <p>
                        Nodes that the walker lands on most frequently are fundamentally closer in topology to the source user, factoring both direct lines and massive multi-path clusters simultaneously, without suffering from the hard boundaries of BFS.
                    </p>
                </>
            }
            prevPage={{ name: "Preferential Attachment", path: "/ranking/preferential-attachment" }}
            nextPage={{ name: "Real Applications", path: "/industry/applications" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-blue-500/20 mt-6 grid h-64 place-items-center">
                <p className="text-gray-400 max-w-2xl text-center italic">
                    "PPR is the engine behind modern implicit recommendation. It translates human clustering coefficients into a pure vector of probabilities."
                </p>
            </div>
        </PageTemplate>
    );
}