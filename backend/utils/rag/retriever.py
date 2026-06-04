from utils.rag.vector_db import collection
from utils.rag.embedder import get_embedding

def retrieve_context(query):

    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    return results["documents"][0]