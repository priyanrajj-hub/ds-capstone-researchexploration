import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function LimitationsPage() {
    return (
        <PageTemplate
            title="Limitations"
            definition="Where pure topology fails to capture human intent."
            whyItExists={
                <>
                    <p>
                        Graph structure alone is powerful but blind. Two people sharing 50 friends might be perfect candidates, or they might be mortal enemies in the exact same high school clique.
                    </p>
                    <p>
                        Graph algorithms don't know content. They don't know age, geography, political alignment, or past block lists.
                    </p>
                </>
            }
            prevPage={{ name: "Scale Challenges", path: "/industry/scale" }}
            nextPage={{ name: "Future Implementations", path: "/reflection/future" }}
        >
            <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/30 mt-6">
                <p className="text-red-300">Modern systems use graphs strictly for <b>Candidate Generation</b>. Once the 40,000 candidates are sourced via BFS, they are passed into Deep Learning neural nets (like Two-Tower models) to score them against actual user profile metadata (the Content layer) before showing you the top 3 on your app screen.</p>
            </div>
        </PageTemplate>
    );
}
