import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function FuturePage() {
    return (
        <PageTemplate
            title="Future Scope"
            definition="The bleeding edge of Graph Machine Learning."
            whyItExists={
                <>
                    <p>
                        Heuristic metrics (like Adamic-Adar) require manual feature engineering. The future of social recommendation relies on Graph Neural Networks (GNNs).
                    </p>
                    <p>
                        GNNs learn the graph structure automatically. They create a "vector embedding" for every user based on their localized topology, meaning nodes with similar structural patterns get pushed close together in a mathematical latent space, creating absurdly accurate recommendation capabilities crossing billions of parameters.
                    </p>
                </>
            }
            prevPage={{ name: "Limitations", path: "/reflection/limitations" }}
            nextPage={{ name: "References", path: "/reflection/references" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-white/10 mt-6 text-center">
                <h3 className="text-xl font-bold font-serif text-[#1C7293]">GraphSAGE vs DeepWalk</h3>
                <p className="text-gray-400 max-w-xl mx-auto mt-2">The transition from heuristic math to deep learning matrices represents the next paradigm shift in structural linkage.</p>
            </div>
        </PageTemplate>
    );
}
