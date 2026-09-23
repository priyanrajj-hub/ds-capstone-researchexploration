import "./globals.css";
import 'katex/dist/katex.min.css';
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
            <body className="antialiased min-h-screen font-sans bg-navy text-light">
                <GlobalLayoutWrapper>
                    {children}
                </GlobalLayoutWrapper>
            </body>
        </html>
    );
}
