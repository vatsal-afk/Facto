# Use Alpine for lower memory usage
FROM python:3.10-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Add swap space (hack to prevent OOM)
RUN fallocate -l 256M /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile

# Expose correct port
EXPOSE 8000

# Start Uvicorn with 1 worker to save memory
CMD exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1