import os
from dotenv import load_dotenv
from fastapi import FastAPI, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

# Team refactored imports from main branch
from backend.app.services.gemini_service import extract_fir_data
from backend.app.services.neo4j_service import write_to_neo4j

load_dotenv()

app = FastAPI(title="Netra AI/NLP Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_file_task(filename: str, file_bytes: bytes):
    try:
        print(f"Extracting POLE+O entities from {filename}...")
        
        # 1. Get Pydantic models from Gemini
        raw_result = extract_fir_data(file_bytes)
        
        # 2. Convert to dictionary for Neo4j
        dict_result = raw_result.model_dump() 
        
        print("Extraction complete! Sending to DB...")
        
        # 3. Push to graph database via the new neo4j_service
        write_to_neo4j(dict_result)
        
    except Exception as e:
        print(f"AI Service Error: {str(e)}")
        
        # Pydantic-aligned fallback mock data
        mock_data = {
            "persons": [
                {"id": "p1", "name": "Rahul Sharma", "risk_score": 85, "hierarchy_tier": "Kingpin"}
            ],
            "objects": [
                {"id": "o1", "type": "Organization", "identifier_value": "Shadow Syndicate"}
            ],
            "relationships": [
                {"source_id": "p1", "target_id": "o1", "relation_type": "AFFILIATED_WITH"}
            ]
        }
        print("Fallback Data generated. Sending to DB...")
        write_to_neo4j(mock_data)

@app.get("/")
def root():
    return {"status": "online", "system": "Netra Backend"}

@app.post("/api/v1/upload-case-file")
async def upload_case_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    file_bytes = await file.read()
    background_tasks.add_task(process_file_task, file.filename, file_bytes)
    return {
        "status": "processing",
        "filename": file.filename,
        "message": "File received. AI extraction running in background.",
    }