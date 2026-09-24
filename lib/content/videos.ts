export type VideoContent = {
    algorithmId: string;
    title: string;
    channel: string;
    videoId: string | null;
    startSeconds?: number;
    language?: "en";
    searchQuery?: string; // used for placeholder
};

export const ALGORITHM_VIDEOS: VideoContent[] = [
    {
        algorithmId: 'bfs-nhop',
        title: 'Graph basics, BFS/DFS',
        channel: 'William Fiset / Abdul Bari',
        videoId: null,
        searchQuery: 'BFS graph traversal William Fiset',
        language: 'en'
    },
    {
        algorithmId: 'ppr',
        title: 'PageRank and Random Walks with Restart',
        channel: 'Stanford CS224W / Computerphile',
        videoId: null,
        searchQuery: 'CS224W PageRank random walks restart',
        language: 'en'
    },
    {
        algorithmId: 'common-neighbors',
        title: 'Link Prediction & Node Embeddings',
        channel: 'Stanford CS224W',
        videoId: null,
        searchQuery: 'CS224W link prediction node embeddings',
        language: 'en'
    },
    {
        algorithmId: 'jaccard',
        title: 'Link Prediction & Node Embeddings',
        channel: 'Stanford CS224W',
        videoId: null,
        searchQuery: 'CS224W link prediction node embeddings',
        language: 'en'
    },
    {
        algorithmId: 'adamic-adar',
        title: 'Link Prediction & Node Embeddings',
        channel: 'Stanford CS224W',
        videoId: null,
        searchQuery: 'CS224W link prediction node embeddings',
        language: 'en'
    },
    {
        algorithmId: 'ranking',
        title: 'Logistic Regression',
        channel: 'StatQuest with Josh Starmer',
        videoId: null,
        searchQuery: 'StatQuest logistic regression',
        language: 'en'
    },
    {
        algorithmId: 'ranking', // second video for ranking
        title: 'Gradient Boosting (GBDT)',
        channel: 'StatQuest',
        videoId: null,
        searchQuery: 'StatQuest gradient boost',
        language: 'en'
    },
    {
        algorithmId: 'embeddings',
        title: 'ANN / HNSW Graph Search',
        channel: 'Pinecone / James Briggs',
        videoId: null,
        searchQuery: 'HNSW explained Pinecone',
        language: 'en'
    },
    {
        algorithmId: 'pipeline',
        title: 'Two-Tower Recommenders',
        channel: 'Google Developers',
        videoId: null,
        searchQuery: 'two tower retrieval recommender explained',
        language: 'en'
    }
];

export const getVideosForAlgorithm = (id: string): VideoContent[] => {
    return ALGORITHM_VIDEOS.filter(v => v.algorithmId === id);
};
