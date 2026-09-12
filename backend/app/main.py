import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("netra-backend")

app = FastAPI(
    title="Netra Crime Intelligence Engine",
    description="Multimodal Intelligence & POLE+O Knowledge Graph API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React/Next.js frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to specific origins like ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Route Imports & Registration
try:
    from backend.app.routes import ai_routes
    app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI & Extraction"])
except Exception as e:
    logger.warning(f"Could not load ai_routes: {e}")

try:
    from backend.app.routes import graph_routes
    app.include_router(graph_routes.router, prefix="/api/graph", tags=["Graph Engine"])
except Exception as e:
    logger.warning(f"Could not load graph_routes: {e}")

try:
    from backend.app.routes import search_routes
    app.include_router(search_routes.router, prefix="/api/search", tags=["Vector Search"])
except Exception as e:
    logger.warning(f"Could not load search_routes: {e}")


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "system": "Netra Crime Intelligence Engine",
        "version": "1.0.0"
    }