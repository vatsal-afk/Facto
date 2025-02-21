FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python -m spacy download en_core_web_sm

EXPOSE 8000

CMD exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}
