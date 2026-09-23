import React from 'react';
import PageTemplate from '@/components/PageTemplate';

export default function EdgeListPage() {
    return (
        <PageTemplate
            title="Edge List (SQL Table)"
            definition="The standard flat database structure driving relational joins."
            whyItExists={
                <p>
                    An edge list stores only existing edges: O(E) space efficiency. This maps perfectly to traditional Relational SQL standard tables. But finding all friends of a person requires an O(E) full table scan.
                </p>
            }
            complexity={{ space: "O(E)", time: "O(E)" }}
            industryLink="/industry/applications"
            prevPage={{ name: "Adjacency Matrix", path: "/structures/matrix" }}
            nextPage={{ name: "Adjacency List", path: "/structures/adjacency-list" }}
        >
            <div className="h-64 flex items-center justify-center bg-black/20 rounded-2xl border border-[#E86A33]/20">
                <span className="text-gray-400 font-mono tracking-widest">[ Edge List Visualizer Mount Point ]</span>
            </div>
        </PageTemplate>
    );
}
