import threading
import time
import sqlalchemy.exc
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import inventory

app = FastAPI()

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(inventory.router)

def init_db():
    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            print("Inventory tables created")
            break
        except sqlalchemy.exc.OperationalError:
            print("DB not ready retrying...")
            time.sleep(3)


@app.on_event("startup")
def on_startup():

    threading.Thread(target=init_db, daemon=True).start()


@app.get("/")
def root():
    return {"message": "Inventory service running"}