import { AlgorithmStep } from './types';

export interface Candidate {
    id: string;
    score: number;
}

export function* topKHeap(k: number, candidates: Candidate[]): Generator<AlgorithmStep, Candidate[], unknown> {
    yield {
        stepIndex: 0, totalSteps: 0, action: 'info',
        stepExplanation: `Initializing a Min-Heap of bounded size K = ${k}. A Min-Heap allows us to cheaply discard the lowest scores on the fly while retaining the highest scores without storing the whole graph.`,
        codeLine: 1
    };

    const heap: Candidate[] = [];

    const push = (item: Candidate) => {
        heap.push(item);
        let i = heap.length - 1;
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (heap[p].score <= heap[i].score) break;
            [heap[p], heap[i]] = [heap[i], heap[p]];
            i = p;
        }
    };

    const pop = () => {
        if (heap.length === 0) return;
        heap[0] = heap[heap.length - 1];
        heap.pop();
        let i = 0;
        while (2 * i + 1 < heap.length) {
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            let minChild = left;
            if (right < heap.length && heap[right].score < heap[left].score) {
                minChild = right;
            }
            if (heap[i].score <= heap[minChild].score) break;
            [heap[i], heap[minChild]] = [heap[minChild], heap[i]];
            i = minChild;
        }
    };

    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];

        yield {
            stepIndex: 0, totalSteps: 0, action: 'visit',
            highlightNodes: [candidate.id],
            currentNode: candidate.id,
            queueContents: heap.map(h => `${h.id}(${h.score.toFixed(2)})`),
            stepExplanation: `Processing candidate ${candidate.id} having score ${candidate.score.toFixed(2)}.`,
            codeLine: 3
        };

        if (heap.length < k) {
            push(candidate);
            yield {
                stepIndex: 0, totalSteps: 0, action: 'enqueue',
                highlightNodes: [candidate.id],
                currentNode: candidate.id,
                queueContents: heap.map(h => `${h.id}(${h.score.toFixed(2)})`),
                stepExplanation: `Heap array length (${heap.length}) is strictly less than K (${k}). Appending candidate. Min root is now ${heap[0].score.toFixed(2)}.`,
                codeLine: 5
            };
        } else {
            if (candidate.score > heap[0].score) {
                yield {
                    stepIndex: 0, totalSteps: 0, action: 'dequeue',
                    currentNode: candidate.id,
                    queueContents: heap.map(h => `${h.id}(${h.score.toFixed(2)})`),
                    stepExplanation: `Candidate score ${candidate.score.toFixed(2)} is strictly greater than the absolute smallest heap element ${heap[0].score.toFixed(2)}. Popping the smallest element out.`,
                    codeLine: 7
                };
                pop();
                push(candidate);
                yield {
                    stepIndex: 0, totalSteps: 0, action: 'enqueue',
                    currentNode: candidate.id,
                    queueContents: heap.map(h => `${h.id}(${h.score.toFixed(2)})`),
                    stepExplanation: `Replacing previous root with new candidate ${candidate.id}. The heap rearranges itself organically.`,
                    codeLine: 7
                };
            } else {
                yield {
                    stepIndex: 0, totalSteps: 0, action: 'skip',
                    currentNode: candidate.id,
                    queueContents: heap.map(h => `${h.id}(${h.score.toFixed(2)})`),
                    stepExplanation: `Candidate score ${candidate.score.toFixed(2)} is worse than or equal to the minimum acceptable score ${heap[0].score.toFixed(2)}. Discarding immediately without memory allocation.`,
                    codeLine: 9
                };
            }
        }
    }

    // Sort descending for final result
    heap.sort((a, b) => b.score - a.score);

    yield {
        stepIndex: 0, totalSteps: 0, action: 'done',
        queueContents: heap.map(h => `${h.id}(${h.score.toFixed(2)})`),
        stepExplanation: `Finished. The heap exclusively isolated the universally best ${heap.length} candidates in O(N log K) time.`,
        codeLine: 13
    };

    return heap;
}
