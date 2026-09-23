import "./globals.css";
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';

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
            <body className="antialiased min-h-screen font-sans bg-navy text-light">{children}</body>
        </html>
    );
}
