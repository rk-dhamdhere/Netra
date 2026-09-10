import requests
from typing import Tuple, Optional

def fetch_coordinates(location_name: str) -> Tuple[Optional[float], Optional[float]]:
    """Fetches exact lat/lng for heatmap generation."""
    # Adding 'India' helps narrow down the search for localized FIRs
    search_query = f"{location_name}, India"
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": search_query, "format": "json", "limit": 1}
    headers = {"User-Agent": "NetraInvestigativePlatform/1.0"}
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code == 200 and response.json():
            data = response.json()[0]
            return float(data["lat"]), float(data["lon"])
        return None, None
    except Exception as e:
        print(f"[ERROR] Geocoding failed for {location_name}: {e}")
        return None, None