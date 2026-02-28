# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Final Image with Python Backend
FROM python:3.11-slim
WORKDIR /app

# Install Backend deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Frontend build to root
COPY --from=frontend-builder /app/frontend/dist ./dist

# Copy Backend code
COPY backend/ .

# Data directory for SQLite persistence
RUN mkdir -p /app/data

EXPOSE 8000
# Railway assigns PORT environment variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]