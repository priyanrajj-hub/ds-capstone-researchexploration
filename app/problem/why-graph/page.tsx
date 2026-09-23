import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function WhyGraphPage() {
    return (
        <PageTemplate
            title="Why a Graph?"
            definition="The mathematical foundation for modeling interconnected relationships."
            whyItExists={
                <>
                    <p>
                        Traditional relational databases (SQL) represent data in tables, which is excellent for standardized, disconnected records (like e-commerce orders). But human relationships are fundamentally interconnected.
                    </p>
                    <p>
                        A graph treats the <i>relationship</i> (the edge) as a first-class citizen, just as important as the <i>entity</i> (the node). This allows us to traverse vast social webs organically without expensive SQL JOIN operations that exponentially degrade performance at massive scale.
                    </p>
                </>
            }
            prevPage={{ name: "Overview", path: "/" }}
            nextPage={{ name: "Adjacency Matrix", path: "/structures/matrix" }}
        >
            <div className="p-8 bg-black/20 rounded-2xl border border-white/10 mt-6 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-2xl font-serif text-white mb-4">The Power of Edges</h3>
                    <p className="text-gray-400 mb-4">When querying "friends of friends" (2 hops) in an SQL database, you must JOIN a massive table against itself. For billions of users, this breaks server RAM instantly.</p>
                    <p className="text-[#1C7293] font-bold">Graph traversal bypasses the table completely and leaps straight through memory pointers.</p>
                </div>
                <div className="aspect-square bg-navy/50 rounded-lg flex items-center justify-center border border-[#1C7293]/30">
                    <span className="text-gray-500 italic opacity-50">Illustration: SQL JOIN vs Graph Traversal</span>
                </div>
            </div>
        </PageTemplate>
    );
}