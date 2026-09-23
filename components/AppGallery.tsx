"use client";
import React, { useState } from 'react';
import GraphScene, { GraphData } from '@/components/GraphScene';
import { Network, Users, Twitter } from 'lucide-react';

const generateDenseGraph = () => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < 50; i++) {
        nodes.push({ id: i, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 });
    }
    for (let i = 0; i < 250; i++) {
        edges.push({
            source: Math.floor(Math.random() * 50),
            target: Math.floor(Math.random() * 50)
        });
    }
    return { nodes, edges, size: 50 };
};

const generateSparseChainGraph = () => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < 50; i++) {
        nodes.push({ id: i, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 });
    }
    // Create several long isolated chains
    for (let i = 0; i < 40; i++) {
        if (i % 6 !== 0) edges.push({ source: i, target: i + 1 });
    }
    return { nodes, edges, size: 50 };
};

const generateHubGraph = () => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < 50; i++) {
        nodes.push({ id: i, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 });
    }
    // High preferential attachment (3 massive hubs)
    for (let i = 3; i < 50; i++) {
        const hub = i % 3;
        edges.push({ source: i, target: hub });
    }
    return { nodes, edges, size: 50 };
};

export default function AppGallery() {
    const [activeGraph, setActiveGraph] = useState<'meta' | 'linkedin' | 'x'>('meta');
    const [graph, setGraph] = useState<GraphData>(() => generateDenseGraph());
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    const handleSwitch = (type: 'meta' | 'linkedin' | 'x') => {
        setActiveGraph(type);
        setSelectedNode(null);
        if (type === 'meta') setGraph(generateDenseGraph());
        else if (type === 'linkedin') setGraph(generateSparseChainGraph());
        else if (type === 'x') setGraph(generateHubGraph());
    };

    return (
        <div className="w-full mt-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <button
                    onClick={() => handleSwitch('meta')}
                    className={`p-6 rounded-xl border text-left transition-all ${activeGraph === 'meta' ? 'bg-[#1877F2]/10 border-[#1877F2] shadow-[0_0_20px_rgba(24,119,242,0.2)]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
                >
                    <div className="text-[#1877F2] mb-4"><Users size={32} /></div>
                    <h3 className="text-xl font-bold text-white mb-2 font-serif">Meta (Highly Dense)</h3>
                    <p className="text-sm text-gray-400">High clustering coefficient. Friends of friends usually know each other, forming extremely tight triangles.</p>
                </button>
                <button
                    onClick={() => handleSwitch('linkedin')}
                    className={`p-6 rounded-xl border text-left transition-all ${activeGraph === 'linkedin' ? 'bg-[#0077b5]/10 border-[#0077b5] shadow-[0_0_20px_rgba(0,119,181,0.2)]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
                >
                    <div className="text-[#0077b5] mb-4"><Network size={32} /></div>
                    <h3 className="text-xl font-bold text-white mb-2 font-serif">LinkedIn (Sparse Chains)</h3>
                    <p className="text-sm text-gray-400">Low density. Users connect in explicit professional chains rather than dense overlapping social clusters.</p>
                </button>
                <button
                    onClick={() => handleSwitch('x')}
                    className={`p-6 rounded-xl border text-left transition-all ${activeGraph === 'x' ? 'bg-white/10 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
                >
                    <div className="text-white mb-4"><Twitter size={32} /></div>
                    <h3 className="text-xl font-bold text-white mb-2 font-serif">X (Massive Hubs)</h3>
                    <p className="text-sm text-gray-400">Asymmetric graph. 90% of connections orbit a tiny fraction of massive superstar central nodes.</p>
                </button>
            </div>

            <div className="bg-black/20 rounded-2xl border border-white/10 p-1">
                <GraphScene
                    graph={graph}
                    setGraph={setGraph}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                />
            </div>
        </div>
    );
}
