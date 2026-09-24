import React, { useState } from 'react';
import { getVideosForAlgorithm, VideoContent } from '../lib/content/videos';
import { PlayCircle, Video as VideoIcon, Search } from 'lucide-react';

export default function VideoTab({ algorithmId }: { algorithmId: string }) {
    const videos = getVideosForAlgorithm(algorithmId);

    if (videos.length === 0) {
        return (
            <div className="bg-white/5 border border-white/5 p-8 rounded-xl text-center flex flex-col items-center">
                <VideoIcon size={48} className="text-gray-600 mb-4" />
                <h3 className="text-white font-bold text-lg">No Videos Available</h3>
                <p className="text-sm text-gray-400 mt-2">We don't have curated videos for this specific algorithm yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {videos.map((video, idx) => (
                <VideoCard key={idx} video={video} />
            ))}
        </div>
    );
}

function VideoCard({ video }: { video: VideoContent }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const embedUrl = video.videoId
        ? `https://www.youtube-nocookie.com/embed/${video.videoId}${video.startSeconds ? `?start=${video.startSeconds}&autoplay=1` : '?autoplay=1'}`
        : null;

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5">
                <h4 className="text-white font-bold">{video.title}</h4>
                <p className="text-xs text-teal mt-1">{video.channel}</p>
            </div>

            <div className="relative w-full aspect-video bg-black/40 flex items-center justify-center group overflow-hidden">
                {video.videoId ? (
                    isLoaded ? (
                        <iframe
                            src={embedUrl!}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    ) : (
                        <button
                            onClick={() => setIsLoaded(true)}
                            className="absolute inset-0 w-full h-full flex items-center justify-center hover:bg-white/5 transition group"
                        >
                            <PlayCircle size={64} className="text-white/50 group-hover:text-ocean transition-all group-hover:scale-110" />
                        </button>
                    )
                ) : (
                    <div className="flex flex-col items-center text-center p-6 space-y-4 w-full">
                        <Search size={40} className="text-orange-500/80" />
                        <div>
                            <h5 className="text-white font-bold">Video Coming Soon</h5>
                            <p className="text-xs text-gray-400 mt-1">Pending community verification.</p>
                        </div>
                        <div className="w-full bg-navy p-3 rounded text-left border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Suggested Search Query:</p>
                            <p className="text-sm font-mono text-gray-300">{video.searchQuery}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
