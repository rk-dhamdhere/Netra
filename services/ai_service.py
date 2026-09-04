import time

def extract_entities_from_file(filename: str, file_bytes: bytes):
  
    time.sleep(4) # Simulate Gemini latency
    
    # Example crash to test Taswi's fallback logic
    if filename.endswith(".txt"):
         raise ValueError("Gemini API Rate Limit Exceeded")
    
    # Expected successful output
    print(f"[AI Service] Successfully processed {filename}")
    return [
        {"label": "Person", "name": "Rajesh Kumar"},
        {"label": "Location", "name": "Andheri West"}
    ]