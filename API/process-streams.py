import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import re
import spacy
from textstat import flesch_reading_ease

# Flask Setup
app = Flask(__name__)
CORS(app)  # Enable CORS

# Guardian API Key
guardian_api_key = "8fc95a30-a0c7-4ad9-8a62-0d8d3af818cc"

# Models and Tools Setup
tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
sentiment_analyzer = pipeline('sentiment-analysis')
nlp = spacy.load("en_core_web_sm")

# Global Variables to Store Articles
article_store = []  # To store articles for retrieval

# 1. Text Cleaning Function
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    return text.strip()

# 2. Fetch and Store Related Content
def fetch_related_content(query):
    search_url = f"https://content.guardianapis.com/search"
    params = {
        "q": query,
        "api-key": guardian_api_key,
        "show-fields": "headline,standfirst"
    }
    response = requests.get(search_url, params=params)
    articles = response.json().get('response', {}).get('results', [])

    for article in articles:
        title = article.get("webTitle", "")
        snippet = article["fields"].get("standfirst", "")
        if snippet:
            combined_text = f"{title} - {snippet}"
            article_store.append(combined_text)  # Store title and snippet

# 3. Summarization
def summarize_content(content):
    content = clean_text(content)
    input_text = "summarize: " + content
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True)
    outputs = model.generate(inputs['input_ids'], max_length=100)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# 4. RAG Similarity Search
def retrieve_similar_articles(news_text, top_k=3):
    query_embedding = similarity_model.encode(clean_text(news_text), convert_to_tensor=False)
    results = []
    for article in article_store:
        similarity = util.pytorch_cos_sim(
            similarity_model.encode(news_text, convert_to_tensor=True),
            similarity_model.encode(article, convert_to_tensor=True)
        ).item()
        results.append((article, similarity))
    
    # Sort articles based on similarity
    results.sort(key=lambda x: x[1], reverse=True)
    return [article for article, _ in results[:top_k]]

# 5. Scores Calculation
def sentiment_consistency(input_text, related_snippet):
    input_sentiment = sentiment_analyzer(input_text)[0]['label']
    related_sentiment = sentiment_analyzer(related_snippet)[0]['label']
    return 1 if input_sentiment == related_sentiment else 0

def fact_density_score(text):
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents]
    return len(entities) / len(text.split())

def readability_score(text):
    return flesch_reading_ease(text)

def lexical_diversity_score(text):
    words = text.split()
    unique_words = set(words)
    return len(unique_words) / len(words)

# 6. Aggregation
def final_verdict(scores, weights):
    weighted_sum = sum(score * weight for score, weight in zip(scores, weights))
    return weighted_sum / sum(weights)

# 7. Main Function to Detect Fake News
def is_fake_news(news_text):
    if len(article_store) == 0:
        return {"error": "No related content indexed. Cannot verify."}

    similar_articles = retrieve_similar_articles(news_text, top_k=3)
    if not similar_articles:
        return {"error": "No similar articles found. Cannot verify."}

    max_similarity = 0  # Track maximum similarity score
    scores = []
    sentiment_scores = []
    fact_density_scores = []
    readability_scores = []
    lexical_diversity_scores = []

    for article_snippet in similar_articles:
        summary = summarize_content(article_snippet)
        similarity = util.pytorch_cos_sim(
            similarity_model.encode(news_text, convert_to_tensor=True),
            similarity_model.encode(summary, convert_to_tensor=True)
        ).item()
        max_similarity = max(max_similarity, similarity)  # Update max similarity

        sentiment_score = sentiment_consistency(news_text, article_snippet)
        fact_density = fact_density_score(news_text)
        readability = readability_score(news_text)
        lexical_diversity = lexical_diversity_score(news_text)

        # Store individual scores for averaging later
        sentiment_scores.append(sentiment_score)
        fact_density_scores.append(fact_density)
        readability_scores.append(readability)
        lexical_diversity_scores.append(lexical_diversity)

        # Weighted scores
        scores.append(final_verdict(
            [similarity, fact_density, lexical_diversity],
            [0.5, 0.1, 0.1]
        ))

    # Calculate average scores
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
    avg_fact_density = sum(fact_density_scores) / len(fact_density_scores) if fact_density_scores else 0
    avg_readability = sum(readability_scores) / len(readability_scores) if readability_scores else 0
    avg_lexical_diversity = sum(lexical_diversity_scores) / len(lexical_diversity_scores) if lexical_diversity_scores else 0

    # Return the averages, max similarity, and final verdict as JSON response
    result = {
        "avg_sentiment": avg_sentiment,
        "avg_fact_density": avg_fact_density,
        "avg_readability": avg_readability,
        "avg_lexical_diversity": avg_lexical_diversity,
        "max_similarity": max_similarity
    }

    if max_similarity > 0.4:
        result["verdict"] = "Real News"
    elif max_similarity > 0.25:
        result["verdict"] = "Likely Real News"
    elif max_similarity > 0.2:
        result["verdict"] = "Unverified"
    else:
        result["verdict"] = "Likely Fake News"
    
    return result


@app.route('/verify', methods=['POST'])
def verify_news():
    data = request.get_json()
    news_text = data.get('news_text', '')

    if not news_text:
        return jsonify({"error": "No news text provided"}), 400

    # Fetch related content for the query
    fetch_related_content(news_text)

    # Call the fake news detection function
    result = is_fake_news(news_text)

    return jsonify(result)


# Example Usage: Running Flask app
if __name__ == '__main__':
    app.run(debug=True)
