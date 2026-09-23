import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function GenericPage() {
    return (
        <PageTemplate
            title="Why a Graph?"
            definition="Exploring the core algorithms powering billions of connections."
            whyItExists={<p>This page is currently being structured with interactive WebGL representations.</p>}
        >
            <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-dashed border-white/10">
                <span className="text-gray-400 font-mono tracking-widest text-lg">[ Visualization Mount Point ]</span>
                <span className="text-gray-500 font-bold mt-2">Coming Soon</span>
            </div>
        </PageTemplate>
    );
}