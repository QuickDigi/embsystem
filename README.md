# 📄 **README.md (Final Professional Edition)**

````md
<h1 align="center">EmbSystem</h1>
<p align="center">
  <b>A lightweight semantic text embedding engine built in TypeScript.</b><br>
  Fast, dependency-free, and perfect for AI pipelines, semantic search, clustering, and NLP tasks.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" />
  <img src="https://img.shields.io/badge/language-TypeScript-3178c6.svg" />
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg" />
  <img src="https://img.shields.io/badge/platform-Node.js%2024+-green.svg" />
</p>

---

## 🔥 Overview

**EmbSystem** is a minimal, high-performance embedding engine designed for:

- Semantic Text Encoding
- Similarity Search
- Clustering
- NLP Preprocessing
- Lightweight AI Memory Systems
- Retrieval-Augmented Generation (RAG)
- DeepAIM internal components

Unlike heavy ML frameworks, **EmbSystem** requires no TensorFlow, PyTorch, or WASM.  
It runs purely on TypeScript and CPU — fast, predictable, and extremely portable.

---

## ✨ Key Features

- ⚡ **Fast hashing-based embeddings**
- 🔍 **Semantic similarity scoring**
- 📚 **Keyword decoding (reverse embedding)**
- 🧠 **K-Means clustering included**
- 🌐 **Multi-language support (English & Arabic)**
- 🧩 **128–1024 dimensional vectors**
- 💼 **100% TypeScript, zero dependencies**
- 🚀 **Runs on Node.js 20+ / 24+**
- 🧪 **Perfect for building lightweight AI pipelines**

---

## 📦 Installation

Clone or include in any Node.js project:

```bash
npm install
```
````

(Optional) Build TypeScript:

```bash
npm run build
```

---

## 🧠 Usage Example

```ts
import EmbeddingSystem from "./src/embedding.js";

const texts = [
  "Machine learning is amazing",
  "Deep learning uses neural networks",
  "Python is great for AI",
  "Natural language processing",
  "التعلم الآلي رائع",
  "الشبكات العصبية قوية",
];

EmbeddingSystem.initialize(texts, 128);

const embedding = EmbeddingSystem.encode("machine learning");
console.log("Embedding:", embedding.slice(0, 5), "...");

const decoded = EmbeddingSystem.decode(embedding, 3);
console.log("Decoded words:", decoded);

const results = EmbeddingSystem.semanticSearch("neural networks", texts, 3);
console.log("Semantic Search:", results);

const clusters = EmbeddingSystem.cluster(texts, 2);
console.log("Clusters:", clusters);

console.log("System Info:", EmbeddingSystem.getInfo());
```

---

## 🧪 Sample Output

```
Embedding: [0.01, -0.03, -0.12, 0.07, 0.002 ...]

Decoded words:
[ "machine", "learning", "deep" ]

Semantic Search:
Score: 0.610 - Deep learning uses neural networks
Score: 0.098 - Natural language processing
Score: -0.001 - Python is great for AI

Clusters:
Cluster 0: ["Python is great for AI", "الشبكات العصبية قوية"]
Cluster 1: ["Machine learning is amazing", "Deep learning uses neural networks", "Natural language processing", "التعلم الآلي رائع"]

System Info:
{ vocabularySize: 21, dimension: 128, isInitialized: true }
```

---

## 🗂 Project Structure

```
src/
  embedding.ts
test.ts
package.json
README.md
```

---

## 🛠 Scripts

```bash
npm run dev     # Runs src/main.js
npm run test    # Runs test.js
npm run build   # Compiles TypeScript into dist/
npm start       # Runs dist/main.js after build
```

---

## 📜 License

**MIT License**
Created by **QuickDigi** 💙

---

## 🌟 Contribution

Pull requests and improvements are always welcome!
If you use EmbSystem in your project, feel free to share your work.

---
