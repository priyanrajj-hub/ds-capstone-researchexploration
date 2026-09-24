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
}

export function PlaybackControls({ isPlaying, setIsPlaying, stepForward, stepBack, reset, speed, setSpeed }: PlaybackControlsProps) {
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

    return (
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10" role="toolbar" aria-label="Playback Controls">
            <button aria-label="Step Back" onClick={stepBack} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors focus:ring-2"><SkipBack size={20} /></button>
            <button aria-label={isPlaying ? 'Pause' : 'Play'} onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-teal hover:bg-ocean rounded-full text-white shadow-lg transition-colors focus:ring-2">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button aria-label="Step Forward" onClick={stepForward} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors focus:ring-2"><SkipForward size={20} /></button>
            <button aria-label="Reset" onClick={reset} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors focus:ring-2"><RotateCcw size={20} /></button>
            <div className="flex items-center gap-2 ml-4">
                <label htmlFor="speed" className="text-xs text-gray-400 font-bold uppercase tracking-wider">Speed</label>
                <input id="speed" type="range" min="100" max="2500" step="100" value={2600 - speed}
                    onChange={(e) => setSpeed(2600 - parseInt(e.target.value))} className="accent-teal h-1 w-24 cursor-pointer" />
            </div>
        </div>
    );
}
