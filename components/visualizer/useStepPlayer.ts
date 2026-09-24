import { useState, useCallback, useRef, useEffect } from 'react';
import { AlgorithmStep } from '../../lib/algorithms/types';

export function useStepPlayer<T>(generatorFn: () => Generator<AlgorithmStep, T, unknown>) {
    const [stepsHistory, setStepsHistory] = useState<AlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000);

    const generatorRef = useRef<Generator<AlgorithmStep, T, unknown> | null>(null);

    const reset = useCallback(() => {
        generatorRef.current = generatorFn();
        setStepsHistory([]);
        setCurrentStepIndex(-1);
        setIsPlaying(false);
    }, [generatorFn]);

    useEffect(() => {
        reset();
    }, [reset]);

    const stepForward = useCallback(() => {
        if (currentStepIndex < stepsHistory.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            return true;
        }

        if (generatorRef.current) {
            const next = generatorRef.current.next();
            if (!next.done || next.value !== undefined) {
                if (next.value && typeof next.value === 'object' && 'type' in next.value) {
                    setStepsHistory(prev => [...prev, next.value as AlgorithmStep]);
                    setCurrentStepIndex(prev => prev + 1);
                    return true;
                } else if (next.value !== undefined) {
                    const finalStep: AlgorithmStep = { type: 'done', message: `Final result: ${typeof next.value === 'object' ? JSON.stringify(next.value) : next.value}` };
                    setStepsHistory(prev => [...prev, finalStep]);
                    setCurrentStepIndex(prev => prev + 1);
                }
            } else {
                setIsPlaying(false);
            }
        }
        return false;
    }, [currentStepIndex, stepsHistory.length]);

    const stepBack = useCallback(() => {
        if (currentStepIndex > -1) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying) {
            timer = setInterval(() => {
                const hasMore = stepForward();
                if (!hasMore) setIsPlaying(false);
            }, speed);
        }
        return () => clearInterval(timer);
    }, [isPlaying, speed, stepForward]);

    const currentStep = currentStepIndex >= 0 ? stepsHistory[currentStepIndex] : null;

    return {
        currentStep,
        currentStepIndex,
        totalSteps: stepsHistory.length,
        isPlaying,
        setIsPlaying,
        stepForward,
        stepBack,
        reset,
        speed,
        setSpeed
    };
}
