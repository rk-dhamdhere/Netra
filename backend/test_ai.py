import asyncio
from app.services.gemini_service import extract_fir_data
from app.services.neo4j_service import write_to_neo4j

dummy_fir = """
Suspect 1 (Karim A., alias The Broker, ph: +91-98XXX-41122) was visually confirmed at Sadar Bazar at 0800hrs on 12th Jan. He met with a woman, believed to be Priya M. (voter ID pending). They discussed layering 4.7 Cr via 9 shell accounts, primarily utilizing an HDFC corporate account ending in 4291. A white Toyota Innova (DL-3C-AB-9214) was parked nearby, registered to an unknown organization. Later, a VoIP call was intercepted to an actor known only as "Falcon," routed through a Pakistan-based server. Drop location for the physical cash conversion was mentioned as Lajpat Nagar Market, but the exact timestamp is unconfirmed.
"""

async def main():
    print("Running AI extraction on dummy FIR...\n")
    
    # 1. Your AI extracts the data (returns a Pydantic object)
    extracted_data = extract_fir_data(dummy_fir, max_retries=0)
    
    # 2. Convert the Pydantic object into a standard dictionary
    graph_dict = extracted_data.model_dump()
    
    # 3. Pass the dictionary to Tanmay's database script
    print("Handing extracted dictionary over to Neo4j database...")
    write_to_neo4j(graph_dict)

if __name__ == "__main__":
    asyncio.run(main())