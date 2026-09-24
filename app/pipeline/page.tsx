"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Database, Search, ArrowDownUp, CheckSquare, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
    { id: 'data', icon: Database, label: 'Graph Data' },
    { id: 'retrieval', icon: Search, label: 'Candidate Generation' },
    { id: 'ranking', icon: ArrowDownUp, label: 'Ranking' },
    { id: 'ui', icon: CheckSquare, label: 'UI Delivery' },
    { id: 'feedback', icon: RefreshCw, label: 'Feedback Loop' }
];

export default function PipelinePage() {
    const [activeStage, setActiveStage] = useState('data');
    const [users, setUsers] = useState(1000000000);
    const [retrieval, setRetrieval] = useState(2000);
    const [ranking, setRanking] = useState(500);
    const [ui, setUi] = useState(15);

    const cost = (retrieval * 0.1 + ranking * 5).toFixed(2);
    const falseNegativeRisk = ((1 - (retrieval / users)) * 100).toFixed(6);

    return (
        <div className="min-h-screen bg-navy text-light pb-32">
            <nav className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:text-white transition font-bold"><Home size={18} /> Explainer</Link>
                <span className="text-teal font-bold tracking-widest uppercase text-sm">Industrial Pipeline</span>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
                <header className="space-y-4">
                    <h1 className="text-5xl font-serif font-bold">The Machine Learning Funnel</h1>
                    <p className="text-xl text-gray-300 max-w-3xl">We cannot score every user against every other user. A billion times a billion is <span className="text-white font-bold">one quintillion</span> pairs. The pipeline trades accurate scoring for massive filters to keep costs down.</p>
                </header>

                {/* 5-Stage Animated Header */}
                <div className="flex justify-between items-center bg-black/20 p-8 rounded-3xl border border-white/5 relative">
                    <div className="absolute top-1/2 left-10 right-10 h-1 bg-white/10 -z-10 -translate-y-1/2" />
                    {STAGES.map((s) => {
                        const Icon = s.icon;
                        const isActive = activeStage === s.id;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setActiveStage(s.id)}
                                className={`flex flex-col items-center gap-3 transition-all ${isActive ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                            >
                                <div className={`p-4 rounded-full border-2 ${isActive ? 'bg-teal border-white shadow-[0_0_20px_rgba(28,114,147,0.5)]' : 'bg-navy border-white/20'}`}>
                                    <Icon size={24} className={isActive ? 'text-white' : 'text-gray-400'} />
                                </div>
                                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{s.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Stage Interactive Visualizations */}
                <section className="bg-white/5 p-8 rounded-3xl border border-white/10 min-h-[400px]">
                    {activeStage === 'data' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-3xl font-bold font-serif text-teal">1. Graph Data (1 Billion Nodes)</h2>
                            <p className="text-gray-300 text-lg">The absolute truth of the network. Stored in distributed graph databases or sharded key-value stores holding adjacency lists.</p>
                        </motion.div>
                    )}
                    {activeStage === 'retrieval' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-3xl font-bold font-serif text-teal">2. Candidate Generation (from 1B to {retrieval.toLocaleString()})</h2>
                            <p className="text-gray-300 text-lg">Uses cheap heuristics (BFS, Common Neighbors) to slash the candidate pool instantly. Highly parallelizable.</p>
                        </motion.div>
                    )}
                    {activeStage === 'ranking' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-3xl font-bold font-serif text-teal">3. Heavy Ranking (from {retrieval.toLocaleString()} to {ranking.toLocaleString()})</h2>
                            <p className="text-gray-300 text-lg">Applies complex ML models (Logistic Regression, GBDT) with hundreds of features to score the retrieved candidates.</p>
                        </motion.div>
                    )}
                    {activeStage === 'ui' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-3xl font-bold font-serif text-teal">4. UI Delivery (Top {ui})</h2>
                            <p className="text-gray-300 text-lg">The final re-ranker enforces diversity, trims duplicates, and prepares the exact widget the user sees.</p>
                        </motion.div>
                    )}
                    {activeStage === 'feedback' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-3xl font-bold font-serif text-teal">5. Feedback Loop</h2>
                            <p className="text-gray-300 text-lg">If the user accepts a connection, we draw a new edge in Stage 1 and retrain Stage 3.</p>
                        </motion.div>
                    )}
                </section>

                {/* Funnel Controls */}
                <section className="grid lg:grid-cols-2 gap-12 mt-12 bg-black/20 p-8 rounded-3xl border border-white/5">
                    <div className="space-y-8">
                        <h3 className="font-bold text-2xl text-white">Funnel Constraints</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300"><span>Retrieval Pool (Cost vs Recall)</span> <span className="text-teal font-bold">{retrieval} candidates</span></div>
                            <input type="range" min="100" max="10000" step="100" value={retrieval} onChange={e => { setRetrieval(Number(e.target.value)); if (ranking > Number(e.target.value)) setRanking(Number(e.target.value)); }} className="w-full accent-teal h-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300"><span>Heavy Ranker Pool</span> <span className="text-emerald-400 font-bold">{ranking} candidates</span></div>
                            <input type="range" min="50" max={retrieval} step="50" value={ranking} onChange={e => setRanking(Number(e.target.value))} className="w-full accent-emerald-500 h-2" />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-xl font-bold text-[#1C7293]">System Trade-offs</h3>
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-gray-300">Estimated Compute Cost</span>
                            <span className="font-mono text-white text-lg">~{cost} ms</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-gray-300">Absolute Recall Loss</span>
                            <span className="font-mono text-red-400 text-lg">{falseNegativeRisk}%</span>
                        </div>
                        <p className="text-xs text-gray-500">Notice how increasing the retrieval pool drastically raises compute cost, but technically improves the chances that the perfect candidate isn't missed early on (Recall).</p>
                    </div>
                </section>

                {/* E2E Demo placeholder area */}
                <section className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
                    <h2 className="text-4xl font-serif font-bold text-white mb-4">End-to-End Walkthrough</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Select a node from our sample network and watch it flow all the way to a "People You May Know" card.</p>
                    <button className="px-8 py-4 bg-teal hover:bg-ocean text-white font-bold rounded-xl transition-colors shadow-lg">Start Full Pipeline Demo</button>
                </section>

            </main>
        </div>
    );
}
