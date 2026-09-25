'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ProgressData = Record<string, { quizCompleted: boolean; quizScore: number }>;

interface ProgressContextType {
    progress: ProgressData;
    markComplete: (algorithmId: string, score: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState<ProgressData>({});

    useEffect(() => {
        const stored = localStorage.getItem('algo_progress');
        if (stored) setProgress(JSON.parse(stored));
    }, []);

    const markComplete = (algorithmId: string, score: number) => {
        setProgress(prev => {
            const next = { ...prev, [algorithmId]: { quizCompleted: true, quizScore: score } };
            localStorage.setItem('algo_progress', JSON.stringify(next));
            return next;
        });
    };

    return (
        <ProgressContext.Provider value={{ progress, markComplete }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) throw new Error('useProgress must be used within ProgressProvider');
    return context;
}
