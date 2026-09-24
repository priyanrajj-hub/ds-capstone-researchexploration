import React from 'react';
import Link from 'next/link';
import { Home, ExternalLink, BookOpen } from 'lucide-react';

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-navy text-light pb-32">
            <nav className="fixed top-4 left-4 z-50 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors font-bold">
                    <Home size={18} /> Back to Explainer
                </Link>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-32 space-y-16">
                <header className="space-y-4 border-b border-light/10 pb-8">
                    <h1 className="text-5xl font-serif font-bold text-white flex items-center gap-4"><BookOpen size={48} /> The Theory</h1>
                    <p className="text-xl text-gray-300">Deep dive into the problem of link prediction, ethical considerations, and academic references.</p>
                </header>

                <article className="prose prose-invert prose-lg max-w-none space-y-12">
                    <section>
                        <h2>The Link Prediction Problem</h2>
                        <p>
                            Given a social graph <span className="font-mono">G = (V, E)</span>, where V represents users and E represents connections, the goal is to predict which non-adjacent pairs (u, v) will connect next.
                        </p>
                        <p>
                            You never score all pairs. In a network of 1 Billion users, evaluating every possible connection requires <span className="font-mono">O(V²)</span> complexity, roughly 10¹⁸ (one quintillion) pairs. Discoverability relies entirely on graph traversal techniques (heuristics) or dense vector embeddings to quickly identify a small set of highly probable candidates.
                        </p>
                    </section>

                    <section>
                        <h2>Why it Matters</h2>
                        <ul>
                            <li><strong>Network Effects:</strong> More connections means a denser graph, which makes the platform inherently more valuable to all users.</li>
                            <li><strong>Cold Start Mitigation:</strong> Directing new users to relevant friend clusters prevents early churn.</li>
                            <li><strong>Professional Opportunity:</strong> In professional networks, correct graph traversal exposes job seekers to crucial 2nd-degree hiring managers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Ethics, Fairness & Bugs</h2>
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5 not-prose space-y-6 mt-6">
                            <div>
                                <h3 className="text-teal font-bold text-xl">1. Filter Bubbles & Polarization</h3>
                                <p className="text-gray-400 mt-2">Triadic closure (friends-of-friends) mathematically naturally clusters similar people. Left unchecked, recommender graphs create highly polarized, closed echo-chambers where users are never exposed to outside perspectives.</p>
                            </div>
                            <div>
                                <h3 className="text-teal font-bold text-xl">2. Contact-Graph Leakage</h3>
                                <p className="text-gray-400 mt-2">Historically, recommenders have accidentally outed sensitive information (e.g., patient-doctor relationships) when a doctor's phone contacts are uploaded, and the algorithm assumes the patients know each other due to the shared hub-node (the doctor).</p>
                            </div>
                            <div>
                                <h3 className="text-teal font-bold text-xl">3. Popularity Bias (Exposure Bias)</h3>
                                <p className="text-gray-400 mt-2">The system only gets feedback on candidates it displays. If it biases towards showing highly connected nodes (hubs), those hubs get even more connections, starving new or less active users from network growth.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/10 mt-16 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-teal"></div>
                        <h2 className="text-3xl !mt-0 !mb-6 text-white text-teal">Further Reading & Papers</h2>
                        <ul className="space-y-4 list-none m-0 p-0 text-sm">
                            <li className="flex items-start gap-3">
                                <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-1" />
                                <div>
                                    <a href="https://dl.acm.org/doi/10.1145/1150402.1150495" target="_blank" className="font-bold text-white hover:text-teal no-underline">The Link Prediction Problem for Social Networks</a>
                                    <span className="text-gray-500 block">Liben-Nowell, D., & Kleinberg, J. (2007) · The foundational paper on using graph topology for prediction.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-1" />
                                <div>
                                    <a href="https://doi.org/10.1016/S0378-8733(03)00009-1" target="_blank" className="font-bold text-white hover:text-teal no-underline">Friends and Neighbors on the Web</a>
                                    <span className="text-gray-500 block">Adamic, L. A., & Adar, E. (2003) · Introduced the Adamic-Adar index for penalizing hubs.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-1" />
                                <div>
                                    <a href="https://arxiv.org/abs/1011.4071" className="font-bold text-white hover:text-teal no-underline">Supervised Random Walks: Predicting and Recommending Links</a>
                                    <span className="text-gray-500 block">Backstrom, L., & Leskovec, J. (2011) · Using supervised learning to weight edges for random walks.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-1" />
                                <div>
                                    <a href="https://arxiv.org/abs/1711.07695" className="font-bold text-white hover:text-teal no-underline">Pixie: A System for Recommending 3+ Billion Items to 200+ Million Users in Real-Time</a>
                                    <span className="text-gray-500 block">Pinterest Engineering · Massive scale random walk recommendation architecture.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-1" />
                                <div>
                                    <a href="https://arxiv.org/abs/1603.09320" className="font-bold text-white hover:text-teal no-underline">Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs (HNSW)</a>
                                    <span className="text-gray-500 block">Malkov, Y. A., & Yashunin, D. A. · The state-of-the-art for vector retrieval.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-1" />
                                <div>
                                    <a href="https://arxiv.org/abs/1706.02216" className="font-bold text-white hover:text-teal no-underline">Inductive Representation Learning on Large Graphs (GraphSAGE)</a>
                                    <span className="text-gray-500 block">Hamilton, W. L., et al. (2017) · Graph neural network embedding generation.</span>
                                </div>
                            </li>
                        </ul>
                    </section>
                </article>
            </main>
        </div>
    );
}
