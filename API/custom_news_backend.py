from flask import Flask, request, jsonify
import requests
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForSequenceClassification, pipeline
import torch
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()
# Guardian API Key (Add your API key here)
guardian_api_key = os.getenv("GUARDIAN_API_KEY")

# Summarization model setup
summarizer_tokenizer = AutoTokenizer.from_pretrained("t5-small")
summarizer_model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")

# Similarity model setup
similarity_model = AutoModelForSequenceClassification.from_pretrained("cross-encoder/nli-distilroberta-base")
similarity_tokenizer = AutoTokenizer.from_pretrained("cross-encoder/nli-distilroberta-base")

def fetch_related_content(query):
    search_url = f"https://content.guardianapis.com/search"
    params = {
        "q": query,
        "api-key": guardian_api_key,
        "show-fields": "headline,standfirst"
    }
    response = requests.get(search_url, params=params)
    if response.status_code != 200:
        return []

    articles = response.json().get('response', {}).get('results', [])
    return [{"name": article["webTitle"], "snippet": article["fields"].get("standfirst", "")} for article in articles]

def summarize_content(content):
    input_text = "summarize: " + content
    inputs = summarizer_tokenizer(input_text, return_tensors="pt")
    outputs = summarizer_model.generate(inputs['input_ids'], max_length=100)
    return summarizer_tokenizer.decode(outputs[0], skip_special_tokens=True)

def calculate_similarity(text1, text2):
    inputs = similarity_tokenizer(text1, text2, return_tensors='pt', truncation=True)
    with torch.no_grad():
        outputs = similarity_model(**inputs)
    scores = torch.softmax(outputs.logits, dim=1).tolist()[0]
    return scores[1]  # Entailment score

def is_fake_news(news_text):
    related_content = fetch_related_content(news_text[:100])
    if not related_content:
        return {"verdict": "Unverified", "reason": "No related content found"}

    similarities = []
    for article in related_content:
        summary = summarize_content(article['snippet'])
        similarity_score = calculate_similarity(news_text, summary)
        similarities.append(similarity_score)
        if similarity_score > 0.25:
            return {"verdict": "Likely Real News", "similarity_score": similarity_score}

    average_similarity = sum(similarities) / len(similarities) if similarities else 0
    if average_similarity < 0.5:
        return {"verdict": "Likely Fake News", "average_similarity": average_similarity}
    else:
        return {"verdict": "Likely Real News", "average_similarity": average_similarity}

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
    """

if __name__ == '__main__':
    app.run(debug=True)
