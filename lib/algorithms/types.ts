export interface AlgorithmStep {
    type: 'info' | 'highlight' | 'compare' | 'score' | 'done';
    highlightNodes?: string[];
    highlightEdges?: { u: string, v: string }[];
    scores?: Record<string, number>;
    message: string;
    codeLine?: number;
}
