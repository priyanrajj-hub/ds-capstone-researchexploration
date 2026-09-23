"use client";
import React from 'react';
import Link from 'next/link';
import { Play, PenTool, Share2, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';

const GraphScene = dynamic(() => import('@/components/GraphScene'), { ssr: false });

export default function Home() {
    // Generate a static synthetic graph for the homepage loop teaser
    const generateTeaserGraph = () => {
        let nodes = [];
        let edges = [];
        for (let i = 0; i < 35; i++) {
            nodes.push({ id: i, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 });
        }
        for (let i = 0; i < 60; i++) {
            edges.push({
                source: Math.floor(Math.random() * 35),
                target: Math.floor(Math.random() * 35)
            });
        }
        return { nodes, edges, size: 35 };
    };

    const teaserGraph = generateTeaserGraph();

    return (
        <div className="w-full flex-1 flex flex-col pt-16 lg:pt-24 pb-32">
            <div className="max-w-5xl mx-auto px-6 lg:px-8 w-full flex-1 flex flex-col items-center">

                {/* Hero Section */}
                <div className="text-center max-w-3xl mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C7293]/20 text-[#1C7293] font-semibold text-xs tracking-widest uppercase mb-6 border border-[#1C7293]/30">
                        Interactive Explainer
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Visualize How Friend Recommendation Actually Works
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
                        From the raw social graph to ranked candidates and final recommendations, explore every stage of the pipeline interactively. Understand exactly why an Adjacency List beats a Matrix at billion-user scale.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/problem/why-graph" className="bg-[#1C7293] hover:bg-[#155a75] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#1C7293]/20">
                            Start Exploring
                        </Link>
                        <Link href="/candidates/bfs" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-3 rounded-full font-bold transition-all">
                            Jump to 3D Visualizer
                        </Link>
                    </div>
                </div>

                {/* Auto-playing BFS Visualizer Teaser */}
                <div className="w-full h-[400px] mb-24 rounded-2xl overflow-hidden border border-white/10 bg-navy shadow-2xl relative">
                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                        {/* Light gradient overlay so text stands out if we wanted to overlay text */}
                    </div>

                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-[#40c057] animate-pulse"></span>
                        Live BFS Preview
                    </div>

                    <div className="w-full h-full opacity-60 pointer-events-none">
                        <GraphScene
                            graph={teaserGraph}
                            setGraph={() => { }}
                            selectedNode={0}
                            setSelectedNode={() => { }}
                        />
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 gap-6 w-full mb-32">
                    <div className="bg-black/20 p-8 rounded-2xl border border-white/5 hover:border-[#1C7293]/40 transition-colors">
                        <Eye className="text-[#1C7293] mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Visual Learning</h3>
                        <p className="text-gray-400">See exactly why an adjacency list beats a matrix visually, reducing arbitrary Big-O notation to undeniable geometry.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-2xl border border-white/5 hover:border-[#E86A33]/40 transition-colors">
                        <Play className="text-[#E86A33] mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Playback Control</h3>
                        <p className="text-gray-400">Step through BFS candidate generation frame by frame. Pause, inspect the frontier, and watch algorithms score exactly.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-2xl border border-white/5 hover:border-purple-400/40 transition-colors">
                        <PenTool className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Custom Inputs</h3>
                        <p className="text-gray-400">Draw your own mini social graph and test it against industrial models to see how they handle cold-starts and hubs.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-2xl border border-white/5 hover:border-[#40c057]/40 transition-colors">
                        <Share2 className="text-[#40c057] mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Share Insights</h3>
                        <p className="text-gray-400">Generate a shareable URL for any simulation state. Capture exact algorithm execution breakpoints to prove concepts in your report.</p>
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="text-center max-w-2xl">
                    <h3 className="text-2xl font-serif font-bold text-white mb-4">Bridge the Gap Between Algorithm and Application</h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                        This project exists because the Research Exploration Assignment demands industry-grounded, original visual analysis.
                        By rendering algorithms in three dimensions, we bypass rote textbook memorization and visually prove the systemic architecture powers Meta, LinkedIn, and X.
                    </p>
                    <Link href="/problem/why-graph" className="text-[#1C7293] font-bold hover:text-white transition-colors flex items-center justify-center gap-2">
                        Begin the Exploration <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

const ChevronRight = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
