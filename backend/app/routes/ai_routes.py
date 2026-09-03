from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.schemas.extraction import GraphExtraction
from backend.app.services.gemini_service import extract_fir_data

router = APIRouter(prefix="/api/ai", tags=["AI Extraction"])

class ExtractRequest(BaseModel):
    text: str

@router.post("/extract-fir", response_model=GraphExtraction)
async def extract_fir_endpoint(payload: ExtractRequest):
    try:
        result = extract_fir_data(payload.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))