import React from 'react';
import { AlgorithmStep } from '../../lib/algorithms/types';

interface StepByStepPanelProps {
    currentStep: AlgorithmStep | null;
}

export function StepByStepPanel({ currentStep }: StepByStepPanelProps) {
    if (!currentStep) return (
        <div className="w-[300px] flex-shrink-0 bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-center text-gray-400 text-sm">
            Press Play to begin visualization.
        </div>
    );

    return (
        <div className="w-[300px] flex-shrink-0 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto">
            {/* Status Header */}
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
                <span className="text-sm font-bold text-white">
                    {currentStep.action === 'done' ? 'Completed' : `Status: ${currentStep.action}`}
                </span>
            </div>

            {/* Current Node */}
            <div className="bg-navy/50 p-3 rounded-lg border border-white/5 top-0 sticky">
                <h4 className="text-xs font-bold text-teal mb-1 uppercase tracking-wider">Now Visiting</h4>
                <div className="text-lg text-white font-mono">{currentStep.currentNode || '?'}</div>
            </div>

            {/* Queue Panel (if present) */}
            {currentStep.queueContents && (
                <div>
                    <h4 className="text-xs font-bold text-ocean mb-2 uppercase tracking-wider flex justify-between">
                        <span>Queue</span>
                        <span className="text-gray-400">{currentStep.queueContents.length} items</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {currentStep.queueContents.length === 0 ? (
                            <span className="text-xs text-gray-500 italic">Empty</span>
                        ) : (
                            currentStep.queueContents.map((n, i) => (
                                <span key={i} className="px-2 py-1 bg-ocean/20 text-ocean text-xs font-bold rounded-md border border-ocean/30">
                                    {n}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Visited Set Panel (if present) */}
            {currentStep.visitedSet && (
                <div>
                    <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">Visited</h4>
                    <div className="flex flex-wrap gap-2">
                        {currentStep.visitedSet.length === 0 ? (
                            <span className="text-xs text-gray-500 italic">None</span>
                        ) : (
                            currentStep.visitedSet.map((n, i) => (
                                <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/30">
                                    {n}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Explanation Narrative */}
            {currentStep.stepExplanation && (
                <div className="mt-auto border-t border-white/10 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Action Reasoning</h4>
                    <p className="text-sm text-gray-200 leading-relaxed bg-white/5 p-3 rounded-lg">
                        {currentStep.stepExplanation}
                    </p>
                </div>
            )}
        </div>
    );
}
