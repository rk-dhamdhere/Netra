import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.services.gemini_service import extract_fir_data

cases = [
    "Informant intercepts state primary suspect Sameer Khan operating out of a black Hyundai Creta (MH-04-HE-9921) near Viviana Mall in Thane, delivering illicit hardware components to local contact Manoj Patil.",
    "Informant reports suspect Vikram Malhotra was spotted near Lajpat Nagar Market in New Delhi in a white Scorpio (DL-8C-4921) meeting an associate identified as Rajesh.",
    "Field Intel SITREP - Zuber Khan operating out of Phoenix Marketcity complex in Kurla, Mumbai. Observed exchanging packages with courier Imran Shaikh. Zuber uses burner +91-98214-99881 and routes funds through Apex Traders (A/C: 409921003189)."
]

for i, case in enumerate(cases):
    print(f"\n--- Running Test Case {i+1} ---")
    try:
        res = extract_fir_data(case)
        print("Persons:", [p.name for p in res.persons])
        print("Objects:", [o.identifier_value for o in res.objects])
        print("Locations:", [(l.name, l.latitude, l.longitude) for l in res.locations])
    except Exception as e:
        print(f"Error: {e}")
