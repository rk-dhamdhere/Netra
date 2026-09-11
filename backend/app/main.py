from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import ai_routes, graph_routes, search_routes

app = FastAPI(
    title="Netra Crime Intelligence Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS so the React/Next.js frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your routes
app.include_router(ai_routes.router)
try:
    app.include_router(graph_routes.router)
except Exception:
    pass

try:
    app.include_router(search_routes.router)
except Exception:
    pass

@app.get("/")
def health_check():
    return {"status": "online", "system": "Netra Backend"}