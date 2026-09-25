import { useState, useCallback, useRef, useEffect } from 'react';
import { AlgorithmStep } from '../../lib/algorithms/types';

export function useStepPlayer<T>(generatorFn: () => Generator<AlgorithmStep, T, unknown>) {
    const [stepsHistory, setStepsHistory] = useState<AlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000);

    const reset = useCallback(() => {
        const gen = generatorFn();
        const allSteps: AlgorithmStep[] = [];
        let next = gen.next();

        while (!next.done || next.value !== undefined) {
            if (next.value && typeof next.value === 'object' && ('action' in next.value || 'type' in next.value)) {
                // Ensure action is populated for backward compatibility with 'type'
                const step = next.value as any;
                if (!step.action && step.type) step.action = step.type;
                allSteps.push(step as AlgorithmStep);
            }
            if (next.done) break;
            next = gen.next();
        }

        setStepsHistory(allSteps);
        setCurrentStepIndex(-1);
        setIsPlaying(false);
    }, [generatorFn]);

    const stepForward = useCallback(() => {
        if (currentStepIndex < stepsHistory.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            return true;
        }
        setIsPlaying(false);
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
