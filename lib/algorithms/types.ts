export interface AlgorithmStep {
    stepIndex: number;
    totalSteps: number;
    action: 'visit' | 'enqueue' | 'dequeue' | 'skip' | 'score' | 'rank' | 'output' | 'done' | 'info' | 'highlight';
    currentNode?: string;
    queueContents?: string[];
    visitedSet?: string[];
    scoreTable?: Record<string, number>;
    walkPath?: string[];
    stepExplanation: string;

    // Legacy support for highlights
    highlightNodes?: string[];
    highlightEdges?: { u: string, v: string }[];
    scores?: Record<string, number>;
    message?: string;
    codeLine?: number;
}

export interface QuizQuestion {
    type: 'trace' | 'mcq' | 'predict';
    prompt: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
}

export interface AlgorithmContent {
    id: string;
    title: string;
    realWorldHook: string;
    howItWorks: string[];
    whenToUse: string;
    whenNotToUse: string;
    complexity: { time: string; space: string; note: string };
    comparedTo: { algorithmId: string; tradeoff: string }[];
    pitfalls: string[];
    quiz: QuizQuestion[];

    // Legacy fields maintained temporarily
    intuition?: string;
    pseudocode: string;
    workedExample?: string;
    whenItFails?: string;
    prevId: string | null;
    nextId: string | null;
}
