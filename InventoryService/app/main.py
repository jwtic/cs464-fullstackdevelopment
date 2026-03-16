import threading
import time
import sqlalchemy.exc

from fastapi import FastAPI
from app.database import Base, engine
from app.routes import inventory

app = FastAPI()
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