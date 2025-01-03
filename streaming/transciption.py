import re
from transformers import GPT2LMHeadModel, GPT2Tokenizer, BartForConditionalGeneration, BartTokenizer
import requests
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import faiss
import numpy as np
from flask import Flask, jsonify
import os

app = Flask(__name__)

# Guardian API Key
guardian_api_key = "8fc95a30-a0c7-4ad9-8a62-0d8d3af818cc"

# Models and Tools Setup
tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
sentiment_analyzer = pipeline('sentiment-analysis')

# FAISS Index Setup
embedding_dim = 384  # Dimension of 'all-MiniLM-L6-v2' embeddings
index = faiss.IndexFlatL2(embedding_dim)

# Global Variables to Store Articles
article_store = []  # To store articles for retrieval
article_embeddings = []  # To store embeddings

# Summarization Model Setup
summarizer_model_name = "facebook/bart-large-cnn"
summarizer_model = BartForConditionalGeneration.from_pretrained(summarizer_model_name)
summarizer_tokenizer = BartTokenizer.from_pretrained(summarizer_model_name)

# Text Cleaning Function
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    return text.strip()

# Summarization Function
def summarize_text(text):
    # Clean text before summarizing
    clean_text_input = clean_text(text)
    inputs = summarizer_tokenizer(clean_text_input, return_tensors="pt", max_length=1024, truncation=True)
    
    # Generate summary
    summary_ids = summarizer_model.generate(
        inputs['input_ids'],
        num_beams=4,
        max_length=150,
        early_stopping=True
    )
    return summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# File Processing Endpoint
@app.route('/process', methods=['GET'])
def process_file():
    file_path = './transcription/output_audio.txt'
    
    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # Read the file content
    with open(file_path, 'r') as file:
        input_text = file.read()
    
    # Generate summary
    summary = summarize_text(input_text)
    
    # Return summary to the frontend
    return jsonify({"summary": summary})

# Ensure uploads directory exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

if __name__ == '__main__':
    # Choose a port that is not 3000, 5000, 5001, 8000, or 8080
    app.run(debug=True, port=5500)
