# ============================
# Dockerfile for Inventory Service
# ============================

FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose FastAPI port
EXPOSE 5001

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]