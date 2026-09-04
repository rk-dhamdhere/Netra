from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, BackgroundTasks, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.app.services.gemini_service import extract_fir_data



app = FastAPI(title="Netra AI/NLP Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_file_task(filename: str, file_bytes: bytes):
    try:
        print(f"Extracting POLE+O entities from {filename}...")
        
        # Call Rohan's function directly using the raw file bytes
        result = extract_fir_data(file_bytes)
        
        print(f"Task Complete. Data ready for DB: {result}")
        
        # TODO: write_to_neo4j(result) - Waiting on Tanmay's connection details
        
    except Exception as e:
        print(f"AI Service Error: {str(e)}. Using updated POLE+O fallback mock data.")
        
        # This exact structure includes the new required properties from the updated contract
        mock_data = {
            "nodes": [
                {
                    "label": "Person", 
                    "id": "p1", 
                    "name": "Rahul Sharma", 
                    "risk_score": 85, 
                    "hierarchy_tier": 2, 
                    "is_kingpin": False
                },
                {
                    "label": "Organization", 
                    "id": "o1", 
                    "name": "Shadow Syndicate", 
                    "org_type": "Gang"
                },
                {
                    "label": "Location", 
                    "id": "l1", 
                    "address": "Andheri West", 
                    "lat": 19.136, 
                    "lng": 72.827, 
                    "tower_id": "T-404"
                }
            ],
            "edges": [
                {"source_id": "p1", "target_id": "o1", "relation_type": "AFFILIATED_WITH"}
            ]
        }
        print(f"Fallback Data generated: {mock_data}")
        
@app.post("/api/v1/upload-case-file")
async def upload_case_file(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...)
):
    # Read the bytes BEFORE handing off to the background task
    file_bytes = await file.read()
    
    background_tasks.add_task(process_file_task, file.filename, file_bytes)
    
    return {
        "status": "processing",
        "filename": file.filename,
        "message": "File received. AI extraction running in background."
    }