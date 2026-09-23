import "./globals.css";
import type { Metadata } from 'next';
import GlobalLayoutWrapper from "@/components/GlobalSidebar";

export const metadata: Metadata = {
    title: "Friend Recommendation Systems",
    description: "Visualize How Friend Recommendation Actually Works",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css" />
            </head>
            <body className="antialiased min-h-screen font-sans bg-navy text-light">
                <GlobalLayoutWrapper>
                    {children}
                </GlobalLayoutWrapper>
            </body>
        </html>
    );
}
