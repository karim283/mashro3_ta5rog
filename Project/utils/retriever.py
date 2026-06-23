from langchain_community.vectorstores import FAISS

def build_retriever(db: FAISS):
    """Create a retriever configured for accurate, non-repetitive results."""
    return db.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 4},
    )
