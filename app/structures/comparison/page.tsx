import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import SimulationRace from '@/components/SimulationRace';
import SpaceComplexitySlider from '@/components/SpaceComplexitySlider';

export default function StructuresComparisonPage() {
    return (
        <PageTemplate
            title="Matrix vs List vs Edge List"
            definition="The ultimate showdown in space-time complexity."
            whyItExists={
                <>
                    <p>
                        We cannot intuitively judge billions of computations. Big-O notation is designed to give us mathematical certainty about how these data structures perform when N goes from 50 to 5,000,000,000.
                    </p>
                    <p>
                        Below, the race proves exactly why the adjacency matrix shoots off the memory cliff, and the edge list takes astronomically long to scan.
                    </p>
                </>
            }
            prevPage={{ name: "Adjacency List", path: "/structures/adjacency-list" }}
            nextPage={{ name: "BFS Traversal", path: "/candidates/bfs" }}
        >
            <div className="flex flex-col gap-12 mt-8">
                <SimulationRace />

                {/* Simulated dummy graph to pass into Space Slider */}
                <SpaceComplexitySlider graph={null} />
            </div>
        </PageTemplate>
    );
}
