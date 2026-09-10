import os
from reportlab.pdfgen import canvas
from backend.app.services.gemini_service import extract_multimodal_evidence

def create_sample_fir_pdf(filename: str):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "INTELLIGENCE REPORT - CONFIDENTIAL")
    
    # Testing the Kingpin Rule
    c.drawString(100, 710, "Target 1: Vikram Desai. Surveillance confirms he is the mastermind")
    c.drawString(100, 690, "directing all financial operations and issuing orders.")
    
    # Testing the Mule Rule
    c.drawString(100, 650, "Target 2: Rahul Sharma. A low-level driver who acts as a proxy.")
    
    # Testing the Burner Rule & Map Geocoding Rule
    c.drawString(100, 610, "On Tuesday, Sharma was spotted at the Viviana Mall in Thane")
    c.drawString(100, 590, "using a prepaid, untraceable flip phone to coordinate a drop.")
    
    # Testing Relationships
    c.drawString(100, 550, "Desai subsequently transferred 500,000 INR to a shell bank account.")
    
    c.save()

if __name__ == "__main__":
    pdf_path = "sample_fir.pdf"
    
    # If reportlab is not installed, use pip install reportlab or test with an existing PDF
    try:
        create_sample_fir_pdf(pdf_path)
        print(f"Created {pdf_path}")
    except ImportError:
        print("Note: Install reportlab (`pip install reportlab`) or supply an existing PDF file.")
        
    if os.path.exists(pdf_path):
        result = extract_multimodal_evidence(pdf_path, mime_type="application/pdf")
        print("\n=== EXTRACTION RESULT ===")
        print(result.model_dump_json(indent=2))