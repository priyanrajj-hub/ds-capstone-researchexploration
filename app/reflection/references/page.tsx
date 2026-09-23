import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function ReferencesPage() {
    return (
        <PageTemplate
            title="References & Resources"
            definition="The scientific bedrock of the Capstone project."
            whyItExists={
                <p>
                    Every algorithm modeled in this explainer is drawn from core computer science literature governing network theory and Link Prediction models.
                </p>
            }
            prevPage={{ name: "Future Scope", path: "/reflection/future" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-white/10 mt-6 space-y-4 text-sm text-gray-300">
                <div className="border-b border-white/5 pb-4">
                    <p className="font-bold text-white mb-1">Adamic, L. A., & Adar, E. (2003)</p>
                    <p className="italic">"Friends and neighbors on the Web"</p>
                    <p className="text-xs text-gray-500">Social Networks, 25(3), 211-230. The foundational paper establishing the Adamic-Adar ranking variant.</p>
                </div>
                <div className="border-b border-white/5 pb-4">
                    <p className="font-bold text-white mb-1">Page, L., Brin, S., Motwani, R., & Winograd, T. (1999)</p>
                    <p className="italic">"The PageRank citation ranking: Bringing order to the web"</p>
                    <p className="text-xs text-gray-500">Stanford InfoLab. Origin of the Random Walk probability model.</p>
                </div>
                <div className="pb-2">
                    <p className="font-bold text-white mb-1">D3-Force API Reference</p>
                    <p className="italic">Force-Directed Graph Simulation bindings</p>
                    <p className="text-xs text-gray-500">Provided the physical attraction/repulsion mechanics for the 3D WebGL renderer.</p>
                </div>
            </div>
        </PageTemplate>
    );
}
