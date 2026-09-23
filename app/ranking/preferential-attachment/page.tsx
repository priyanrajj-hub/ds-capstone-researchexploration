import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { BlockMath } from 'react-katex';

export default function PreferentialAttachmentPage() {
    return (
        <PageTemplate
            title="Preferential Attachment"
            definition="The 'Rich Get Richer' social physics phenomenon."
            whyItExists={
                <>
                    <p>
                        Unlike other ranking metrics, Preferential Attachment ignores shared connections entirely. It simply posits that highly connected users are inherently more likely to receive new connections.
                    </p>
                    <p>
                        This models the birth of "Hubs" in scale-free networks. Twitter (X) leverages variants of this heavily to recommend major influencers (e.g., Elon Musk) to brand new, zero-connection users during onboarding.
                    </p>
                </>
            }
            prevPage={{ name: "Adamic–Adar", path: "/ranking/adamic-adar" }}
            nextPage={{ name: "Personalized PageRank", path: "/ranking/ppr" }}
        >
            <div className="bg-black/20 p-8 rounded-2xl border border-[#E86A33]/20 flex flex-col items-center mt-6">
                <div className="text-4xl text-white mb-8 bg-black/40 px-12 py-6 rounded-xl border border-white/5">
                    <BlockMath math="|N(u)| \times |N(v)|" />
                </div>
                <p className="text-gray-400 text-center max-w-2xl">
                    A massive score is generated when multiplying the degrees of two highly active users, ignoring their actual topological proximity. Excellent for cold-adds, terrible for nuanced friend recommendations.
                </p>
            </div>
        </PageTemplate>
    );
}