import React, { useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
    isPlaying: boolean;
    setIsPlaying: (p: boolean) => void;
    stepForward: () => void;
    stepBack: () => void;
    reset: () => void;
    speed: number;
    setSpeed: (s: number) => void;
    currentStepIndex: number;
    totalSteps: number;
}

export function PlaybackControls({ isPlaying, setIsPlaying, stepForward, stepBack, reset, speed, setSpeed, currentStepIndex, totalSteps }: PlaybackControlsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default to avoid scrolling on Space
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }
            if (e.code === 'ArrowRight') stepForward();
            if (e.code === 'ArrowLeft') stepBack();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, setIsPlaying, stepForward, stepBack]);

    const progressPercent = totalSteps > 0 ? Math.max(0, Math.min(100, ((currentStepIndex + 1) / totalSteps) * 100)) : 0;
    const isFinished = currentStepIndex >= totalSteps - 1 && totalSteps > 0;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-2">
                <span className="text-xs font-bold text-gray-400 min-w-[60px]">Step {Math.max(0, currentStepIndex + 1)}/{totalSteps}</span>
                <div className="flex-1 bg-black/50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-teal transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10" role="toolbar" aria-label="Playback Controls">
                <button aria-label="Step Back" onClick={stepBack} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors focus:ring-2 disabled:opacity-50" disabled={currentStepIndex < 0}><SkipBack size={20} /></button>
                <button aria-label={isPlaying ? 'Pause' : 'Play'} onClick={() => setIsPlaying(!isPlaying)} className={`p-3 rounded-full shadow-lg transition-colors focus:ring-2 ${isFinished ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-teal hover:bg-ocean text-black'}`} disabled={isFinished && !isPlaying}>
                    {isFinished ? <RotateCcw size={24} onClick={(e) => { e.stopPropagation(); reset(); setIsPlaying(true); }} /> : isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button aria-label="Step Forward" onClick={stepForward} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors focus:ring-2 disabled:opacity-50" disabled={isFinished}><SkipForward size={20} /></button>
                <button aria-label="Reset" onClick={reset} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors focus:ring-2"><RotateCcw size={20} /></button>
                <div className="flex items-center gap-2 ml-auto">
                    <label htmlFor="speed" className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:block">Speed</label>
                    <input id="speed" type="range" min="100" max="2500" step="100" value={2600 - speed}
                        onChange={(e) => setSpeed(2600 - parseInt(e.target.value))} className="accent-teal h-1 w-24 cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
