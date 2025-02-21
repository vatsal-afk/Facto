FROM python:3.10-slim

RUN apt-get update && apt-get install -y gcc libffi-dev python3-dev build-essential

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
