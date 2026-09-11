import pandas as pd
from docx import Document
from pypdf import PdfReader

def parse_uploaded_file(file_path: str, filename: str) -> str:
    """Extracts text or tabular summaries from uploaded docs, spreadsheets, and PDFs."""
    extension = filename.split(".")[-1].lower()
    
    if extension == "docx":
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        
    elif extension == "pdf":
        reader = PdfReader(file_path)
        pdf_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pdf_text.append(text)
        return "\n".join(pdf_text)
        
    elif extension in ["csv", "xlsx", "xls"]:
        df = pd.read_excel(file_path) if extension in ["xlsx", "xls"] else pd.read_csv(file_path)
        summary_lines = ["CALL RECORD / SPREADSHEET EXTRACT:"]
        for _, row in df.iterrows():
            summary_lines.append(" | ".join([f"{col}: {val}" for col, val in row.items()]))
        return "\n".join(summary_lines)
        
    elif extension == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
            
    return ""