from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import spacy
import networkx as nx
import requests
import os
import re
import logging
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from textstat import flesch_reading_ease
from bs4 import BeautifulSoup
import base64
from io import BytesIO

load_dotenv()
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")
GUARDIAN_API_KEY = os.getenv('GUARDIAN_API_KEY')
NEWS_API_KEY = os.getenv('NEWS_API_KEY')

app = FastAPI()
router = APIRouter()

# Initialize models
tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
sentiment_analyzer = pipeline('sentiment-analysis')
nlp = spacy.load("en_core_web_sm")

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

article_store = []

def upload_image_to_imgbb(image_file: UploadFile):
    url = "https://api.imgbb.com/1/upload"
    files = {"image": (image_file.filename, image_file.file, image_file.content_type)}
    response = requests.post(url, files=files, params={"key": IMGBB_API_KEY})
    if response.status_code == 200:
        return response.json()["data"]["url"]
    else:
        raise HTTPException(status_code=400, detail="Image upload failed")

@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    try:
        image_url = upload_image_to_imgbb(image)
        return JSONResponse(content={"image_url": image_url})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "API is running"}

# Helper function to clean text
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\W+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# Generate knowledge graph
def create_knowledge_graph(summary):
    doc = nlp(summary)
    graph = nx.DiGraph()
    for token in doc:
        if token.dep_ in ["nsubj", "dobj"]:
            graph.add_edge(token.head.text, token.text)
    plt.figure(figsize=(10, 6))
    pos = nx.spring_layout(graph)
    nx.draw(graph, pos, with_labels=True, node_size=3000, node_color="lightblue", font_size=10, font_weight="bold")
    plt.title("Knowledge Graph")
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    plt.close()
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

# Fetch related content
def fetch_related_content(query):
    article_store.clear()
    urls = [
        ("https://content.guardianapis.com/search", {"q": query, "api-key": GUARDIAN_API_KEY, "show-fields": "headline,standfirst"}),
        ("https://newsapi.org/v2/everything", {"q": query, "apiKey": NEWS_API_KEY, "language": "en", "sortBy": "relevancy"})
    ]
    for url, params in urls:
        response = requests.get(url, params=params)
        articles = response.json().get('response', {}).get('results', []) if "guardianapis" in url else response.json().get('articles', [])
        for article in articles:
            title = article.get("webTitle" if "guardianapis" in url else "title", "")
            snippet = article.get("fields", {}).get("standfirst", "") if "guardianapis" in url else article.get("description", "")
            if snippet:
                article_store.append(f"{title} - {snippet}")

# Verify news
def verify_news(news_text):
    fetch_related_content(news_text)
    if not article_store:
        raise HTTPException(status_code=404, detail="No related content found")
    news_embedding = similarity_model.encode(news_text, convert_to_tensor=True)
    best_article, max_similarity = max(
        ((article, util.pytorch_cos_sim(news_embedding, similarity_model.encode(article, convert_to_tensor=True)).item()) for article in article_store),
        key=lambda x: x[1], default=("", 0))
    knowledge_graph = create_knowledge_graph(best_article)
    return {
        "similarity_score": max_similarity,
        "verdict": "Real News" if max_similarity > 0.4 else "Likely Fake News",
        "knowledge_graph": knowledge_graph,
        "best_article": best_article
    }

@router.post("/verify_news")
async def verify_news_api(request: Request):
    data = await request.json()
    news_text = data.get("news_text")
    if not news_text:
        raise HTTPException(status_code=400, detail="No news text provided")
    return verify_news(news_text)

# Scrape data
def scrape_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.title.string if soup.title else "No title found"
        first_paragraph = soup.find('p').get_text(strip=True) if soup.find('p') else "No paragraph found."
        return title, first_paragraph
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {e}")

@router.post("/scrape")
async def scrape_api(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    title, first_paragraph = scrape_data(url)
    return verify_news(title + first_paragraph)

app.include_router(router)
