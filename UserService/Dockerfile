# ============================
#   Dockerfile for User Service
# ============================

# 1. Base image
FROM python:3.12-slim

# 2. Install system dependencies including postgresql-client for pg_isready
RUN apt-get update && apt-get install -y \
    postgresql-client \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 3. Set working directory
WORKDIR /app

# 4. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy application code
COPY . .

# 6. Expose FastAPI port
EXPOSE 8080

# 7. Run app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]