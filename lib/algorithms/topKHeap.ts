import { AlgorithmStep } from './types';

export interface Candidate {
    id: string;
    score: number;
}

export function* topKHeap(k: number, candidates: Candidate[]): Generator<AlgorithmStep, Candidate[], unknown> {
    yield { type: 'info', message: `Initializing Min-Heap of size K = ${k}.`, codeLine: 1 };

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
        yield { type: 'highlight', highlightNodes: [candidate.id], message: `Evaluating candidate ${candidate.id} with score ${candidate.score.toFixed(2)}.`, codeLine: 3 };

        if (heap.length < k) {
            push(candidate);
            yield { type: 'info', highlightNodes: [candidate.id], message: `Heap has room (< ${k}). Pushed ${candidate.id}. Heap min is now ${heap[0].score.toFixed(2)}.`, codeLine: 5 };
        } else {
            if (candidate.score > heap[0].score) {
                yield { type: 'info', message: `${candidate.score.toFixed(2)} > min node ${heap[0].score.toFixed(2)}. Replacing min.`, codeLine: 7 };
                pop();
                push(candidate);
            } else {
                yield { type: 'info', message: `${candidate.score.toFixed(2)} <= min node ${heap[0].score.toFixed(2)}. Discarding.`, codeLine: 9 };
            }
        }
    }

    // Sort descending for final result
    heap.sort((a, b) => b.score - a.score);

    yield { type: 'done', message: `Finished. Top K heap contains best ${heap.length} candidates.`, codeLine: 13 };
    return heap;
}
