"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const companies = [
    {
        id: 'meta',
        name: 'Meta (TAO)',
        color: '#1877F2',
        problem: 'Serving billions of reads per second for the Newsfeed and Friend Suggestions across distinct geographic data centers.',
        whyGraph: 'Traditional SQL joins failed. They needed a single API to traverse objects (Nodes) and associations (Edges) that could be aggressively cached in RAM globally.',
        algorithm: 'TAO distributed graph engine. Uses heuristic rule retrieval (friends-of-friends) scored by complex GBDT models taking thousands of real-time signals (likes, views).',
        gain: 'Sub-millisecond latency on billions of edges, enabling the entire real-time experience of Facebook and Instagram.'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn (Liquid)',
        color: '#0077B5',
        problem: 'The "Economic Graph" requires continuously matching 1B+ professionals against jobs, companies, and 2nd-degree connections while honoring strict privacy visibility chains.',
        whyGraph: 'To recommend a 2nd-degree connection, the system must traverse the specific connection path to verify neither party blocked the other. Adjacency lists make this instant.',
        algorithm: 'Massive offline Hadoop MapReduce jobs to generate candidates, combined with real-time Graph Neural Networks for dynamic re-ranking in the PYMK (People You May Know) widget.',
        gain: 'Drives >50% of all new professional connections on the platform globally.'
    },
    {
        id: 'x',
        name: 'X (Twitter)',
        color: '#ffffff',
        problem: "A totally asymmetric graph (you follow Elon, he doesn't follow you) where a tweet must fan- out to millions of timelines instantly.",
        whyGraph: 'Needs to query "Who follows User A?" perfectly distinct from "Who does User A follow?" Directed graphs naturally separate In-Degree and Out-Degree.',
        algorithm: 'Real-time RealGraph (SimRank variants). It computes edge weights based on interactions (retweets, likes) rather than just binary follow status.',
        gain: 'Powers the "For You" algorithm, surfacing tweets from people your friends interact with heavily.'
    }
];

export default function AppGallery() {
    const [active, setActive] = useState(companies[0]);

    return (
        <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-8">
            <h2 className="text-4xl font-serif font-semibold text-white">Interactive Industrial Gallery</h2>

            <div className="flex gap-4 border-b border-white/10 pb-4">
                {companies.map(c => (
                    <button
                        key={c.id}
                        onClick={() => setActive(c)}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${active.id === c.id ? '' : 'opacity-50 hover:opacity-100 bg-white/5'}`}
                        style={{ backgroundColor: active.id === c.id ? c.color : undefined, color: active.id === c.id && c.id === 'x' ? 'black' : 'white' }}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={active.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 gap-8"
                >
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">The Problem</h4>
                            <p className="text-lg text-white mt-1">{active.problem}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Why A Graph?</h4>
                            <p className="text-lg text-white mt-1">{active.whyGraph}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Algorithm Used</h4>
                            <p className="text-lg text-white mt-1">{active.algorithm}</p>
                        </div>
                        <div className="p-4 bg-white/5 border-l-4 rounded" style={{ borderColor: active.color }}>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">What They Gain</h4>
                            <p className="font-bold text-white">{active.gain}</p>
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-2xl flex items-center justify-center p-8 border border-white/5 relative overflow-hidden">
                        {/* Simulated UI Mockup tied to the company */}
                        <div className="z-10 text-center space-y-4">
                            <h3 className="font-bold font-serif text-2xl" style={{ color: active.color }}>{active.name} Engine Active</h3>
                            <div className="text-4xl animate-pulse">⚙️</div>
                            <p className="text-sm text-gray-300 italic">"Same internal graph data structure, entirely different user product."</p>
                        </div>
                        {/* Background visual motif matching color */}
                        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${active.color}, transparent 70%)` }} />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
