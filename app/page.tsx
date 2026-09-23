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

    // Globally Shared Graph State
    const [globalGraph, setGlobalGraph] = useState<any>({ nodes: [], edges: [], size: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(7); // Default mock

    useEffect(() => {
        // 1. Check LocalStorage
        const saved = localStorage.getItem('explainerSimpleMode');
        if (saved !== null) setIsSimpleMode(saved === 'true');

        // 2. Base64 URL Shareable State Restoration
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

        // Default Fallback
        setGlobalGraph(generateDemoGraph(50));
    }, []);

    const toggleMode = () => {
        const newVal = !isSimpleMode;
        setIsSimpleMode(newVal);
        localStorage.setItem('explainerSimpleMode', String(newVal));
    };

    const narrate = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const copyShareableLink = () => {
        const stateObj = { graph: globalGraph, selected: selectedNodeId };
        const encoded = btoa(JSON.stringify(stateObj));
        const newUrl = \`\${window.location.protocol}//\${window.location.host}\${window.location.pathname}?state=\${encoded}\`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
      navigator.clipboard.writeText(newUrl);
      alert("Link copied! This specific graph configuration and selected node has been securely saved to your clipboard.");
  };

  const textProblem = isSimpleMode 
    ? "Imagine a massive city with 3 billion houses, but each house only has roads to 300 neighbors. If you want to find a friend-of-a-friend, you can't just check a massive list of everyone in the world. You have to travel down the specific roads. Without a good map, finding friends is impossible."
    : "Social networks are sparse. The average user on a platform with 3 Billion users has only 300 connections. While direct connections are easy to query, discovering relevant 2nd and 3rd degree connections is a massive combinatorial nightmare if not modeled topologically.";

  const textAlgorithms = isSimpleMode
    ? "To recommend a friend, we just count how many mutual friends you share. If you share a lot, we suggest them. But we also give bonus points if the mutual friend is someone very specific (like a niche hobby group) rather than a massive celebrity who knows everyone."
    : "Industrial engines generate candidates and scores them via Common Neighbors or Jaccard similarity. Advanced algorithms like Adamic-Adar explicitly penalize high-degree intermediate nodes, strongly weighting mutual connections between low-degree clusters.";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-32">
      {/* Scroll Progress Bar */}
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
        
        {/* Section 1: Hero */}
        <section className="min-h-[80vh] flex flex-col justify-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6">Why Graphs Power Friend Recommendations</h1>
                <h2 className="text-2xl text-[#1C7293]">Why does this data structure exist, and why does industry still use it today?</h2>
                
                <div className="mt-8 relative max-w-md bg-black/50 p-4 border border-white/10 rounded-2xl">
                    <video src="/public/intro.mp4" controls preload="none" className="w-full rounded-xl bg-gray-900 border border-white/5 h-48 object-cover" poster="https://via.placeholder.com/640x360.png?text=Intro+Narrated+Video+Placeholder" />
                    <p className="text-xs text-gray-400 mt-2 text-center">Video Walkthrough (Placeholder)</p>
                </div>

                <div className="mt-12 text-gray-400 animate-pulse">Scroll to explore ↓</div>
            </motion.div>
        </section>

        {/* Section 2: The Problem */}
        <section className="space-y-8 relative group">
            <button onClick={() => narrate(textProblem)} className="absolute -top-4 -left-4 p-2 bg-navy border border-[#1C7293] rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg z-10 hover:bg-[#1C7293]">🔊 Narrate</button>
            <h2 className="text-4xl font-serif font-semibold border-b border-white/20 pb-4">1. The Problem of Discoverability</h2>
            <div className="grid md:grid-cols-2 gap-12 text-lg text-gray-300">
                <p>{textProblem}</p>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-4">
                    <div className="text-5xl font-bold text-white">3B+</div>
                    <div className="text-sm uppercase tracking-widest text-[#1C7293]">Monthly Active Users</div>
                    <div className="text-5xl font-bold text-white mt-8">~10<sup className="text-2xl">11</sup></div>
                    <div className="text-sm uppercase tracking-widest text-[#1C7293]">Total Graph Edges</div>
                </div>
            </div>
        </section>
        
        {/* Section 4: 3D Visualization */}
        <section className="space-y-8">
            <h2 className="text-4xl font-serif font-semibold">3. Why a Graph Wins (Interactive Analytical Demo)</h2>
            <div className="flex justify-between items-end">
                <p className="text-lg text-gray-300 max-w-3xl">Click any node below to watch BFS step-by-step discover its 2nd-degree candidates via internal arrays, bypassing full database scans. This IS the exact topological algorithm the rest of this system runs natively.</p>
                <button onClick={copyShareableLink} className="px-4 py-2 bg-[#1C7293] text-white rounded-lg hover:bg-cyan-600 transition font-bold shadow-lg">🔗 Copy Link to State</button>
            </div>
            
            <GraphScene 
                graph={globalGraph} 
                setGraph={setGlobalGraph} 
                selectedNode={selectedNodeId} 
                setSelectedNode={setSelectedNodeId} 
            />
            
            <p className="text-xs text-center text-gray-400">The metrics calculated above directly feed into the recommendation ranking formulas below.</p>
        </section>

        {/* Section 3: Data Structure Showdown */}
        <section className="space-y-8">
            <div className="bg-black/20 p-12 rounded-3xl border border-white/5">
                <h2 className="text-4xl font-serif font-semibold">2. Data Structure Showdown</h2>
                <p className="text-lg text-gray-300 mb-8">Why don't we just use a massive 2D array or an SQL Table?</p>
                <div className="overflow-x-auto">
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
            </div>

            <SimulationRace graph={globalGraph} selectedNodeId={selectedNodeId} />
            <SpaceComplexitySlider graph={globalGraph} />
        </section>

        {/* Section 5: Representation & Code */}
        <section className="space-y-8">
            <h2 className="text-4xl font-serif font-semibold">4. Core Implementation & Representation</h2>
            <p className="text-lg text-gray-300">In industry, graphs are represented using Adjacency Lists stored via memory-optimized Distributed Hash Maps. Here is how we generate candidates efficiently.</p>
            <SyntaxHighlighter language="javascript" style={atomDark} className="rounded-xl mt-4">
{`// O(V + E) Space | O(1) direct lookup map
        const graph = new Map<string, string[]>();

        function get2HopCandidates(userId) {
            const directFriends = new Set(graph.get(userId) || []);
            const candidates = new Map(); // tracks frequency of mutual friends

            for (const friendId of directFriends) {
                const friendsOfFriend = graph.get(friendId) || [];
                for (const fof of friendsOfFriend) {
                    if (fof !== userId && !directFriends.has(fof)) {
                        candidates.set(fof, (candidates.get(fof) || 0) + 1);
                    }
                }
            }
            return candidates;
        } `}
            </SyntaxHighlighter>
        </section>

        {/* Section 7: Link Prediction Algorithms */}
        <section className="space-y-8 relative group">
            <button onClick={() => narrate(textAlgorithms)} className="absolute -top-4 -left-4 p-2 bg-navy border border-[#1C7293] rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-[#1C7293] z-10">🔊 Narrate</button>
            <h2 className="text-4xl font-serif font-semibold">5. Essential Scoring Algorithms</h2>
            <p className="text-lg text-gray-300">{textAlgorithms}</p>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-xl text-[#1C7293] mb-2">Common Neighbors</h3>
                    <BlockMath math="|N(u) \cap N(v)|" />
                    <p className="text-sm mt-4 text-gray-400">Directly counts mutual friends. Very fast, but biased towards users with huge follower counts.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-xl text-[#1C7293] mb-2">Jaccard Similarity</h3>
                    <BlockMath math="\frac{|N(u) \cap N(v)|}{|N(u) \cup N(v)|}" />
                    <p className="text-sm mt-4 text-gray-400">Normalizes the count by dividing by the total distinct friends of both users.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-xl text-[#1C7293] mb-2">Adamic-Adar</h3>
                    <BlockMath math="\sum_{z \in N(u) \cap N(v)} \frac{1}{\log|N(z)|}" />
                    <p className="text-sm mt-4 text-gray-400">Penalizes mutual friends who are too popular, providing stronger signals for niche connections.</p>
                </div>
            </div>
        </section>

        {/* Dynamic App Gallery Section */}
        <AppGallery />

      </div>
    </main>
  );
}
