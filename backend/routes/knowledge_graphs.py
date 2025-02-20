from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import spacy
import networkx as nx
import time
import os
import requests
import re
import logging
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from textstat import flesch_reading_ease
from bs4 import BeautifulSoup
import base64
from io import BytesIO

load_dotenv()
GUARDIAN_API_KEY = os.getenv("GUARDIAN_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

graphs_router = APIRouter()

tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
similarity_model = SentenceTransformer("all-MiniLM-L6-v2")
sentiment_analyzer = pipeline("sentiment-analysis")
nlp = spacy.load("en_core_web_sm")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

article_store = []

class NewsRequest(BaseModel):
    news_text: str

class ScrapeRequest(BaseModel):
    url: str

@graphs_router.post("/verify_news")
async def verify_news(data: NewsRequest):
    news_text = data.news_text
    if not news_text:
        raise HTTPException(status_code=400, detail="No news text provided")
    
    article_store.clear()
    fetch_related_content(news_text)
    
    if not article_store:
        raise HTTPException(status_code=404, detail="No related content found")
    
    news_embedding = similarity_model.encode(news_text, convert_to_tensor=True)
    max_similarity = 0
    best_article = ""
    
    for article in article_store:
        similarity = util.pytorch_cos_sim(
            news_embedding, similarity_model.encode(article, convert_to_tensor=True)
        ).item()
        if similarity > max_similarity:
            max_similarity = similarity
            best_article = article
    
    connected_nodes, graph_url = create_knowledge_graph(best_article)
    scores = calculate_scores(news_text, best_article)
    verdict = get_verdict(max_similarity)
    
    return {
        "status": "success",
        "results": {
            "scores": scores,
            "maximum_similarity": max_similarity,
            "verdict": verdict,
            "knowledge_graph": graph_url,
            "best_article": best_article,
        }
    }

@graphs_router.post("/scrape")
async def scrape(data: ScrapeRequest):
    url = data.url
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    title, news_analysis, first_paragraph = scrape_data(url)
    if title:
        verify_payload = {"news_text": title + first_paragraph}
        verify_response = requests.post("http://127.0.0.1:8000/verify_news", json=verify_payload)
        if verify_response.status_code == 200:
            return verify_response.json()
        else:
            raise HTTPException(status_code=500, detail="Failed to scrape and verify")
    else:
        raise HTTPException(status_code=500, detail=news_analysis)
