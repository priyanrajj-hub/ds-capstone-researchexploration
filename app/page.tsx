"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import SpaceComplexitySlider from '@/components/SpaceComplexitySlider';
import SimulationRace from '@/components/SimulationRace';
import AppGallery from '@/components/AppGallery';

const GraphScene = dynamic(() => import('@/components/GraphScene'), { ssr: false });

// Helper to generate consistent starting structure
const generateDemoGraph = (size = 50) => {
    const list = new Map<number, number[]>();
    const nodes = [];
    const edges: { source: number, target: number }[] = [];

    for (let i = 0; i < size; i++) {
        list.set(i, []);
        nodes.push({ id: i, x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20, z: 0 });
    }

    for (let i = 0; i < size; i++) {
        const numEdges = Math.floor(Math.random() * 4) + 1;
        for (let j = 0; j < numEdges; j++) {
            const target = Math.floor(Math.random() * size);
            if (target !== i && !list.get(i)!.includes(target)) {
                list.get(i)!.push(target);
                edges.push({ source: i, target });
            }
        }
    }
    return { nodes, edges, size };
};

export default function Page() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const [isSimpleMode, setIsSimpleMode] = useState(true);

    const [globalGraph, setGlobalGraph] = useState<any>({ nodes: [], edges: [], size: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(7);

    useEffect(() => {
        const saved = localStorage.getItem('explainerSimpleMode');
        if (saved !== null) setIsSimpleMode(saved === 'true');

        const params = new URLSearchParams(window.location.search);
        const encodedState = params.get('state');
        if (encodedState) {
            try {
                const decoded = JSON.parse(atob(encodedState));
                if (decoded.graph) setGlobalGraph(decoded.graph);
                if (decoded.selected !== undefined) setSelectedNodeId(decoded.selected);
                return;
            } catch (e) {
                console.error("Failed to parse URL state.");
            }
        }
        setGlobalGraph(generateDemoGraph(50));
    }, []);

    const toggleMode = () => {
        const newVal = !isSimpleMode;
        setIsSimpleMode(newVal);
        localStorage.setItem('explainerSimpleMode', String(newVal));
    };

    const copyShareableLink = () => {
        const stateObj = { graph: globalGraph, selected: selectedNodeId };
        const encoded = btoa(JSON.stringify(stateObj));
        const newUrl = \`\${window.location.protocol}//\${window.location.host}\${window.location.pathname}?state=\${encoded}\`;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        navigator.clipboard.writeText(newUrl);
        alert("Link copied! This specific graph configuration and selected node has been securely saved to your clipboard.");
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between pb-32">
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#1C7293] origin-left z-50" style={{ scaleX }} />
            
            {/* Top Navigation */}
            <nav className="fixed top-4 right-4 z-50 bg-navy/80 p-2 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl">
                <span className="text-white text-sm font-bold">Mode:</span>
                <button 
                    onClick={toggleMode}
                    className={\`px-4 py-1 rounded-full text-sm font-bold transition \${isSimpleMode ? 'bg-[#40c057]' : 'bg-gray-600'}\`}
                >Simple (Houses & Roads)</button>
                <button 
                    onClick={toggleMode}
                    className={\`px-4 py-1 rounded-full text-sm font-bold transition \${!isSimpleMode ? 'bg-[#1877F2]' : 'bg-gray-600'}\`}
                >Technical (Big-O)</button>
            </nav>

            <div className="w-full max-w-6xl px-6 space-y-48 mt-32">
                
                {/* Hero */}
                <section className="min-h-[70vh] flex flex-col justify-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6">Friend Recommendation System in Social Networks</h1>
                        <h2 className="text-2xl text-[#1C7293]">From real product UI to graph algorithms, ranking models, and user feedback.</h2>
                        <div className="mt-12 text-gray-400 animate-pulse">Scroll to explore ↓</div>
                    </motion.div>
                </section>

                {/* What Is Being Solved */}
                <section className="space-y-4">
                    <h2 className="text-4xl font-serif font-semibold border-b border-white/20 pb-4">What is being solved?</h2>
                    <p className="text-2xl text-gray-300">
                        Given a social graph <strong className="text-white text-3xl font-mono">G = (V, E)</strong>, where V represents users and E represents connections, the goal is to find non-adjacent pairs (u, v) that are highly likely to form a future connection.
                    </p>
                </section>

                {/* Why It Matters */}
                <section className="space-y-6">
                    <h2 className="text-4xl font-serif font-semibold border-b border-white/20 pb-4">Why it matters?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-lg hover:bg-white/10 transition"><strong>Helps users</strong> discover relevant people and expand their network.</div>
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-lg hover:bg-white/10 transition"><strong>Increases engagement</strong> and overall network growth.</div>
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-lg hover:bg-white/10 transition"><strong>Builds professional opportunities</strong> for users globally.</div>
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-lg hover:bg-white/10 transition"><strong>Requires extremely efficient algorithms</strong> to scale to millions or billions of active users.</div>
                    </div>
                </section>

                {/* The Industrial Recommendation Pipeline */}
                <section className="space-y-16">
                    <div>
                        <h2 className="text-5xl font-serif font-semibold text-center mb-4">The Industrial Recommendation Pipeline</h2>
                        <p className="text-center text-xl text-gray-400">The recommendation system follows a strict 5-step cyclic pipeline:</p>
                    </div>

                    {/* Stage 1: Graph Data */}
                    <div className="bg-navy/30 p-8 rounded-3xl border border-white/10 relative">
                        <div className="absolute -top-4 left-8 bg-[#1C7293] px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">Stage 1: Graph Data</div>
                        <h3 className="text-3xl font-bold mb-4">1. Graph Data</h3>
                        <p className="italic text-gray-400 mb-4">Users and their relationships.</p>
                        <p className="text-lg text-gray-300 mb-8">The raw data structural representation is <strong>G = (V, E)</strong>. User nodes are connected by edges representing confirmed friendships or follows.</p>
                        
                        {/* Interactive Data Showdown */}
                        <div className="bg-black/30 p-8 rounded-2xl border border-white/5 mt-8">
                            <h4 className="text-2xl font-bold text-white mb-4">Data Structure Showdown</h4>
                            <p className="text-gray-300 mb-6">Why don't we just use a massive 2D array or an SQL Table?</p>
                            <div className="overflow-x-auto mb-12">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/20 text-[#1C7293]">
                                            <th className="p-4">Structure</th><th className="p-4">Space Complexity</th><th className="p-4">Neighbor Lookup (O)</th><th className="p-4">Verdict</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                        <tr className="border-b border-white/10">
                                            <td className="p-4 font-bold">Adjacency Matrix</td><td className="p-4"><InlineMath math="O(V^2)" /></td><td className="p-4"><InlineMath math="O(1)" /></td><td className="p-4 text-red-500 font-bold">REJECTED (Scalability)</td>
                                        </tr>
                                        <tr className="border-b border-white/10">
                                            <td className="p-4 font-bold">Edge List (SQL)</td><td className="p-4"><InlineMath math="O(E)" /></td><td className="p-4"><InlineMath math="O(E)" /></td><td className="p-4 text-red-500 font-bold">REJECTED (Slow Traversal)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold">Adjacency List (Graph)</td><td className="p-4"><InlineMath math="O(V + E)" /></td><td className="p-4"><InlineMath math="O(\text{Degree})" /></td><td className="p-4 text-green-500 font-bold">SELECTED (Optimal)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <SimulationRace graph={globalGraph} selectedNodeId={selectedNodeId} />
                            <SpaceComplexitySlider graph={globalGraph} />
                            
                            <div className="mt-8">
                                <h4 className="font-bold text-gray-200 mb-4">Core Implementation</h4>
                                <SyntaxHighlighter language="javascript" style={atomDark} className="rounded-xl flex-1">
{\`// O(V + E) Space | O(1) direct lookup map
const graph = new Map<string, string[]>();

function get2HopCandidates(userId) {
    const directFriends = new Set(graph.get(userId) || []);
    const candidates = new Map();

    for (const friendId of directFriends) {
        const friendsOfFriend = graph.get(friendId) || [];
        for (const fof of friendsOfFriend) {
            if (fof !== userId && !directFriends.has(fof)) {
                candidates.set(fof, (candidates.get(fof) || 0) + 1);
            }
        }
    }
    return candidates;
}\`}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    {/* Stage 2 & 3: Candidate Generation & Ranking */}
                    <div className="bg-navy/30 p-8 rounded-3xl border border-[#40c057]/30 relative">
                        <div className="absolute -top-4 left-8 bg-[#40c057] px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">Stage 2 & 3: Retrieval & Ranking</div>
                        
                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                            <div>
                                <h3 className="text-3xl font-bold mb-4">2. Candidate Generation (Retrieval)</h3>
                                <p className="italic text-[#40c057] mb-6">Find a small set of plausible candidates from a large user base.</p>
                                <ul className="list-disc list-outside ml-5 text-gray-300 space-y-3 mb-6">
                                    <li><strong>Graph-based retrieval:</strong> N-hop traversal, Personalized PageRank (PPR), Common Neighbors.</li>
                                    <li><strong>Embedding-based retrieval:</strong> Two-Tower Neural Networks, ANN (Approximate Nearest Neighbor).</li>
                                    <li><strong>Heuristic retrieval:</strong> Matching by same company, school, or location.</li>
                                </ul>
                                <p className="text-white bg-white/10 p-3 rounded-lg border border-white/5"><strong>Output:</strong> A few thousand candidates narrowed down from 1B+ users.</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold mb-4">3. Ranking</h3>
                                <p className="italic text-[#40c057] mb-6">Score and rank candidates using multiple signals.</p>
                                <ul className="list-disc list-outside ml-5 text-gray-300 space-y-3 mb-6">
                                    <li><strong>Feature generation:</strong> Extracting graph topology, profile similarity, and historical behavior.</li>
                                    <li><strong>Ranking models:</strong> Logistic Regression, Gradient Boosted Decision Trees (GBDT), Neural models.</li>
                                    <li><strong>Re-ranking:</strong> Adjusting for diversity, freshness, and strict business rules.</li>
                                </ul>
                                <p className="text-white bg-white/10 p-3 rounded-lg border border-white/5"><strong>Output:</strong> The absolute Top-K recommendations (e.g., the top 10–50 users).</p>
                            </div>
                        </div>

                        {/* Interactive Graph Tool Embedded */}
                        <div className="mt-8 bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative">
                            <div className="bg-[#40c057]/20 p-4 border-b border-[#40c057]/30 text-center flex items-center justify-between">
                                <p className="font-bold text-[#b2f2bb] text-lg">This is a live simulation of stages 2-3 above, running on a 50-node demo graph instead of 1B+ users.</p>
                                <button onClick={copyShareableLink} className="px-4 py-2 bg-[#40c057] text-white rounded-lg hover:bg-[#37b24d] transition text-sm font-bold shadow-lg shrink-0">🔗 Copy Demo State</button>
                            </div>
                            <div className="p-4">
                                <GraphScene graph={globalGraph} setGraph={setGlobalGraph} selectedNode={selectedNodeId} setSelectedNode={setSelectedNodeId} />
                            </div>
                        </div>
                    </div>

                    {/* Stage 4: User Interface */}
                    <div className="bg-navy/30 p-8 rounded-3xl border border-[#E86A33]/50 relative">
                        <div className="absolute -top-4 left-8 bg-[#E86A33] px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">Stage 4: User Interface</div>
                        <h3 className="text-3xl font-bold mb-4">4. User Interface</h3>
                        <p className="italic text-[#E86A33] mb-4">Display personalized recommendations.</p>
                        <p className="text-lg text-gray-300 mb-8">The final Top-K candidates are rendered into UI cards (e.g., the LinkedIn "Connections you may know" carousel). Each card is the resulting proof of retrieval + ranking + business algorithms running in real-time.</p>
                        
                        <AppGallery />
                    </div>

                    {/* Stage 5: Feedback Loop */}
                    <div className="bg-navy/30 p-8 rounded-3xl border border-purple-500/50 relative">
                        <div className="absolute -top-4 left-8 bg-purple-500 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full text-white">Stage 5: Feedback Loop</div>
                        <h3 className="text-3xl font-bold mb-4">5. Feedback Loop</h3>
                        <p className="italic text-purple-400 mb-6">User actions continuously improve the system.</p>
                        <ul className="grid md:grid-cols-2 gap-4 text-gray-200 mb-8">
                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 font-bold">✅ Connect <span className="text-gray-400 font-normal text-sm block mt-1">(Positive Explicit Signal)</span></li>
                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 font-bold">❌ Remove <span className="text-gray-400 font-normal text-sm block mt-1">(Negative Explicit Signal)</span></li>
                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 font-bold">👁️ View Profile <span className="text-gray-400 font-normal text-sm block mt-1">(Implicit Signal)</span></li>
                            <li className="bg-white/5 p-4 rounded-xl border border-white/5 font-bold">🖱️ Other Interactions <span className="text-gray-400 font-normal text-sm block mt-1">(Clicks, follows, messages)</span></li>
                        </ul>
                        <div className="bg-purple-900/20 p-4 border border-purple-500/30 rounded-xl">
                            <p className="text-purple-300 font-bold italic text-center">This feedback is strictly used to retrain the ML models and update the dynamic graph!</p>
                        </div>
                    </div>
                </section>

                {/* Key Algorithms Used in Industry */}
                <section className="space-y-8">
                    <h2 className="text-4xl font-serif font-semibold border-b border-white/20 pb-4">Key Algorithms Used in Industry</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Simulated/Demoed */}
                        <div className="bg-[#40c057]/10 border border-[#40c057]/50 p-4 rounded-xl shadow-[0_0_15px_rgba(64,192,87,0.1)]">
                            <h4 className="font-bold text-white text-lg leading-tight">N-hop / BFS</h4>
                            <p className="text-sm text-gray-400 mt-1 mb-4">(Graph Traversal)</p>
                            <span className="text-xs uppercase font-bold text-[#b2f2bb] bg-[#40c057]/20 px-2 py-1 rounded inline-block">✓ Live Simulated</span>
                        </div>
                        <div className="bg-[#40c057]/10 border border-[#40c057]/50 p-4 rounded-xl flex flex-col justify-between shadow-[0_0_15px_rgba(64,192,87,0.1)]">
                            <div>
                                <h4 className="font-bold text-white text-lg leading-tight">Common Neighbors, Jaccard, Adamic–Adar</h4>
                                <p className="text-sm text-gray-400 mt-1 mb-4">(Topological Scoring)</p>
                            </div>
                            <span className="text-xs uppercase font-bold text-[#b2f2bb] bg-[#40c057]/20 px-2 py-1 rounded self-start">✓ Live Simulated</span>
                        </div>
                        <div className="bg-[#E86A33]/10 border border-[#E86A33]/50 p-4 rounded-xl flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-white text-lg leading-tight">Heuristic rules</h4>
                                <p className="text-sm text-gray-400 mt-1 mb-4">(Geospatial and categorical overlaps)</p>
                            </div>
                            <span className="text-xs uppercase font-bold text-[#ffb087] bg-[#E86A33]/20 px-2 py-1 rounded self-start">✓ Stage 4 Gallery UI</span>
                        </div>
                        
                        {/* Described only */}
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl opacity-70">
                            <h4 className="font-bold text-gray-300 text-lg leading-tight">Personalized PageRank (PPR)</h4>
                            <p className="text-sm text-gray-400 mt-1">(Random Walks)</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl opacity-70">
                            <h4 className="font-bold text-gray-300 text-lg leading-tight">Two-Tower Neural Network</h4>
                            <p className="text-sm text-gray-400 mt-1">(Embedding Retrieval)</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl opacity-70">
                            <h4 className="font-bold text-gray-300 text-lg leading-tight">Approximate Nearest Neighbor (ANN) Search</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl opacity-70">
                            <h4 className="font-bold text-gray-300 text-lg leading-tight">Logistic Regression / Gradient Boosting</h4>
                            <p className="text-sm text-gray-400 mt-1">(Ranking)</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl opacity-70">
                            <h4 className="font-bold text-gray-300 text-lg leading-tight">Neural Ranking / Multi-task Learning</h4>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">*Note: The highlighted boxes represent algorithms actively simulated in our interactive WebGL Sandbox (Stages 2/3 and Stage 4). The others represent highly advanced industry mechanics running natively in backend data centers (e.g., Meta, LinkedIn) which are described but not visually computed here.*</p>
                </section>

                {/* Real-World Scale */}
                <section className="space-y-8 bg-black/30 p-12 rounded-3xl border border-blue-500/20">
                    <h2 className="text-4xl font-serif font-semibold text-center mb-12">Real-World Scale (e.g., LinkedIn)</h2>
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-3xl bg-blue-900/40 p-8 text-center border-t-4 border-l-4 border-r-4 border-blue-500/50 rounded-t-xl transition hover:bg-blue-800/60 shadow-[0_-10px_20px_rgba(59,130,246,0.1)]">
                            <h3 className="text-5xl font-bold text-white mb-2">1B+ users</h3>
                            <p className="text-blue-200 uppercase tracking-widest font-bold">(Inventory)</p>
                        </div>
                        
                        {/* Funnel slope effect visualization achieved via shrinking widths */}
                        <div className="w-[85%] max-w-2xl bg-blue-800/40 p-6 text-center border-l-4 border-r-4 border-blue-400/50 transition hover:bg-blue-700/60 shadow-[0_5px_15px_rgba(59,130,246,0.1)]">
                            <h3 className="text-3xl font-bold text-white mb-2">Few thousand candidates</h3>
                            <p className="text-blue-200">filtered after initial retrieval.</p>
                        </div>
                        
                        <div className="w-[65%] max-w-xl bg-blue-700/40 p-6 text-center border-l-4 border-r-4 border-blue-300/50 transition hover:bg-blue-600/60 shadow-[0_5px_15px_rgba(59,130,246,0.1)]">
                            <h3 className="text-2xl font-bold text-white mb-2">Few hundred</h3>
                            <p className="text-blue-200">candidates retained after initial AI ranking.</p>
                        </div>
                        
                        <div className="w-[45%] max-w-md bg-[#40c057]/40 p-8 text-center border border-[#40c057] rounded-b-3xl transition hover:bg-[#40c057]/60 shadow-[0_10px_30px_rgba(64,192,87,0.3)]">
                            <h3 className="text-4xl font-bold text-white mb-2">Top-K (e.g., 10–50)</h3>
                            <p className="text-green-100 font-bold uppercase tracking-wider">actually shown in the UI.</p>
                        </div>
                    </div>
                    <p className="text-center text-xl text-gray-300 mt-12 max-w-3xl mx-auto">
                        The system must constantly optimize for <strong className="text-white bg-white/10 px-2 py-1 rounded">relevance, diversity, fairness, latency, and compute cost</strong>.
                    </p>
                </section>

                {/* Final Outcome */}
                <section className="space-y-8 bg-gradient-to-b from-navy/50 to-transparent p-12 rounded-3xl border border-white/10">
                    <h2 className="text-4xl font-serif font-semibold text-center mb-8">Final Outcome</h2>
                    <ul className="text-2xl text-gray-300 space-y-6 max-w-3xl mx-auto list-decimal list-inside marker:text-[#1C7293] marker:font-bold">
                        <li className="pl-4 border-l-2 border-[#1C7293]/30">More meaningful professional connections.</li>
                        <li className="pl-4 border-l-2 border-[#1C7293]/30">Higher overall user engagement.</li>
                        <li className="pl-4 border-l-2 border-[#1C7293]/30 leading-snug">A continuously improving, scalable, and highly efficient system powered entirely by user feedback and graph data structures.</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}
