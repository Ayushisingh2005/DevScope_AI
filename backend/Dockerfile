FROM python:3.11-slim
WORKDIR /app

# Create a data directory for the persistent database
RUN mkdir -p /app/data

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Run without --reload for production stability
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]