"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Home, LineChart as LineChartIcon, Activity, Key } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';

// Synthetic ground truth items: id, isTrueEdge (1 or 0)
// Algorithms rank them differently. Here we just define their score outputs.
const N_CANDIDATES = 50;
const generateSimData = () => {
    let data = [];
    for (let i = 0; i < N_CANDIDATES; i++) {
        const isTrueEdge = i < 15 ? 1 : 0; // Total 15 true edges held out
        data.push({
            id: `C${i}`,
            trueEdge: isTrueEdge,
            scoreCN: isTrueEdge ? Math.random() * 10 + 5 : Math.random() * 8,
            scoreAA: isTrueEdge ? Math.random() * 5 + 3 : Math.random() * 4,
            scoreML: isTrueEdge ? Math.random() * 2 + 8 : Math.random() * 3
        });
    }
    return data;
};

const DATA = generateSimData();

export default function EvaluationPage() {
    const [k, setK] = useState(10);
    const [holdout, setHoldout] = useState(20);

    const metrics = useMemo(() => {
        const calculateBase = (key: 'scoreCN' | 'scoreAA' | 'scoreML') => {
            let sorted = [...DATA].sort((a, b) => b[key] - a[key]);

            // At K
            const topK = sorted.slice(0, k);
            const truePositivesInK = topK.filter(x => x.trueEdge).length;
            const totalTrueEdges = 15; // From synthetic data

            const precisionAtK = truePositivesInK / k;
            const recallAtK = truePositivesInK / totalTrueEdges;

            // NDCG@K
            let dcg = 0;
            let idcg = 0;
            for (let i = 0; i < k; i++) {
                dcg += topK[i].trueEdge / Math.log2(i + 2);
                idcg += (i < totalTrueEdges ? 1 : 0) / Math.log2(i + 2);
            }
            const ndcgAtK = idcg === 0 ? 0 : dcg / idcg;

            return { precisionAtK, recallAtK, ndcgAtK, sorted };
        };

        const cn = calculateBase('scoreCN');
        const aa = calculateBase('scoreAA');
        const ml = calculateBase('scoreML');

        // ROC Curve approximation (varying threshold for top 1 to top 50)
        let rocData = [];
        for (let thresh = 1; thresh <= 50; thresh += 2) {
            const tpML = ml.sorted.slice(0, thresh).filter(x => x.trueEdge).length;
            const fpML = thresh - tpML;
            rocData.push({
                fpr: fpML / (N_CANDIDATES - 15),
                tpr: tpML / 15
            });
        }

        return {
            barData: [
                { name: 'Common Neighbors', Precision: Math.round(cn.precisionAtK * 100), Recall: Math.round(cn.recallAtK * 100), NDCG: Math.round(cn.ndcgAtK * 100) },
                { name: 'Adamic-Adar', Precision: Math.round(aa.precisionAtK * 100), Recall: Math.round(aa.recallAtK * 100), NDCG: Math.round(aa.ndcgAtK * 100) },
                { name: 'ML Ranker (LogReg)', Precision: Math.round(ml.precisionAtK * 100), Recall: Math.round(ml.recallAtK * 100), NDCG: Math.round(ml.ndcgAtK * 100) },
            ],
            rocData
        }
    }, [k, holdout]); // holdout changes visually trigger recalculation in this mock

    return (
        <div className="min-h-screen bg-navy text-light pb-32">
            <nav className="fixed top-4 left-4 z-50 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors font-bold">
                    <Home size={18} /> Back to Explainer
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-32 space-y-16">
                <header className="space-y-4 border-b border-white/10 pb-12">
                    <h1 className="text-5xl font-serif font-bold">Offline Evaluation Metrics</h1>
                    <p className="text-xl text-gray-300 max-w-4xl leading-relaxed">
                        Before deploying an A/B test, we hold out known edges to see if the engine can predict them (Link Prediction).
                        Because only the <span className="text-teal font-bold">Top-K</span> positions are visible in the UI, we measure @K instead of global accuracy.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">

                        <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><Activity size={20} /> Metric Glossary</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-teal text-lg">Precision@K</h3>
                                    <p className="text-gray-300 text-sm mt-1">Of the K items shown to the user, what percentage were actually good?</p>
                                    <div className="bg-white/5 text-gray-400 font-mono text-xs p-3 rounded-lg mt-2">Example: Show 10. 4 are good. Precision@10 = 40%.</div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-teal text-lg">Recall@K</h3>
                                    <p className="text-gray-300 text-sm mt-1">Of ALL the good items that exist, what percentage did we manage to show in the top K?</p>
                                    <div className="bg-white/5 text-gray-400 font-mono text-xs p-3 rounded-lg mt-2">Example: 20 good items exist total. We showed 4 of them in the top 10. Recall@10 = 4/20 = 20%.</div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-teal text-lg">NDCG@K</h3>
                                    <p className="text-gray-300 text-sm mt-1">Normalized Discounted Cumulative Gain. Rewards algorithms for placing the best results at the absolute top (position 1 vs position 10).</p>
                                    <div className="bg-white/5 text-gray-400 font-mono text-xs p-3 rounded-lg mt-2">Example: Getting a good item at rank #1 gives 1.0 points. Getting it at rank #5 gives 0.38 points.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><Key size={20} /> Evaluation Parameters</h2>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-300"><span>K (Items shown in UI UI)</span> <span className="text-white font-bold">{k}</span></div>
                                    <input type="range" min="1" max="25" step="1" value={k} onChange={e => setK(Number(e.target.value))} className="w-full h-2 accent-teal" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-300"><span>Holdout Ratio (Test Set)</span> <span className="text-white font-bold">{holdout}%</span></div>
                                    <input type="range" min="10" max="50" step="5" value={holdout} onChange={e => setHoldout(Number(e.target.value))} className="w-full h-2 accent-ocean" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: Charts */}
                    <div className="space-y-8 flex flex-col pt-8 lg:pt-0">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-[450px] flex flex-col">
                            <h2 className="text-xl font-bold mb-6 text-white text-center">Model Performance @ {k} (%)</h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1d1f21', border: '1px solid #374151', borderRadius: '8px' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Precision" fill="#1C7293" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Recall" fill="#065A82" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="NDCG" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-gradient-to-r from-teal/10 to-ocean/10 p-6 rounded-3xl border border-teal/20 h-[300px] flex flex-col">
                            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2"><LineChartIcon size={20} /> ML Model ROC Curve (Proxy)</h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.rocData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="5 5" stroke="#ffffff10" />
                                    <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke="#9ca3af" />
                                    <YAxis dataKey="tpr" type="number" domain={[0, 1]} stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: '#21295C', border: '1px solid #1C7293', borderRadius: '8px' }} labelFormatter={v => `FPR: ${Number(v).toFixed(2)}`} />
                                    <Line type="monotone" dataKey="tpr" stroke="#10B981" strokeWidth={3} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="text-center text-xs text-teal mt-2">X: False Positive Rate | Y: True Positive Rate</div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
