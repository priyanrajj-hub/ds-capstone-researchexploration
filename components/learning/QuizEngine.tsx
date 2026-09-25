"use client";
import React, { useState } from 'react';
import { QuizQuestion } from '../../lib/algorithms/types';
import { useProgress } from '../../lib/context/ProgressContext';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizEngineProps {
    algorithmId: string;
    questions: QuizQuestion[];
}

export function QuizEngine({ algorithmId, questions }: QuizEngineProps) {
    const { progress, markComplete } = useProgress();
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const isCompleted = progress[algorithmId]?.quizCompleted;

    const handleSelect = (qIndex: number, option: string) => {
        if (showResults || isCompleted) return;
        setAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correctCount++;
        });
        setShowResults(true);

        // Pass requires 100% since quizzes are small logic checks here
        if (correctCount === questions.length) {
            markComplete(algorithmId, correctCount);
        }
    };

    if (isCompleted && !showResults) {
        return (
            <div className="p-6 bg-teal/10 border border-teal/30 rounded-xl flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-teal text-lg flex items-center gap-2">
                        <CheckCircle size={20} /> Certification Achieved
                    </h4>
                    <p className="text-sm text-teal/80 mt-1">You have proven your understanding of this algorithm.</p>
                </div>
                <button onClick={() => setShowResults(true)} className="px-4 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition text-sm">
                    Review Quiz
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-navy/40 p-5 rounded-lg border border-white/5">
                    <h4 className="text-white font-bold mb-4">
                        <span className="text-ocean mr-2">Q{idx + 1}.</span> {q.prompt}
                    </h4>

                    {q.type === 'mcq' || q.type === 'predict' ? (
                        <div className="space-y-2">
                            {q.options?.map((opt, oIdx) => {
                                const isSelected = answers[idx] === opt;
                                const isCorrectAnswer = q.correctAnswer === opt;
                                const showAsCorrect = showResults && isCorrectAnswer;
                                const showAsError = showResults && isSelected && !isCorrectAnswer;

                                return (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleSelect(idx, opt)}
                                        disabled={showResults || isCompleted}
                                        className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex justify-between items-center
                                            ${showAsCorrect ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                                showAsError ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' :
                                                    isSelected ? 'bg-teal/20 border-teal text-white' :
                                                        'bg-black/30 border-white/10 text-gray-300 hover:border-white/30 hidden-disabled'
                                            }
                                        `}
                                    >
                                        <span>{opt}</span>
                                        {showAsCorrect && <CheckCircle size={16} />}
                                        {showAsError && <XCircle size={16} />}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 bg-rose-500/10 text-rose-400 rounded-lg text-sm">
                            Trace Question visual rendering not fully implemented yet.
                        </div>
                    )}

                    {showResults && (
                        <div className={`mt-4 p-3 rounded border text-sm ${answers[idx] === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-orange-500/10 border-orange-500/20 text-orange-200'}`}>
                            <strong>Explanation:</strong> {q.explanation}
                        </div>
                    )}
                </div>
            ))}

            {!isCompleted && !showResults && (
                <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="w-full py-4 bg-teal hover:bg-teal/80 text-navy font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Assessment
                </button>
            )}

            {showResults && !isCompleted && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
                    <p className="text-rose-400 text-sm font-bold">You did not achieve 100%. Please review the explanations and try again.</p>
                    <button onClick={() => {
                        setShowResults(false);
                        setAnswers({});
                    }} className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/40 transition">
                        Retry Quiz
                    </button>
                </div>
            )}
        </div>
    );
}
