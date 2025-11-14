
export default class EmbeddingSystem {
    private static tokenizer: Map<string, number> = new Map();
    private static vocabulary: string[] = [];
    private static embeddings: Map<number, number[]> = new Map();
    private static dimension: number = 128;

    /**
     * تهيئة النظام وبناء المفردات
     */
    static initialize(texts: string[], embeddingDim: number = 128): void {
        this.dimension = embeddingDim;
        this.buildVocabulary(texts);
        this.initializeEmbeddings();
    }

    /**
     * بناء المفردات من النصوص
     */
    private static buildVocabulary(texts: string[]): void {
        const words = new Set<string>();

        texts.forEach(text => {
            const tokens = this.tokenize(text);
            tokens.forEach(token => words.add(token));
        });

        this.vocabulary = Array.from(words);
        this.vocabulary.forEach((word, idx) => {
            this.tokenizer.set(word, idx);
        });
    }

    /**
     * تقسيم النص إلى tokens
     */
    private static tokenize(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 0);
    }

    /**
     * تهيئة embeddings عشوائية
     */
    private static initializeEmbeddings(): void {
        this.vocabulary.forEach((word, idx) => {
            const embedding = this.randomVector(this.dimension);
            this.embeddings.set(idx, embedding);
        });
    }

    /**
     * إنشاء vector عشوائي
     */
    private static randomVector(dim: number): number[] {
        const vector: number[] = [];
        for (let i = 0; i < dim; i++) {
            vector.push((Math.random() - 0.5) * 2);
        }
        return this.normalize(vector);
    }

    /**
     * تطبيع vector
     */
    private static normalize(vector: number[]): number[] {
        const magnitude = Math.sqrt(
            vector.reduce((sum, val) => sum + val * val, 0)
        );
        return magnitude > 0
            ? vector.map(val => val / magnitude)
            : vector;
    }

    /**
     * Encode: تحويل النص إلى embedding vector
     */
    static encode(text: string): number[] {
        const tokens = this.tokenize(text);
        if (tokens.length === 0) {
            return new Array(this.dimension).fill(0);
        }

        const vectors: number[][] = [];

        tokens.forEach(token => {
            const idx = this.tokenizer.get(token);
            if (idx !== undefined) {
                const embedding = this.embeddings.get(idx);
                if (embedding) {
                    vectors.push(embedding);
                }
            }
        });

        if (vectors.length === 0) {
            return new Array(this.dimension).fill(0);
        }

        // حساب المتوسط
        const avgVector = new Array(this.dimension).fill(0);
        vectors.forEach(vec => {
            vec.forEach((val, i) => {
                avgVector[i] += val;
            });
        });

        return this.normalize(
            avgVector.map(val => val / vectors.length)
        );
    }

    /**
     * Decode: تحويل embedding إلى أقرب كلمات
     */
    static decode(embedding: number[], topK: number = 5): string[] {
        const similarities: Array<{ word: string, similarity: number }> = [];

        this.vocabulary.forEach((word, idx) => {
            const wordEmbedding = this.embeddings.get(idx);
            if (wordEmbedding) {
                const sim = this.cosineSimilarity(embedding, wordEmbedding);
                similarities.push({ word, similarity: sim });
            }
        });

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK)
            .map(item => item.word);
    }

    /**
     * Embed: تحويل النص إلى embedding (alias for encode)
     */
    static embed(text: string, dimension?: number): number[] {
        if (dimension && dimension !== this.dimension) {
            console.warn(`Dimension mismatch. Using initialized dimension: ${this.dimension}`);
        }
        return this.encode(text);
    }

    /**
     * حساب Cosine Similarity بين vectors
     */
    static cosineSimilarity(vec1: number[], vec2: number[]): number {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have same dimension');
        }

        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            mag1 += vec1[i] * vec1[i];
            mag2 += vec2[i] * vec2[i];
        }

        mag1 = Math.sqrt(mag1);
        mag2 = Math.sqrt(mag2);

        return mag1 > 0 && mag2 > 0
            ? dotProduct / (mag1 * mag2)
            : 0;
    }

    /**
     * حساب المسافة الإقليدية
     */
    static euclideanDistance(vec1: number[], vec2: number[]): number {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have same dimension');
        }

        let sum = 0;
        for (let i = 0; i < vec1.length; i++) {
            const diff = vec1[i] - vec2[i];
            sum += diff * diff;
        }

        return Math.sqrt(sum);
    }

    /**
     * البحث الدلالي: إيجاد أقرب النصوص
     */
    static semanticSearch(
        query: string,
        documents: string[],
        topK: number = 5
    ): Array<{ text: string, score: number, index: number }> {
        const queryEmbedding = this.encode(query);
        const results: Array<{ text: string, score: number, index: number }> = [];

        documents.forEach((doc, idx) => {
            const docEmbedding = this.encode(doc);
            const score = this.cosineSimilarity(queryEmbedding, docEmbedding);
            results.push({ text: doc, score, index: idx });
        });

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * تجميع النصوص المتشابهة (Clustering)
     */
    static cluster(texts: string[], numClusters: number = 3): Map<number, string[]> {
        if (texts.length === 0) return new Map();

        const embeddings = texts.map(text => this.encode(text));

        // K-means clustering مبسط
        const centroids = this.initializeCentroids(embeddings, numClusters);
        const clusters = new Map<number, string[]>();

        for (let i = 0; i < numClusters; i++) {
            clusters.set(i, []);
        }

        // تعيين كل نص لأقرب centroid
        texts.forEach((text, idx) => {
            const embedding = embeddings[idx];
            let minDist = Infinity;
            let bestCluster = 0;

            centroids.forEach((centroid, clusterIdx) => {
                const dist = this.euclideanDistance(embedding, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    bestCluster = clusterIdx;
                }
            });

            clusters.get(bestCluster)?.push(text);
        });

        return clusters;
    }

    /**
     * تهيئة centroids للتجميع
     */
    private static initializeCentroids(
        embeddings: number[][],
        k: number
    ): number[][] {
        const centroids: number[][] = [];
        const indices = new Set<number>();

        while (centroids.length < k && indices.size < embeddings.length) {
            const idx = Math.floor(Math.random() * embeddings.length);
            if (!indices.has(idx)) {
                centroids.push([...embeddings[idx]]);
                indices.add(idx);
            }
        }

        return centroids;
    }

    /**
     * حفظ النموذج
     */
    static exportModel(): string {
        return JSON.stringify({
            dimension: this.dimension,
            vocabulary: this.vocabulary,
            embeddings: Array.from(this.embeddings.entries())
        });
    }

    /**
     * تحميل النموذج
     */
    static importModel(modelData: string): void {
        const data = JSON.parse(modelData);
        this.dimension = data.dimension;
        this.vocabulary = data.vocabulary;
        this.embeddings = new Map(data.embeddings);

        this.tokenizer.clear();
        this.vocabulary.forEach((word, idx) => {
            this.tokenizer.set(word, idx);
        });
    }

    /**
     * الحصول على معلومات النظام
     */
    static getInfo(): {
        vocabularySize: number;
        dimension: number;
        isInitialized: boolean;
    } {
        return {
            vocabularySize: this.vocabulary.length,
            dimension: this.dimension,
            isInitialized: this.vocabulary.length > 0
        };
    }
}

