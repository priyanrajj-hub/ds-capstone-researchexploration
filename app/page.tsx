import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
    {
        title: "Retrieval",
        desc: "Traverse graphs to discover connected nodes (e.g. Friends of Friends) efficiently without full database scans.",
        links: [
            { label: "BFS N-hop", href: "/algorithms/bfs-nhop" },
            { label: "Random Walk (PPR)", href: "/algorithms/ppr" },
        ]
    },
    {
        title: "Scoring",
        desc: "Evaluate the topological strength of connections between isolated nodes to predict new links.",
        links: [
            { label: "Common Neighbors", href: "/algorithms/common-neighbors" },
            { label: "Jaccard", href: "/algorithms/jaccard" },
            { label: "Adamic-Adar", href: "/algorithms/adamic-adar" },
        ]
    },
    {
        title: "Ranking",
        desc: "Score retrieved candidates using trained machine learning models dynamically.",
        links: [
            { label: "Logistic / Re-ranking", href: "/ranking" }
        ]
    },
    {
        title: "System Context",
        desc: "Real-world infrastructure supporting modern recommenders.",
        links: [
            { label: "Pipeline Funnel", href: "/pipeline" },
            { label: "Embeddings / ANN", href: "/embeddings" },
            { label: "Feedback Loop", href: "/feedback" },
            { label: "Offline Evaluation", href: "/evaluation" }
        ]
    }
];

export default function LandingPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-8 py-24 space-y-16 mt-8">
            <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight">
                    See <span className="text-teal">Algorithms</span>
                </h1>
                <h2 className="text-2xl text-gray-400 font-medium max-w-3xl leading-relaxed">
                    Interactive visualizations for industrial-scale friend recommendation systems and real-time graph engines.
                </h2>
                <div className="pt-4">
                    <Link href="/algorithms/bfs-nhop" className="inline-block px-8 py-4 bg-teal text-black font-bold rounded-full shadow-lg hover:bg-ocean transition-all">
                        Start Learning
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {CATEGORIES.map(cat => (
                    <div key={cat.title} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:bg-white/10 transition-colors">
                        <h3 className="text-2xl font-bold text-white mb-3">{cat.title}</h3>
                        <p className="text-gray-400 mb-8 flex-1">{cat.desc}</p>
                        <div className="flex flex-wrap gap-3">
                            {cat.links.map(link => (
                                <Link key={link.href} href={link.href} className="px-4 py-2 bg-navy/50 border border-white/10 rounded-xl text-sm font-medium hover:border-teal hover:text-teal transition-all flex items-center gap-1 group">
                                    {link.label} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all w-0 group-hover:w-auto -ml-2 group-hover:ml-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
