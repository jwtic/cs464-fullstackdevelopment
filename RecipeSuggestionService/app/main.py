import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.recipe import router as recipe_router

app = FastAPI(title="Recipe Suggestion Service")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipe_router)