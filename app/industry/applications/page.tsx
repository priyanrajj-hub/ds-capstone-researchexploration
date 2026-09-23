import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import AppGallery from '@/components/AppGallery';

export default function RealApplicationsPage() {
    return (
        <PageTemplate
            title="Real Applications"
            definition="How different networks demand fundamentally different graph architectures."
            whyItExists={
                <p>
                    A single "Graph Algorithm" does not fit all. Meta uses high-clustering adjacency lists to find dense triangles. LinkedIn uses sparse traversal to connect recruiters across long chains. X (Twitter) manages massive asymmetric hubs where 90% of the network follows 10% of the users.
                </p>
            }
            prevPage={{ name: "Algorithm Comparison", path: "/ranking/comparison" }}
            nextPage={{ name: "Billion-User Scale Challenges", path: "/industry/scale" }}
        >
            <AppGallery />
        </PageTemplate>
    );
}