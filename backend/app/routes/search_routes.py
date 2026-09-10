from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Import your custom vector logic!
from backend.app.services.vector_service import search_nearest_faces

router = APIRouter()

# Define the expected JSON payload from the frontend
class FaceSearchQuery(BaseModel):
    embedding: list[float]
    limit: int = 5

@router.post("/search-face")
async def search_face(query: FaceSearchQuery):
    """
    Takes a 768-dimensional facial embedding vector and returns the closest 
    matching entities from PostgreSQL using pgvector cosine similarity.
    """
    try:
        # Execute your pgvector HNSW search
        matches = search_nearest_faces(query.embedding, limit=query.limit)
        
        return {
            "status": "success",
            "results": matches
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector search failed: {str(e)}")