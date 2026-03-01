from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Step 1: Load model and prepare corpus
model = SentenceTransformer('all-MiniLM-L6-v2')
corpus = ["RAG combines retrieval and generation", "GPT models generate language", "FAISS performs similarity search"]
corpus_embeddings = model.encode(corpus)

# Step 2: Build vector index
index = faiss.IndexFlatL2(corpus_embeddings.shape[1])
index.add(np.array(corpus_embeddings))

# Step 3: Embed the query and retrieve top matches
query = "What is RAG?"
query_embedding = model.encode([query])
_, top_k_indices = index.search(np.array(query_embedding), k=2)
retrieved_docs = [corpus[i] for i in top_k_indices[0]]
print(retrieved_docs)

