from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# Import your custom vector logic!
from backend.app.services.vector_service import search_nearest_faces

router = APIRouter()

# Define the expected JSON payload from the frontend
class FaceSearchQuery(BaseModel):
    embedding: list[float] = Field(min_length=1)
    limit: int = Field(default=5, ge=1, le=100)

@router.post("/search-face")
async def search_face(payload: FaceSearchQuery):
    try:
        matches = search_nearest_faces(payload.embedding, payload.limit)
        return {"status": "success", "matches": matches}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Face search database unavailable: {e}") from e