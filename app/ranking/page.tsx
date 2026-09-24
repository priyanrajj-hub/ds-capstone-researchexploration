"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Home, SlidersHorizontal, BarChart3, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock features for extracted candidates (Viewer -> Candidate)
const MOCK_CANDIDATES = [
    { id: 'Alice', company: 'TechCorp', school: 'MIT', city: 'SF', features: { cn: 8, aa: 4.2, ppr: 0.12, same_company: 1, same_school: 0, same_city: 1 } },
    { id: 'Bob', company: 'TechCorp', school: 'Stanford', city: 'NYC', features: { cn: 12, aa: 2.1, ppr: 0.08, same_company: 1, same_school: 1, same_city: 0 } },
    { id: 'Charlie', company: 'StartupInc', school: 'MIT', city: 'SF', features: { cn: 2, aa: 8.5, ppr: 0.15, same_company: 0, same_school: 1, same_city: 1 } },
    { id: 'Diana', company: 'TechCorp', school: 'Berkeley', city: 'SF', features: { cn: 15, aa: 1.5, ppr: 0.05, same_company: 1, same_school: 0, same_city: 1 } },
    { id: 'Eve', company: 'DesignCo', school: 'RISD', city: 'NYC', features: { cn: 0, aa: 0, ppr: 0.01, same_company: 0, same_school: 0, same_city: 0 } },
];

export default function RankingLab() {
    const [weights, setWeights] = useState({
        cn: 0.1,
        aa: 0.8,
        ppr: 5.0,
        same_company: 2.5,
        same_school: 1.5,
        same_city: 0.5,
        bias: -2.0
    });

    const [useDiversity, setUseDiversity] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

    // Compute Logit and Sigmoid
    const computeScore = (features: Record<string, number>, w: typeof weights) => {
        const logit = (features.cn * w.cn) + (features.aa * w.aa) + (features.ppr * w.ppr) +
            (features.same_company * w.same_company) + (features.same_school * w.same_school) +
            (features.same_city * w.same_city) + w.bias;
        return 1 / (1 + Math.exp(-logit));
    };

    // Ranking logic with diversity re-ranking
    const ranked = useMemo(() => {
        let list = MOCK_CANDIDATES.map(c => ({
            ...c,
            score: computeScore(c.features, weights)
        })).sort((a, b) => b.score - a.score);

        if (useDiversity) {
            // Re-ranker: No more than 2 from the same company in the top 3
            const companyCounts: Record<string, number> = {};
            const reranked = [];
            const leftover = [];

            for (const c of list) {
                if (!companyCounts[c.company]) companyCounts[c.company] = 0;
                if (companyCounts[c.company] < 2) {
                    companyCounts[c.company]++;
                    reranked.push(c);
                } else {
                    leftover.push({ ...c, penalized: true });
                }
            }
            list = [...reranked, ...leftover].sort((a, b) => {
                // Sort by score inside the allowed buckets, then penalized at bottom
                if ((a as any).penalized && !(b as any).penalized) return 1;
                if (!(a as any).penalized && (b as any).penalized) return -1;
                return b.score - a.score;
            });
        }

        return list;
    }, [weights, useDiversity]);

    const updateWeight = (key: keyof typeof weights, val: number) => {
        setWeights(w => ({ ...w, [key]: val }));
    };

    return (
        <div className="min-h-screen bg-navy text-light pb-32">
            <nav className="fixed top-4 left-4 z-50 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors font-bold">
                    <Home size={18} /> Back to Explainer
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-32 space-y-16">
                <header className="space-y-4">
                    <h1 className="text-5xl font-serif font-bold">The Ranking Lab</h1>
                    <p className="text-xl text-gray-300 max-w-4xl">
                        Tweak the logistic regression weights to see how candidates move.
                        Understanding <span className="text-teal font-bold">P(Connect) = σ(W·X + b)</span> is critical to model interpretability.
                    </p>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Controls */}
                    <div className="lg:col-span-4 bg-black/20 p-6 rounded-3xl border border-white/5 space-y-8 h-fit">
                        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><SlidersHorizontal size={20} /> Model Weights</h2>

                        <div className="space-y-6">
                            {Object.entries(weights).map(([k, v]) => (
                                <div key={k} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-mono text-gray-300">{k}</span>
                                        <span className="text-teal font-bold">{v.toFixed(2)}</span>
                                    </div>
                                    <input type="range" // Bias can be negative, others usually positive
                                        min={k === 'bias' ? -10 : -2} max={10} step="0.1"
                                        value={v} onChange={e => updateWeight(k as any, Number(e.target.value))}
                                        className="w-full accent-teal h-2"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
                                <input type="checkbox" checked={useDiversity} onChange={e => setUseDiversity(e.target.checked)} className="w-5 h-5 accent-teal" />
                                <div>
                                    <div className="font-bold">Enable Business Rules</div>
                                    <div className="text-xs text-gray-400">Diversity Penalty: max 2 per company</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Ranking Results */}
                    <div className="lg:col-span-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><Shuffle size={20} /> Ranked Output</h2>

                        <div className="mt-8 relative space-y-4">
                            <AnimatePresence>
                                {ranked.map((c, i) => (
                                    <motion.div
                                        key={c.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        onClick={() => setSelectedCandidate(c.id)}
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors
                         ${(c as any).penalized ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/5'}
                         ${selectedCandidate === c.id ? 'ring-2 ring-teal' : 'hover:bg-white/10'}
                       `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-navy border border-teal flex items-center justify-center font-bold text-sm">{i + 1}</div>
                                            <div>
                                                <div className="font-bold text-lg">{c.id}</div>
                                                <div className="text-xs text-gray-400">{c.company} | {c.school}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-emerald-400 text-lg">{(c.score * 100).toFixed(1)}%</div>
                                            {(c as any).penalized && <div className="text-[10px] text-red-400 uppercase tracking-wider">Demoted</div>}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Feature Breakdown Chart */}
                    <div className="lg:col-span-4 bg-black/20 p-6 rounded-3xl border border-white/5 h-fit">
                        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><BarChart3 size={20} /> Why this person?</h2>

                        {selectedCandidate ? (
                            <div className="mt-8 space-y-6">
                                {(() => {
                                    const c = ranked.find(x => x.id === selectedCandidate)!;
                                    const contributions = Object.entries(c.features).map(([k, v]) => ({
                                        key: k, val: v, contrib: v * (weights as any)[k]
                                    }));
                                    const maxValue = Math.max(...contributions.map(x => Math.abs(x.contrib)), 1);

                                    return contributions.map(f => (
                                        <div key={f.key} className="space-y-1">
                                            <div className="flex justify-between text-xs font-mono text-gray-400">
                                                <span>{f.key} (val: {f.val})</span>
                                                <span>{f.contrib > 0 ? '+' : ''}{f.contrib.toFixed(2)} logit</span>
                                            </div>
                                            <div className="w-full bg-white/5 flex h-2 rounded-full overflow-hidden">
                                                {f.contrib > 0 ? (
                                                    <div className="bg-teal h-full" style={{ width: `${(f.contrib / maxValue) * 100}%` }} />
                                                ) : (
                                                    <div className="bg-red-500 h-full ml-auto" style={{ width: `${(Math.abs(f.contrib) / maxValue) * 100}%` }} />
                                                )}
                                            </div>
                                        </div>
                                    ));
                                })()}

                                <div className="pt-6 border-t border-white/10 flex justify-between text-lg font-bold">
                                    <span>Final Probability</span>
                                    <span className="text-emerald-400">{(ranked.find(x => x.id === selectedCandidate)!.score * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 text-center text-gray-500 py-12 italic border border-dashed border-gray-600 rounded-xl">
                                Click a candidate to view their feature contribution breakdown.
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
