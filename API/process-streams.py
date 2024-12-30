from flask import Flask, request, jsonify
import requests
import torch
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sentence_transformers import SentenceTransformer, util
import re
import spacy
from textstat import flesch_reading_ease
import numpy as np
from dotenv import load_dotenv
import os

# Specify the path to the .env file
from pathlib import Path
env_path = Path(__file__).resolve().parent.parent / '.env'

app = Flask(__name__)
load_dotenv(dotenv_path=env_path)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Guardian API Key
guardian_api_key = os.getenv('GUARDIAN_API_KEY')

# NewsAPI Key
newsapi_key = os.getenv('NEWSAPI_KEY')

# Summarization model setup
summarizer_tokenizer = AutoTokenizer.from_pretrained("t5-small")
summarizer_model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")

# Similarity model setup
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')

# Spacy NLP for fact density calculation
nlp = spacy.load("en_core_web_sm")

# Global list for article storage
article_store = []


def clean_text(text):
    """Cleans the input text."""
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    return text.strip()


def fetch_newsapi_content(query):
    """Fetch related content from NewsAPI."""
    search_url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "apiKey": newsapi_key,
        "language": "en",
        "pageSize": 10,  # Limit the number of articles fetched
    }
    response = requests.get(search_url, params=params)
    if response.status_code != 200:
        print(f"Error fetching from NewsAPI: {response.status_code}")
        return []

    articles = response.json().get('articles', [])
    for article in articles:
        title = article.get("title", "")
        snippet = article.get("description", "")
        if snippet:
            combined_text = f"{title} - {snippet}"
            article_store.append({
                "content": combined_text,
                "embedding": similarity_model.encode(clean_text(combined_text), convert_to_tensor=True)
            })


def fetch_related_content(query):
    """Fetch related content from The Guardian and NewsAPI."""
    # Fetch from The Guardian
    guardian_search_url = f"https://content.guardianapis.com/search"
    guardian_params = {
        "q": query,
        "api-key": guardian_api_key,
        "show-fields": "headline,standfirst"
    }
    guardian_response = requests.get(guardian_search_url, params=guardian_params)
    if guardian_response.status_code == 200:
        guardian_articles = guardian_response.json().get('response', {}).get('results', [])
        for article in guardian_articles:
            title = article.get("webTitle", "")
            snippet = article["fields"].get("standfirst", "")
            if snippet:
                combined_text = f"{title} - {snippet}"
                article_store.append({
                    "content": combined_text,
                    "embedding": similarity_model.encode(clean_text(combined_text), convert_to_tensor=True)
                })

    # Fetch from NewsAPI
    fetch_newsapi_content(query)


def summarize_content(content):
    """Summarizes the given content."""
    input_text = "summarize: " + content
    inputs = summarizer_tokenizer(input_text, return_tensors="pt")
    outputs = summarizer_model.generate(inputs['input_ids'], max_length=100)
    return summarizer_tokenizer.decode(outputs[0], skip_special_tokens=True)


def retrieve_similar_articles(news_text, top_k=3):
    """Retrieve similar articles based on cosine similarity."""
    query_embedding = similarity_model.encode(clean_text(news_text), convert_to_tensor=True)
    similarities = [
        {
            "content": article["content"],
            "similarity": util.cos_sim(query_embedding, article["embedding"]).item()
        }
        for article in article_store
    ]
    # Sort by similarity and return top_k results
    similarities = sorted(similarities, key=lambda x: x["similarity"], reverse=True)
    return similarities[:top_k]


def is_fake_news(news_text):
    """Main function to detect fake news."""
    if not article_store:
        return {"verdict": "Unverified", "reason": "No related content indexed"}

    similar_articles = retrieve_similar_articles(news_text, top_k=3)
    if not similar_articles:
        return {"verdict": "Unverified", "reason": "No similar articles found"}

    for article in similar_articles:
        summary = summarize_content(article["content"])
        similarity_score = article["similarity"]
        if similarity_score > 0.25:
            return {"verdict": "Likely Real News", "similarity_score": similarity_score, "summary": summary}

    average_similarity = sum(article["similarity"] for article in similar_articles) / len(similar_articles)
    return {"verdict": "Likely Fake News", "average_similarity": average_similarity}


@app.route('/detect_fake_news', methods=['POST'])
def detect_fake_news():
    data = request.get_json()
    if not data or 'news_text' not in data:
        return jsonify({"error": "Invalid input. Please provide 'news_text' in JSON payload."}), 400

    news_text = data['news_text']
    result = is_fake_news(news_text)
    return jsonify(result)


@app.route('/')
def info_page():
    return """
    <h1>Welcome to the TruthTell Backend API</h1>
    <p>This API helps detect whether a news article is likely fake or real.</p>
    <h2>Endpoints:</h2>
    <ul>
        <li><strong>POST /detect_fake_news</strong>: Submit a news article to analyze its authenticity.</li>
    </ul>
    <h2>How to Use:</h2>
    <p>Send a POST request with a JSON payload containing the key <code>news_text</code> to the endpoint <code>/detect_fake_news</code>.</p>
    <h2>Data Sources:</h2>
    <ul>
        <li>The Guardian API</li>
        <li>NewsAPI (https://newsapi.org/)</li>
    </ul>
    """
@app.route('/process-video', methods=['POST'])
def process_video():
    """Processes the video URL and detects fake news."""
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Invalid input. Please provide 'url'."}), 400

    video_url = data['url']

    # Simulate fetching the video transcript (You can integrate the YouTube Data API for transcripts if needed)
    simulated_transcript = f"This is a simulated transcript for video: {video_url}"

    # Process the transcript for fake news detection

    return jsonify({
        "message": "Video processed successfully.",
        "video_url": video_url,
        "transcript": simulated_transcript
    })

if __name__ == '__main__':
    # Fetch some initial related content for testing
    fetch_related_content("example query")
    app.run(debug=True, port=5000)