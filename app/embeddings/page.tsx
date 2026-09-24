"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, Zap, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Embeddings3D = dynamic(() => import('./Embeddings3D'), { ssr: false });

// Generate synthetic precomputed embedding clusters [0, 800] domain
const generateEmbeddings = () => {
    const pts = [];
    // Cluster 1 (Tech)
    for (let i = 0; i < 150; i++) pts.push({ id: `T${i}`, x: 200 + (Math.random() - 0.5) * 150, y: 200 + (Math.random() - 0.5) * 150, type: 'tech' });
    // Cluster 2 (Art)
    for (let i = 0; i < 150; i++) pts.push({ id: `A${i}`, x: 600 + (Math.random() - 0.5) * 150, y: 200 + (Math.random() - 0.5) * 150, type: 'art' });
    // Cluster 3 (Finance)
    for (let i = 0; i < 150; i++) pts.push({ id: `F${i}`, x: 400 + (Math.random() - 0.5) * 200, y: 450 + (Math.random() - 0.5) * 150, type: 'finance' });
    return pts;
};

const POINTS = generateEmbeddings();
const GRID_SIZE = 100;

export default function EmbeddingsPage() {
    const [queryPoint, setQueryPoint] = useState({ x: 400, y: 300 });
    const [useANN, setUseANN] = useState(false);
    const [k] = useState(10); // Find top 10
    const [is3D, setIs3D] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isMobile = window.innerWidth < 768;
            setIs3D(!(prefersReduced || isMobile));
        }
    }, []);

    const dist = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

    const result = useMemo(() => {
        let comparisons = 0;
        let neighbors = [];
        let searchSpace: { id: string, x: number, y: number, type: string }[] = [];
        let highlightedBuckets: { c: number, r: number }[] = [];

        if (!useANN) { // Brute Force
            comparisons = POINTS.length;
            searchSpace = POINTS;
            neighbors = [...POINTS].sort((a, b) => dist(queryPoint, a) - dist(queryPoint, b)).slice(0, k);
        } else { // Grid-based ANN (LSH proxy)
            const qCol = Math.floor(queryPoint.x / GRID_SIZE);
            const qRow = Math.floor(queryPoint.y / GRID_SIZE);
            highlightedBuckets.push({ c: qCol, r: qRow });

            // Check adjacent buckets for edge cases (simplified ANN)
            const adjacent = [
                { c: qCol, r: qRow }, { c: qCol - 1, r: qRow }, { c: qCol + 1, r: qRow },
                { c: qCol, r: qRow - 1 }, { c: qCol, r: qRow + 1 }
            ];
            highlightedBuckets = adjacent;

            // Gather points in buckets
            searchSpace = POINTS.filter(p => {
                const pC = Math.floor(p.x / GRID_SIZE);
                const pR = Math.floor(p.y / GRID_SIZE);
                return adjacent.some(adj => adj.c === pC && adj.r === pR);
            });

            comparisons = searchSpace.length;
            neighbors = [...searchSpace].sort((a, b) => dist(queryPoint, a) - dist(queryPoint, b)).slice(0, k);
        }

        return { neighbors, comparisons, searchSpace, highlightedBuckets };
    }, [queryPoint, useANN, k]);

    return (
        <div className="min-h-screen bg-navy text-light pb-32">
            <nav className="fixed top-4 left-4 z-50 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors font-bold">
                    <Home size={18} /> Back to Explainer
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-32 space-y-16">
                <header className="space-y-4">
                    <h1 className="text-5xl font-serif font-bold">Vector Embeddings & ANN</h1>
                    <p className="text-xl text-gray-300 max-w-4xl leading-relaxed">
                        Modern recommendation systems use Two-Tower Neural Networks to map users into a dense N-dimensional vector space.
                        The problem: finding the nearest neighbors for <span className="text-white font-bold">1 Billion</span> points using simple math <span className="italic">(Brute Force)</span> takes hundreds of milliseconds per user. We must use <span className="text-teal font-bold">Approximate Nearest Neighbor (ANN)</span> techniques.
                    </p>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Interactive Canvas */}
                    <div className="lg:col-span-8 bg-black/20 p-6 rounded-3xl border border-white/5 flex flex-col gap-6">

                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2">Embedding Space (2D PCA Proxy)</h2>
                            <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                                <button onClick={() => setUseANN(false)} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${!useANN ? 'bg-teal text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Brute Force</button>
                                <button onClick={() => setUseANN(true)} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${useANN ? 'bg-teal text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Grid ANN</button>
                            </div>
                        </div>
                        <div className="w-full relative aspect-video bg-navy/50 border border-white/10 rounded-xl overflow-hidden cursor-crosshair touch-none">
                            {/* Toggle Overlay */}
                            <div className="absolute top-4 left-4 z-10 flex bg-navy/80 rounded-lg p-1 border border-white/10 backdrop-blur">
                                <button onClick={() => setIs3D(false)} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!is3D ? 'bg-teal text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                    2D SVG
                                </button>
                                <button onClick={() => setIs3D(true)} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${is3D ? 'bg-teal text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                    3D WebGL
                                </button>
                            </div>

                            {is3D ? (
                                <div className="absolute inset-0 cursor-move">
                                    <Embeddings3D points={POINTS} queryPoint={queryPoint} useANN={useANN} result={result} />
                                </div>
                            ) : (
                                <div
                                    className="absolute inset-0 w-full h-full"
                                    onPointerMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = (e.clientX - rect.left) * (800 / rect.width);
                                        const y = (e.clientY - rect.top) * (600 / rect.height);
                                        setQueryPoint({ x, y });
                                    }}
                                >
                                    <svg viewBox="0 0 800 600" className="w-full h-full text-white/5">
                                        {/* Grid lines */}
                                        {Array.from({ length: 8 }).map((_, i) => <line key={`gx${i}`} x1={i * 100} y1={0} x2={i * 100} y2={600} stroke="currentColor" strokeWidth="1" />)}
                                        {Array.from({ length: 6 }).map((_, i) => <line key={`gy${i}`} x1={0} y1={i * 100} x2={800} y2={i * 100} stroke="currentColor" strokeWidth="1" />)}

                                        {/* Highlighted Buckets (ANN Mode) */}
                                        {useANN && result.highlightedBuckets.map((b, i) => (
                                            <rect key={`hb${i}`} x={b.c * 100} y={b.r * 100} width={100} height={100} fill="rgba(28, 114, 147, 0.2)" />
                                        ))}

                                        {/* Data Points */}
                                        {POINTS.map(p => {
                                            const isSearchSpace = result.searchSpace.includes(p);
                                            const isNeighbor = result.neighbors.includes(p);
                                            let color = "#5B6B75"; // unsearched
                                            let r = 3;

                                            if (!useANN || isSearchSpace) color = "#1C7293"; // searched space
                                            if (isNeighbor) {
                                                color = "#10B981"; // Nearest!
                                                r = 6;
                                            }

                                            return <circle key={p.id} cx={p.x} cy={p.y} r={r} fill={color} className="transition-all duration-300" />;
                                        })}

                                        {/* Query Point */}
                                        <circle cx={queryPoint.x} cy={queryPoint.y} r={8} fill="#fff" stroke="#10B981" strokeWidth={3} />

                                        {result.neighbors.map(n => (
                                            <line key={`ln${n.id}`} x1={queryPoint.x} y1={queryPoint.y} x2={n.x} y2={n.y} stroke="#10B981" strokeWidth={1} opacity="0.5" strokeDasharray="4,4" />
                                        ))}
                                    </svg>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right: Metrics & Explanation */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-white/10 pb-4"><Search size={20} /> Search Performance</h2>

                            <div className="space-y-4">
                                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Distance Computations</span>
                                    <span className="font-mono text-3xl font-bold text-white"><span className={useANN ? 'text-teal' : 'text-red-400'}>{result.comparisons}</span> / {POINTS.length}</span>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Speedup Modifier</span>
                                    <span className="font-mono text-3xl font-bold text-emerald-400">{(POINTS.length / result.comparisons).toFixed(1)}x</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 italic">
                                {useANN
                                    ? "Grid-based ANN only computes distances for candidates inside the same grid bucket (and direct neighbors). It instantly skips checking points across the map, trading perfect accuracy (Recall) for speed."
                                    : "Brute force literally measures the distance between the query point and every single point. Perfect Recall, but O(N) complexity."}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-navy to-ocean p-6 rounded-3xl border border-white/10 text-white space-y-4">
                            <h3 className="font-bold text-xl flex items-center gap-2"><Zap size={20} /> Two-Tower Retrieval</h3>
                            <p className="text-sm text-light/80 leading-relaxed">
                                In modern scale architecture, a neural network has two separate sets of layers (Towers).
                                Tower A encodes the Viewer (Query Point) and Tower B encodes the Candidate into vectors.
                            </p>
                            <p className="text-sm text-light/80 leading-relaxed">
                                These vectors are pushed into a vector database (like Milvus or FAISS). At runtime, we only process Tower A for the viewer and use <span className="font-bold underline">Approximate Nearest Neighbor (HNSW / IVF)</span> on the GPU to locate candidates in milliseconds.
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
