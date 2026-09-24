"use client";
import React, { useState, useEffect } from 'react';
import { AlgorithmContent } from '../lib/algorithms/algorithm-content';
import { GraphCanvas, PlaybackControls, useStepPlayer, CodePanel, ScoreTable } from './visualizer';
import { Graph, getTinyTutorialGraph } from '../lib/graph';
import { bfsNHop, commonNeighbors, jaccardSimilarity, adamicAdar, personalizedPageRank, topKHeap } from '../lib/algorithms';
import VideoTab from './VideoTab'; // we will create this next
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AlgorithmLayoutProps {
    content: AlgorithmContent;
}

export default function AlgorithmLayout({ content }: AlgorithmLayoutProps) {
    const [graph, setGraph] = useState<Graph | null>(null);
    const [activeTab, setActiveTab] = useState<'visualize' | 'explain' | 'watch'>('visualize');

    // Initialize graph
    useEffect(() => {
        setGraph(getTinyTutorialGraph());
    }, [content.id]);

    const getGenerator = () => {
        if (!graph) return function* () { yield { type: 'done' as const, message: 'No graph' }; }();
        switch (content.id) {
            case 'bfs-nhop': return bfsNHop(graph, 'A', 2);
            case 'common-neighbors': return commonNeighbors(graph, 'A', 'X');
            case 'jaccard': return jaccardSimilarity(graph, 'A', 'X');
            case 'adamic-adar': return adamicAdar(graph, 'A', 'X');
            case 'ppr': return personalizedPageRank(graph, 'A', 0.15, 50, 10, 42);
            case 'top-k-heap': return topKHeap(3, [
                { id: 'A', score: 0.1 }, { id: 'B', score: 0.9 }, { id: 'C', score: 0.5 },
                { id: 'D', score: 0.2 }, { id: 'X', score: 0.8 }, { id: 'Y', score: 0.95 }
            ]);
            default: return function* () { yield { type: 'done' as const, message: 'Unknown algo' }; }();
        }
    };

    const player = useStepPlayer(getGenerator as any);

    const handleGraphChange = () => player.reset();

    if (!graph) return null;

    return (
        <div className="w-full h-auto lg:h-[100vh] lg:overflow-hidden flex flex-col p-4 lg:p-6 gap-6">
            {/* Header / Title */}
            <header className="flex-shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white">{content.title}</h1>
                    <p className="text-sm text-gray-400 mt-1 max-w-2xl">{
                        player.currentStep?.message || "Click play to start the visualization."
                    }</p>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Visualizer Canvas Area (Left) */}
                <div className="flex-1 flex flex-col gap-4 bg-black/20 rounded-2xl border border-white/5 p-4 min-h-[500px] lg:min-h-0 relative">
                    {/* Placeholder for 2D/3D Toggle later */}
                    <div className="flex-1 relative rounded-xl overflow-hidden min-h-0">
                        <GraphCanvas graph={graph} onGraphChange={handleGraphChange} currentStep={player.currentStep} />
                    </div>

                    {/* Controls Footer */}
                    <div className="flex-shrink-0 border-t border-white/5 pt-4">
                        <PlaybackControls
                            isPlaying={player.isPlaying} setIsPlaying={player.setIsPlaying}
                            stepForward={player.stepForward} stepBack={player.stepBack}
                            reset={player.reset} speed={player.speed} setSpeed={player.setSpeed}
                        />
                    </div>
                </div>

                {/* Right Side Tabs (Width 400px fixed on LG, full width on Mobile) */}
                <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto lg:overflow-hidden">
                    {/* Custom Tab Bar */}
                    <div className="flex gap-2 bg-white/5 p-1 rounded-xl flex-shrink-0">
                        {['visualize', 'explain', 'watch'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 text-sm font-bold py-2 rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-teal text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0 rounded-xl space-y-4">
                        {activeTab === 'visualize' && (
                            <div className="h-full flex flex-col gap-4">
                                <CodePanel code={content.pseudocode} activeLine={player.currentStep?.codeLine} />
                                <ScoreTable currentStep={player.currentStep} />
                            </div>
                        )}

                        {activeTab === 'explain' && (
                            <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-6">
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-2">Intuition</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">{content.intuition}</p>
                                </div>
                                <div className="p-4 bg-navy/50 rounded-lg border border-teal/20">
                                    <h3 className="font-bold text-teal text-sm mb-2">Complexity Limits</h3>
                                    <p className="text-xs text-gray-300"><strong>Time:</strong> {content.complexity.time}</p>
                                    <p className="text-xs text-gray-300 mt-1"><strong>Space:</strong> {content.complexity.space}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-ocean text-sm mb-2">When It Fails</h3>
                                    <p className="text-gray-300 text-sm">{content.whenItFails}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-2">Worked Example</h3>
                                    <p className="bg-black/30 p-3 rounded text-xs text-gray-400 font-mono">{content.workedExample}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'watch' && (
                            <VideoTab algorithmId={content.id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
