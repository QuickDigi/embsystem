import EmbeddingSystem from "./src/embedding.ts";

const texts = [
    "Machine learning is amazing",
    "Deep learning uses neural networks",
    "Python is great for AI",
    "Natural language processing",
    "التعلم الآلي رائع",
    "الشبكات العصبية قوية"
];

EmbeddingSystem.initialize(texts, 128);

const embedding = EmbeddingSystem.encode("machine learning");
console.log("Embedding:", embedding.slice(0, 5), "...");

const words = EmbeddingSystem.decode(embedding, 3);
console.log("Decoded words:", words);

const results = EmbeddingSystem.semanticSearch(
    "neural networks",
    texts,
    3
);
console.log("\nSemantic Search Results:");
results.forEach(r => {
    console.log(`Score: ${r.score.toFixed(3)} - ${r.text}`);
});

const clusters = EmbeddingSystem.cluster(texts, 2);
console.log("\nClusters:");
clusters.forEach((texts, clusterIdx) => {
    console.log(`Cluster ${clusterIdx}:`, texts);
});

console.log("\nSystem Info:", EmbeddingSystem.getInfo());