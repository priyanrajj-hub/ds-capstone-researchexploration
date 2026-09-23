import React from 'react';
import Link from 'next/link';

interface PageTemplateProps {
    title: string;
    definition: string;
    whyItExists: React.ReactNode;
    complexity?: { space: string; time: string };
    industryLink?: string;
    prevPage?: { name: string; path: string };
    nextPage?: { name: string; path: string };
    children: React.ReactNode;
}

export default function PageTemplate({
    title,
    definition,
    whyItExists,
    complexity,
    industryLink,
    prevPage,
    nextPage,
    children
}: PageTemplateProps) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 lg:px-12 w-full flex flex-col min-h-[calc(100vh-64px)]">
            <div className="space-y-4 mb-10 border-b border-white/10 pb-8">
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                    {title}
                </h1>
                <p className="text-xl text-[#1C7293] font-medium leading-relaxed">
                    {definition}
                </p>
                <div className="text-gray-300 text-lg leading-relaxed mt-6 space-y-4 font-light">
                    {whyItExists}
                </div>
            </div>

            {/* Core Visualization Mount Point */}
            <div className="w-full relative mb-12">
                {children}
            </div>

            {/* Complexity & Industry Callouts */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
                {complexity && (
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-2">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Theoretical Complexity</h4>
                        <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg">
                            <span className="text-gray-400">Space (Memory)</span>
                            <span className="font-mono font-bold text-red-400">{complexity.space}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg">
                            <span className="text-gray-400">Time (Retrieval)</span>
                            <span className="font-mono font-bold text-[#40c057]">{complexity.time}</span>
                        </div>
                    </div>
                )}
                {industryLink && (
                    <div className="bg-black/20 p-6 rounded-2xl border border-[#1C7293]/20 flex flex-col justify-center space-y-4">
                        <h4 className="text-sm font-bold text-[#1C7293] uppercase tracking-widest">Industry Application</h4>
                        <p className="text-gray-400">See how this exact concept is applied in production at massive scale.</p>
                        <Link href={industryLink} className="text-white bg-[#1C7293]/10 hover:bg-[#1C7293]/20 border border-[#1C7293]/30 px-4 py-2 rounded-lg font-bold transition-colors w-max">
                            View Production Use Cases →
                        </Link>
                    </div>
                )}
            </div>

            <div className="flex-1" /> {/* Spacer */}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 mt-12 gap-4">
                <div className="w-full sm:w-1/2">
                    {prevPage && (
                        <Link href={prevPage.path} className="group flex flex-col items-start bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Previous</span>
                            <span className="text-white font-medium group-hover:-translate-x-1 transition-transform">← {prevPage.name}</span>
                        </Link>
                    )}
                </div>
                <div className="w-full sm:w-1/2 text-right">
                    {nextPage && (
                        <Link href={nextPage.path} className="group flex flex-col items-end bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Next Topic</span>
                            <span className="text-white font-medium group-hover:translate-x-1 transition-transform">{nextPage.name} →</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
