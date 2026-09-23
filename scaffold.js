const fs = require('fs');
const path = require('path');

const routes = [
    { path: 'app/problem/why-graph/page.tsx', title: 'Why a Graph?' },
    { path: 'app/candidates/n-hop/page.tsx', title: 'N-Hop Neighborhoods' },
    { path: 'app/ranking/common-neighbors/page.tsx', title: 'Common Neighbors' },
    { path: 'app/ranking/jaccard/page.tsx', title: 'Jaccard Coefficient' },
    { path: 'app/ranking/adamic-adar/page.tsx', title: 'Adamic–Adar Index' },
    { path: 'app/ranking/preferential-attachment/page.tsx', title: 'Preferential Attachment' },
    { path: 'app/ranking/ppr/page.tsx', title: 'Personalized PageRank' },
    { path: 'app/ranking/comparison/page.tsx', title: 'Algorithm Comparison' },
    { path: 'app/industry/applications/page.tsx', title: 'Real Applications' },
    { path: 'app/industry/scale/page.tsx', title: 'Billion-User Scale Challenges' },
    { path: 'app/limitations/page.tsx', title: 'Limitations' },
    { path: 'app/future/page.tsx', title: 'Future Scope' },
    { path: 'app/references/page.tsx', title: 'References' }
];

const template = (title) => `import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function GenericPage() {
    return (
        <PageTemplate
            title="${title}"
            definition="Exploring the core algorithms powering billions of connections."
            whyItExists={<p>This page is currently being structured with interactive WebGL representations.</p>}
        >
            <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-dashed border-white/10">
                <span className="text-gray-400 font-mono tracking-widest text-lg">[ Visualization Mount Point ]</span>
                <span className="text-gray-500 font-bold mt-2">Coming Soon</span>
            </div>
        </PageTemplate>
    );
}`;

routes.forEach(route => {
    fs.mkdirSync(path.dirname(route.path), { recursive: true });
    fs.writeFileSync(route.path, template(route.title));
});
