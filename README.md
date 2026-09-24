# Friend Recommendation System in Social Networks

*From real product UI to graph algorithms, ranking models, and user feedback.*

This repository contains the interactive explainer website built for researching and visualizing how Social Networks implement Friend Recommendation Systems (like LinkedIn's "People You May Know" widget) at a billion-user scale.

![Hero Screenshot Placeholder](/public/placeholder-hero.png)

## ✨ Features

- **Interactive Graph Visualizer:** Build your own graph, draw edges, and watch algorithms traverse it step-by-step.
- **Topological Algorithm Generators:** Animated generators for BFS, Common Neighbors, Jaccard, Adamic-Adar, PPR, and min-heaps.
- **Industrial ML Pipeline Funnel:** A 5-stage interactive tradeoff slider demonstrating cost vs recall at 1B+ scale.
- **Ranking Lab:** Adjust Logistic Regression weights and see Re-ranking candidate diversity penalties in real-time.
- **Vector Embeddings & ANN:** Visual scatter-plot comparison of Brute Force vs Grid-based Approximate Nearest Neighbors (ANN) simulating Two-Tower architecture.
- **Cyclic Feedback Loop:** A mini-game simulating user connections and UI interactions to automatically retrain the affinity model.
- **Metrics Dashboard:** Real-time offline metric charts simulating Precision@K, Recall@K, NDCG@K and ROC curves.

## 🧮 Algorithm Table

| Algorithm | Category | Complexity | Intuition |
| --- | --- | --- | --- |
| BFS N-Hop | Candidate Gen | `O(d^k)` | Triadic closure 2nd degree search. |
| Common Neighbors | Heuristic | `O(N)` | Intersection size of mutual friends. |
| Jaccard Similarity | Heuristic | `O(N)` | Normalized intersection over union. |
| Adamic-Adar | Heuristic | `O(N)` | Strongly penalizes highly popular mutual friends (hubs). |
| Personalized PageRank | Random Walk | `O(Walks*Steps)` | Walk probability distribution favoring local clusters. |
| Min-Heap (Top K) | Selection | `O(N log K)` | Selects the absolute best K candidates efficiently. |

## 🛠 How to run locally

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Folder Structure

```text
graph-explainer/
├── lib/
│   ├── graph/           # Pure TS adjacency-list Graph engine
│   └── algorithms/      # Step generators (BFS, Jaccard, Adamic-Adar, PPR)
├── components/
│   └── visualizer/      # SVG GraphCanvas, Playback Controls, CodePanel
└── app/
    ├── algorithms/      # Dynamic algorithm pages mapped to lib data
    ├── pipeline/        # Funnel slider demo
    ├── ranking/         # Logistic regression lab
    ├── embeddings/      # Simulated Two-Tower ANN vector space
    ├── feedback/        # Explicit/Implicit feedback loop UI
    ├── evaluation/      # Precision@K & NDCG Charts
    └── learn/           # Citations and academic overview
```

## 🏆 Credits

- UX design inspired by [See Algorithms](https://see-algorithms.com/), heavily utilizing interactive step-playback. (Note: No code or content was copied directly from See Algorithms).
- Citations: Liben-Nowell & Kleinberg (2007), Adamic & Adar (2003), Backstrom & Leskovec (2011), Pinterest Pixie, HNSW, GraphSAGE.
