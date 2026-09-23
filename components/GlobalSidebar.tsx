"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, X, Search, BookOpen } from 'lucide-react';

const navData = [
    {
        category: "PROBLEM",
        routes: [
            { name: "Overview", path: "/" },
            { name: "Why a Graph?", path: "/problem/why-graph" }
        ]
    },
    {
        category: "DATA STRUCTURES",
        routes: [
            { name: "Adjacency Matrix", path: "/structures/matrix" },
            { name: "Edge List (SQL Table)", path: "/structures/edge-list" },
            { name: "Adjacency List (Graph)", path: "/structures/adjacency-list" },
            { name: "Matrix vs List vs Edge List", path: "/structures/comparison" }
        ]
    },
    {
        category: "CANDIDATE GENERATION",
        routes: [
            { name: "BFS Traversal (Rec-Engine 3D)", path: "/candidates/bfs" },
            { name: "N-Hop Neighborhoods", path: "/candidates/n-hop" }
        ]
    },
    {
        category: "RANKING ALGORITHMS",
        routes: [
            { name: "Common Neighbors", path: "/ranking/common-neighbors" },
            { name: "Jaccard Coefficient", path: "/ranking/jaccard" },
            { name: "Adamic–Adar Index", path: "/ranking/adamic-adar" },
            { name: "Preferential Attachment", path: "/ranking/preferential-attachment" },
            { name: "Personalized PageRank", path: "/ranking/ppr" },
            { name: "Algorithm Comparison", path: "/ranking/comparison" }
        ]
    },
    {
        category: "INDUSTRY & SCALE",
        routes: [
            { name: "Real Applications", path: "/industry/applications" },
            { name: "Billion-User Scale Challenges", path: "/industry/scale" }
        ]
    },
    {
        category: "REFLECTION",
        routes: [
            { name: "Limitations", path: "/limitations" },
            { name: "Future Scope", path: "/future" },
            { name: "References", path: "/references" }
        ]
    }
];

export default function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSimpleMode, setIsSimpleMode] = useState(false);

    // Default all categories to open
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        navData.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {})
    );

    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('explainer_mode');
        if (stored === 'simple') setIsSimpleMode(true);
    }, []);

    const toggleMode = () => {
        const newMode = !isSimpleMode;
        setIsSimpleMode(newMode);
        localStorage.setItem('explainer_mode', newMode ? 'simple' : 'technical');
        // We broadcast this setting up in future iteration via Context, for now LocalStorage works well on page load
        window.dispatchEvent(new Event('storage'));
    };

    const toggleCategory = (cat: string) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    return (
        <div className="flex bg-navy text-white min-h-screen font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#12183a] border-r border-white/10 
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:flex-shrink-0
            `}>
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <Link href="/" className="font-serif font-bold text-lg leading-tight flex items-center gap-2 text-white">
                        <BookOpen size={20} className="text-[#1C7293]" />
                        <span>Friend Rec<br /><span className="text-[#1C7293]">Explainer</span></span>
                    </Link>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find a topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1C7293]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {navData.map((group, idx) => {
                        const filteredRoutes = group.routes.filter(r =>
                            r.name.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (searchQuery && filteredRoutes.length === 0) return null;

                        const isOpen = openCategories[group.category];

                        return (
                            <div key={idx} className="space-y-1">
                                <button
                                    className="flex items-center justify-between w-full text-left text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white mb-2"
                                    onClick={() => toggleCategory(group.category)}
                                >
                                    {group.category}
                                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>

                                {isOpen && (
                                    <div className="space-y-1">
                                        {filteredRoutes.map((route, rIdx) => {
                                            const isActive = pathname === route.path;
                                            return (
                                                <Link
                                                    key={rIdx}
                                                    href={route.path}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`
                                                      block px-3 py-1.5 rounded-md text-sm transition-colors border-l-2
                                                      ${isActive
                                                            ? 'bg-[#1C7293]/10 text-white border-[#1C7293] font-medium'
                                                            : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-200'}
                                                    `}
                                                >
                                                    {route.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0F24]">
                {/* Top Navigation */}
                <header className="h-16 border-b border-white/10 bg-[#12183a]/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-400 hover:text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="font-serif font-bold text-lg md:text-xl hidden sm:block text-gray-200">
                            Friend Recommendation Systems
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-black/40 p-1 rounded-full border border-white/10 relative shadow-inner">
                            <button
                                onClick={() => !isSimpleMode && toggleMode()}
                                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 z-10 ${!isSimpleMode ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Technical
                            </button>
                            <button
                                onClick={() => isSimpleMode && toggleMode()}
                                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 z-10 ${isSimpleMode ? 'text-black' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                <span className="mr-1">🏠</span> Simple
                            </button>
                            <div className={`absolute top-1 bottom-1 w-1/2 rounded-full transition-transform duration-300 shadow-sm ${!isSimpleMode ? 'bg-[#1C7293] left-1' : 'bg-[#40c057] translate-x-[calc(100%-8px)]'}`} />
                        </div>
                    </div>
                </header>

                {/* Page Content Container */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
