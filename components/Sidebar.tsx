import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useProgress } from '../lib/context/ProgressContext';

const NAV_GROUPS = [
    {
        title: "Retrieval",
        links: [
            { label: "BFS N-hop", href: "/algorithms/bfs-nhop" },
            { label: "Random Walk (PPR)", href: "/algorithms/ppr" },
        ]
    },
    {
        title: "Scoring",
        links: [
            { label: "Common Neighbors", href: "/algorithms/common-neighbors" },
            { label: "Jaccard", href: "/algorithms/jaccard" },
            { label: "Adamic-Adar", href: "/algorithms/adamic-adar" },
        ]
    },
    {
        title: "Ranking",
        links: [
            { label: "Logistic / Re-ranking", href: "/ranking" }
        ]
    },
    {
        title: "System Labs",
        links: [
            { label: "Pipeline Funnel", href: "/pipeline" },
            { label: "Embeddings / ANN", href: "/embeddings" },
            { label: "Feedback Loop", href: "/feedback" },
            { label: "Evaluation", href: "/evaluation" }
        ]
    },
    {
        title: "Knowledge",
        links: [
            { label: "Learn Theory", href: "/learn" }
        ]
    }
];

export default function Sidebar() {
    const { progress } = useProgress();
    return (
        <aside className="w-64 h-[100vh] sticky top-0 left-0 bg-navy/90 border-r border-white/10 flex flex-col pt-8 pb-4 shrink-0 overflow-y-auto hidden md:flex">
            <Link href="/" className="px-6 mb-8 block transition-opacity hover:opacity-80">
                <h1 className="text-xl font-serif font-bold text-white leading-tight mb-2">See<br /><span className="text-teal">Algorithms</span></h1>
                <p className="text-xs text-gray-400 font-medium tracking-wide">FRIEND RECOMMENDATIONS</p>
            </Link>

            <nav className="flex-1 flex flex-col gap-6 px-4">
                {NAV_GROUPS.map(group => (
                    <div key={group.title}>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2">{group.title}</h2>
                        <div className="flex flex-col gap-1">
                            {group.links.map(link => {
                                const algoId = link.href.split('/').pop();
                                const isCompleted = algoId && progress[algoId]?.quizCompleted;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex justify-between items-center"
                                    >
                                        <span>{link.label}</span>
                                        {isCompleted && <CheckCircle size={14} className="text-teal" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
