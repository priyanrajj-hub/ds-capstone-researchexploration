# Friend Recommendation System in Social Networks

*From real product UI to graph algorithms, ranking models, and user feedback.*

This repository contains the interactive explainer website built for researching and visualizing how Social Networks implement Friend Recommendation Systems (like LinkedIn's "People You May Know" widget) at a billion-user scale.

---

## 🔍 What is being solved?

Given a social graph **G = (V, E)**, where V represents users and E represents connections, the goal is to find non-adjacent pairs (u, v) that are highly likely to form a future connection.

## 🚀 Why it matters?

- **Helps users** discover relevant people and expand their network.
- **Increases engagement** and overall network growth.
- **Builds professional opportunities** for users globally.
- **Requires extremely efficient algorithms** to scale to millions or billions of active users.

---

## ⚙️ The Industrial Recommendation Pipeline

The recommendation system follows a strict 5-step cyclic pipeline:

### 1. Graph Data

*Users and their relationships.*
The raw data structural representation is **G = (V, E)**. User nodes are connected by edges representing confirmed friendships or follows.

### 2. Candidate Generation (Retrieval)

*Find a small set of plausible candidates from a large user base.*

- **Graph-based retrieval:** N-hop traversal, Personalized PageRank (PPR), Common Neighbors.
- **Embedding-based retrieval:** Two-Tower Neural Networks, ANN (Approximate Nearest Neighbor).
- **Heuristic retrieval:** Matching by same company, school, or location.
**Output:** A few thousand candidates narrowed down from 1B+ users.

### 3. Ranking

*Score and rank candidates using multiple signals.*

- **Feature generation:** Extracting graph topology, profile similarity, and historical behavior.
- **Ranking models:** Logistic Regression, Gradient Boosted Decision Trees (GBDT), Neural models.
- **Re-ranking:** Adjusting for diversity, freshness, and strict business rules.
**Output:** The absolute Top-K recommendations (e.g., the top 10–50 users).

### 4. User Interface

*Display personalized recommendations.*
The final Top-K candidates are rendered into UI cards (e.g., the LinkedIn "Connections you may know" carousel). Each card is the resulting proof of retrieval + ranking + business algorithms running in real-time.

### 5. Feedback Loop

*User actions continuously improve the system.*

- **Connect** (Positive Explicit Signal)
- **Remove** (Negative Explicit Signal)
- **View Profile** (Implicit Signal)
- **Other Interactions** (Clicks, follows, messages)
*This feedback is strictly used to retrain the ML models and update the dynamic graph!*

---

## 🧮 Key Algorithms Used in Industry

- **N-hop / BFS** (Graph Traversal)
- **Common Neighbors, Jaccard, Adamic–Adar** (Topological Scoring)
- **Personalized PageRank (PPR)** (Random Walks)
- **Two-Tower Neural Network** (Embedding Retrieval)
- **Approximate Nearest Neighbor (ANN) Search**
- **Logistic Regression / Gradient Boosting** (Ranking)
- **Neural Ranking / Multi-task Learning**
- **Heuristic rules** (Geospatial and categorical overlaps)

## 🌍 Real-World Scale (e.g., LinkedIn)

- **1B+ users** (Inventory)
- **Few thousand candidates** filtered after initial retrieval.
- **Few hundred** candidates retained after initial AI ranking.
- **Top-K (e.g., 10–50)** actually shown in the UI.
- The system must constantly optimize for **relevance, diversity, fairness, latency, and compute cost**.

## 🎯 Final Outcome

- More meaningful professional connections.
- Higher overall user engagement.
- A continuously improving, scalable, and highly efficient system powered entirely by user feedback and graph data structures.
