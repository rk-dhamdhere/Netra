import os
from reportlab.pdfgen import canvas
from backend.app.services.gemini_service import extract_multimodal_evidence

def create_sample_fir_pdf(filename: str):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "CONFIDENTIAL // CRIME INVESTIGATION REPORT")
    c.drawString(100, 720, "FIR No: 2026/CR-0914")
    c.drawString(100, 690, "Suspect: Ajay Rathod (Alias: Boss)")
    c.drawString(100, 660, "Associate: Sameer Shaikh operating burner vehicle DL-4C-9912.")
    c.drawString(100, 630, "Details: Ajay Rathod transferred funds to bank account AC-551122.")
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