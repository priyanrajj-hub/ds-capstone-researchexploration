"use client";
import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';

export default function SpaceComplexitySlider({ graph }: { graph: any }) {
  const [nodeCount, setNodeCount] = useState<number>(100);

  // Use actual graph topology globally if available, or slider override
  const activeNodes = graph ? graph.size : nodeCount;
  const activeEdges = graph ? graph.edges.length : Math.floor(nodeCount * 3.5); // Average 3.5 friends

  const matrixBytes = activeNodes * activeNodes * 8; // 8 bytes per cell
  const edgeListBytes = activeEdges * 2 * 8; // source + target * 8 bytes
  const adjListBytes = (activeNodes + activeEdges) * 8; // map keys + array elements

  const formatBytes = (bytes: number) => {
    if (bytes > 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
    if (bytes > 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
    if (bytes > 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  const maxSafeBytes = 1e6; // 1MB threshold for UI visual clip
  const matrixWidth = Math.min((matrixBytes / maxSafeBytes) * 100, 200);

  return (
    <div className="bg-black/30 p-8 rounded-2xl border border-white/10 mt-12 overflow-hidden relative">
      <h3 className="text-2xl font-bold font-serif mb-6 text-white">Live Space Complexity Memory Allocator</h3>

      {!graph && (
        <div className="mb-8">
          <label className="flex justify-between text-gray-300 font-bold mb-2">
            <span>Total Users (Nodes): {nodeCount.toLocaleString()}</span>
            <span>Theoretical Edges: {activeEdges.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="10"
            max="10000"
            step="10"
            value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            className="w-full accent-[#1C7293]"
          />
        </div>
      )}

      {graph && (
        <div className="mb-6 p-4 bg-white/5 border border-[#1C7293] rounded-lg">
          <p className="font-bold text-[#1C7293]">Reading current visualizer Graph Object natively:</p>
          <p className="text-sm text-gray-300">{activeNodes} Nodes, {activeEdges} Edges mapping globally.</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-1 text-gray-400">
            <span>Adjacency Matrix <InlineMath math="O(V^2)" /></span>
            <span className="font-bold text-red-400">{formatBytes(matrixBytes)}</span>
          </div>
          <div className="w-full bg-navy/30 h-6 rounded-md relative border border-white/5">
            <div
              className="h-full bg-red-500/80 rounded-md transition-all duration-[20ms] whitespace-nowrap overflow-visible flex items-center pr-2 text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              style={{ width: `${matrixWidth}%` }}
            >
            {matrixWidth > 110 && <span className="ml-full pl-4 text-red-300 tracking-widest absolute -right-24 bg-red-900/80 px-2 rounded">OVERFLOW!</span>}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1 text-gray-400">
          <span>Edge List <InlineMath math="O(E)" /></span>
          <span className="text-yellow-400 font-bold">{formatBytes(edgeListBytes)}</span>
        </div>
        <div className="w-full bg-navy/30 h-6 rounded-md overflow-hidden border border-white/5">
          <div
            className="h-full bg-yellow-500/80 rounded-md transition-all duration-75 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            style={{ width: `${Math.min((edgeListBytes / maxSafeBytes) * 100, 100)}%` }}
            />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1 text-gray-400">
          <span>Adjacency List <InlineMath math="O(V + E)" /></span>
          <span className="text-green-400 font-bold">{formatBytes(adjListBytes)}</span>
        </div>
        <div className="w-full bg-navy/30 h-6 rounded-md overflow-hidden border border-white/5">
          <div
            className="h-full bg-[#40c057]/80 rounded-md transition-all duration-75 shadow-[0_0_15px_rgba(64,192,87,0.5)]"
            style={{ width: `${Math.min((adjListBytes / maxSafeBytes) * 100, 100)}%` }}
            />
        </div>
      </div>
    </div>
    </div >
  );
}
