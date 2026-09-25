import "./globals.css";

import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import { ProgressProvider } from '@/lib/context/ProgressContext';
export const metadata: Metadata = {
    title: "Why Graphs Power Friend Recommendations",
    description: "An interactive explainer on Friend Recommendation Systems.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
            </head>
            <body className="antialiased min-h-screen font-sans bg-navy text-light flex md:flex-row flex-col">
                <ProgressProvider>
                    <Sidebar />
                    <main className="flex-1 w-full h-[100vh] overflow-y-auto relative">
                        {children}
                    </main>
                </ProgressProvider>
            </body>
        </html>
    );
}
