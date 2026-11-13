from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import router as auth_router
from api.products import router as products_router
from core.seed import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize tables and seed default products on startup
    try:
        init_db()
    except Exception as e:
        print(f"Database initialization error: {e}")
    yield

app = FastAPI(
    title="69 Store API",
    description="Vintage & Streetwear E-Commerce Backend with PostgreSQL",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(products_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "store": "69 Store Streetwear & Vintage Archive",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "products": "/api/products"
        }
    }
