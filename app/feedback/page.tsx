"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Home, LineChart, UserPlus, X, Eye, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_CANDIDATES = Array.from({ length: 50 }).map((_, i) => ({
    id: `U${i}`,
    score: Math.random() * 0.8 + 0.1, // Base model score
    trait: Math.random() > 0.5 ? 'Tech' : 'Art',
    isExploration: false
}));

export default function FeedbackLoopPage() {
    const [candidates, setCandidates] = useState(ALL_CANDIDATES);
    const [round, setRound] = useState(1);
    const [epsilon, setEpsilon] = useState(0.1);
    const [history, setHistory] = useState<{ accepted: number, total: number }[]>([{ accepted: 0, total: 0 }]);

    // Model weights that update
    const [weights, setWeights] = useState({ Tech: 1.0, Art: 1.0 });

    // Get current top 4 based on score * weight
    const currentTopK = useMemo(() => {
        let sorted = [...candidates].sort((a, b) => (b.score * (weights as any)[b.trait]) - (a.score * (weights as any)[a.trait]));

        // Epsilon-Greedy Exploration
        if (Math.random() < epsilon) {
            // Swap the 4th candidate with a completely random one from the bottom 50%
            const bottomHalf = sorted.slice(Math.floor(sorted.length / 2));
            const randomExploration = bottomHalf[Math.floor(Math.random() * bottomHalf.length)];
            sorted = sorted.filter(c => c.id !== randomExploration.id);
            return [...sorted.slice(0, 3), { ...randomExploration, isExploration: true }];
        }
        return sorted.slice(0, 4);
    }, [candidates, weights, round, epsilon]);

    const handleAction = (id: string, action: 'connect' | 'remove' | 'view', trait: string) => {
        // 1. Update Weights based on Explicit signal
        if (action === 'connect') setWeights(w => ({ ...w, [trait]: w[trait as keyof typeof w] * 1.2 })); // Increase affinity
        if (action === 'remove') setWeights(w => ({ ...w, [trait]: w[trait as keyof typeof w] * 0.8 })); // Decrease affinity
        if (action === 'view') setWeights(w => ({ ...w, [trait]: w[trait as keyof typeof w] * 1.05 })); // Slight positive

        // 2. Remove the interacted candidate from the pool
        setCandidates(prev => prev.filter(c => c.id !== id));

        // 3. Update Chart Stats
        setHistory(prev => {
            const last = prev[prev.length - 1];
            return [...prev, {
                accepted: last.accepted + (action === 'connect' ? 1 : 0),
                total: last.total + 1
            }];
        });

        // 4. Progress Round
        setRound(r => r + 1);
    };

    const currentRate = history[history.length - 1].total === 0
        ? 0
        : (history[history.length - 1].accepted / history[history.length - 1].total) * 100;

    return (
        <div className="min-h-screen bg-navy text-light pb-32">
            <nav className="fixed top-4 left-4 z-50 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors font-bold">
                    <Home size={18} /> Back to Explainer
                </Link>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-32 space-y-16">
                <header className="space-y-4">
                    <h1 className="text-5xl font-serif font-bold">The Cyclic Feedback Loop</h1>
                    <p className="text-xl text-gray-300 max-w-4xl leading-relaxed">
                        Every UI interaction is a training label. Connections update the graph (new edges), while skips and views adjust the model weights.
                        Because we only get feedback on what we show, we must actively inject <span className="text-teal font-bold">Exploration (Epsilon-Greedy)</span> to battle Exposure Bias.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Left: UI Widget Simulation */}
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-8 flex flex-col">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold flex items-center gap-2">People You May Know</h2>
                            <span className="text-gray-400 font-mono">Round {round}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <AnimatePresence mode="popLayout">
                                {currentTopK.map((c) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        key={c.id}
                                        className={`bg-white/5 p-6 rounded-2xl flex flex-col items-center justify-between border ${c.isExploration ? 'border-dashed border-yellow-500/50' : 'border-white/10'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal to-ocean flex justify-center items-center font-bold text-2xl shadow-lg">
                                            {c.id}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <div className="font-bold">{c.trait} Industry</div>
                                            <div className="text-xs text-gray-400 font-mono">Score: {(c.score * weights[c.trait as keyof typeof weights]).toFixed(2)}</div>
                                        </div>

                                        {c.isExploration && <div className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 rounded-full mt-2 uppercase tracking-wider font-bold">Exploration</div>}

                                        <div className="flex gap-2 mt-6 w-full">
                                            <button onClick={() => handleAction(c.id, 'connect', c.trait)} className="flex-1 bg-teal hover:bg-emerald-500 text-white p-2 rounded-lg flex justify-center transition" aria-label="Connect"><UserPlus size={18} /></button>
                                            <button onClick={() => handleAction(c.id, 'view', c.trait)} className="flex-1 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex justify-center transition" aria-label="View Profile"><Eye size={18} /></button>
                                            <button onClick={() => handleAction(c.id, 'remove', c.trait)} className="flex-1 bg-transparent hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/50 p-2 rounded-lg flex justify-center transition" aria-label="Remove"><X size={18} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Metrics & Internals */}
                    <div className="space-y-8 flex flex-col">

                        <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2"><LineChart size={20} /> Acceptance Rate Tracker</h3>
                            <div className="flex items-end gap-4 h-32 border-b border-light/10 pb-2">
                                {history.slice(-20).map((h, i) => {
                                    const hRate = h.total === 0 ? 0 : (h.accepted / h.total);
                                    return (
                                        <div key={i} className="w-full bg-white/5 rounded-t-sm flex items-end">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${hRate * 100}%` }}
                                                className="w-full bg-teal rounded-t-sm transition-all"
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <span>Round 1</span>
                                <span className="text-teal font-bold">{currentRate.toFixed(1)}% Conversion</span>
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6 flex-1">
                            <h3 className="text-xl font-bold flex items-center gap-2"><ShieldAlert size={20} /> Model State</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Weight: Tech</div>
                                    <div className="text-3xl font-mono text-white">{weights.Tech.toFixed(2)}x</div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Weight: Art</div>
                                    <div className="text-3xl font-mono text-white">{weights.Art.toFixed(2)}x</div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-300">Exploration Rate (ε)</span>
                                    <span className="text-emerald-400 font-mono font-bold">{(epsilon * 100).toFixed(0)}%</span>
                                </div>
                                <input type="range" min="0" max="0.5" step="0.05" value={epsilon} onChange={e => setEpsilon(Number(e.target.value))} className="w-full accent-emerald-500 h-2" />
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    If you set <span className="font-bold text-white">ε = 0%</span>, you only see the top predictions. If the model incorrectly thinks you hate Art, you will never see an artist, and the model will never learn it was wrong. Injecting randomness gathers counter-factual training data to correct biases.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
