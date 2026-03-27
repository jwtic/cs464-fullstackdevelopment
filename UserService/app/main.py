"""Main FastAPI application for User Service."""
import time
import sqlalchemy.exc
import asyncio
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import Base, engine, get_db
from app.routes import user_self
import threading
import os

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

# Include routers
app.include_router(user_self.router)

def init_db():
    """Initialize database tables - runs in background."""
    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            print("Database tables created successfully.")
            break
        except sqlalchemy.exc.OperationalError:
            print(f"Database not ready (attempt {i+1}/10), retrying...")
            time.sleep(3)
    else:
        print("WARNING: Database connection failed after retries.")

@app.on_event("startup")
def on_startup():
    """Start database initialization in background."""
    # Run database initialization in background thread
    # so it doesn't block FastAPI from being ready
    threading.Thread(target=init_db, daemon=True).start()
    print("Database initialization started in background.")

@app.get("/")
def root():
    """Root endpoint to check service health."""
    return {"message": "User service is running!"}

@app.get("/healthz")
@app.head("/healthz")
def healthz():
    """Health check endpoint for load balancer."""
    return {"status": "healthy"}

@app.get("/users/debug/db")
def debug_db(db: Session = Depends(get_db)):
    """Debug endpoint to check database connectivity and list tables."""
    try:
        # Test connection and get table list
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """))
        tables = [row[0] for row in result.fetchall()]
        
        # Get user count if users table exists
        user_count = 0
        if 'users' in tables:
            result = db.execute(text("SELECT COUNT(*) FROM users"))
            user_count = result.fetchone()[0]
        
        return {
            "status": "connected",
            "database": "users",
            "tables": tables,
            "user_count": user_count
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/users/debug/notifications")
def debug_notifications(db: Session = Depends(get_db)):
    """Debug endpoint to view all user notifications."""
    try:
        # First, get the table schema to see actual columns
        schema_result = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user_notifications'
            ORDER BY ordinal_position;
        """))
        
        columns = []
        for row in schema_result.fetchall():
            columns.append({
                "column_name": row[0],
                "data_type": row[1]
            })
        
        # Get all data from the table using SELECT *
        data_result = db.execute(text("""
            SELECT * FROM user_notifications 
            ORDER BY created_at DESC 
            LIMIT 100;
        """))
        
        notifications = []
        for row in data_result.fetchall():
            notifications.append(dict(row._mapping))
        
        return {
            "status": "success",
            "schema": columns,
            "count": len(notifications),
            "notifications": notifications
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/users/debug/list")
def debug_list_users(db: Session = Depends(get_db)):
    """Debug endpoint to list all users."""
    try:
        result = db.execute(text("""
            SELECT id, username, email, display_name, role, is_active, created_at, last_login 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 100;
        """))
        
        users = []
        for row in result.fetchall():
            users.append({
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "display_name": row[3],
                "role": row[4],
                "is_active": row[5],
                "created_at": str(row[6]) if row[6] else None,
                "last_login": str(row[7]) if row[7] else None
            })
        
        return {
            "status": "success",
            "count": len(users),
            "users": users
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@app.post("/users/debug/create")
def debug_create_user(db: Session = Depends(get_db)):
    """Debug endpoint to create a test user."""
    try:
        from app.models import User
        import uuid
        
        # Create a test user
        test_user = User(
            id=str(uuid.uuid4()),
            username=f"testuser_{uuid.uuid4().hex[:8]}",
            email=f"test_{uuid.uuid4().hex[:8]}@example.com",
            display_name="Test User",
            bio="This is a test user created via debug endpoint",
            role="USER",
            is_active=True
        )
        test_user.set_password("password123")
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        return {
            "status": "success",
            "message": "Test user created",
            "user": {
                "id": test_user.id,
                "username": test_user.username,
                "email": test_user.email,
                "display_name": test_user.display_name,
                "role": test_user.role
            }
        }
    except Exception as e:
        db.rollback()
        return {
            "status": "error",
            "error": str(e)
        }
