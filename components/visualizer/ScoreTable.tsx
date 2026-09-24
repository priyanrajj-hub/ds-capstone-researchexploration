import React from 'react';
import { AlgorithmStep } from '../../lib/algorithms/types';

interface ScoreTableProps {
    currentStep?: AlgorithmStep | null;
}

export function ScoreTable({ currentStep }: ScoreTableProps) {
    if (!currentStep?.scores || Object.keys(currentStep.scores).length === 0) {
        return <div className="text-gray-500 text-sm italic p-4 text-center border border-white/5 rounded-xl bg-black/20">No scores generated yet.</div>;
    }

    const sorted = Object.entries(currentStep.scores).sort((a, b) => b[1] - a[1]);

    return (
        <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-[#1C7293]">
                    <tr>
                        <th className="p-3">Candidate Node</th>
                        <th className="p-3 text-right">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(([node, score]) => (
                        <tr key={node} className="border-t border-white/5 bg-white/[0.02]">
                            <td className="p-3 font-bold text-white">{node}</td>
                            <td className="p-3 text-right text-emerald-400">{score.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
