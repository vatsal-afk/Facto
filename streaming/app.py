import re
from transformers import GPT2LMHeadModel, GPT2Tokenizer, BartForConditionalGeneration, BartTokenizer
import requests
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import re
import faiss
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()


app = Flask(__name__)
CORS(app)

# Guardian API Key
guardian_api_key = os.getenv("GUARDIAN_API_KEY")

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

# Step 1: Load Pretrained Models
model_name = "gpt2"  # You can use GPT2 for text generation
summarizer_model_name = "facebook/bart-large-cnn"  # Pretrained model for summarization
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

summarizer_model = BartForConditionalGeneration.from_pretrained(summarizer_model_name)
summarizer_tokenizer = BartTokenizer.from_pretrained(summarizer_model_name)

# Step 2: Define Preprocessing Function to Clean Conversational Text
def clean_conversational_text(text):
    conversational_phrases = [
        "I'm sorry", "I believe", "I think", "In my opinion",
        "you know", "I feel", "I just", "Actually", "Let me tell you"
    ]

    for phrase in conversational_phrases:
        text = text.replace(phrase, "")

    # Further cleanup (remove unnecessary personal pronouns like "I")
    text = re.sub(r'\bI\b', '', text)
    text = re.sub(r'\bI\'m\b', '', text)
    return text.strip()

# Step 3: Define Postprocessing Function to Ensure Formal Tone in the Output
def postprocess_output(output):
    conversational_phrases = [
        "I'm sorry", "I believe", "I think", "In my opinion",
        "you know", "I feel", "I just", "Actually", "Let me tell you"
    ]

    for phrase in conversational_phrases:
        output = output.replace(phrase, "")

    # Further cleanup to remove personal pronouns if necessary
    output = re.sub(r'\bI\b', '', output)
    output = re.sub(r'\bI\'m\b', '', output)

    return output.strip()

# Step 4: Define Text Generation Function
def generate_news_content(input_text):
    # Clean input text to remove conversational phrases
    clean_input = clean_conversational_text(input_text)

    # Prepare input text for the model, without adding the prompt phrase in the final output
    input_text = clean_input  # We only use the clean input for text generation
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True)

    # Generate text using the model
    outputs = model.generate(
        inputs['input_ids'],
        max_new_tokens=150,
        num_beams=5,  # Controls diversity and precision of output
        no_repeat_ngram_size=2,  # Prevents repetitive phrases
        temperature=0.7,  # Controls randomness in output
        top_k=50  # Limits the number of possible words
    )

    # Decode the generated output
    news_content = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Postprocess the output to remove any conversational elements
    return postprocess_output(news_content)

# Step 5: Summarize the Whole Text First
def summarize_text(text):
    # Clean text before summarizing
    clean_text = clean_conversational_text(text)

    # Tokenize the text and prepare it for summarization
    inputs = summarizer_tokenizer(clean_text, return_tensors="pt", max_length=1024, truncation=True)

    # Summarize the text
    summary_ids = summarizer_model.generate(
        inputs['input_ids'],
        num_beams=4,
        max_length=150,
        early_stopping=True
    )

    # Decode the summary
    summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# Step 6: Read Input from a Text File
def read_input_from_file(file_path):
    with open(file_path, 'r') as file:
        text = file.read()
    return text

# Step 7: Split Text into Chunks and Process Each Chunk
def split_text_into_chunks(text, max_chunk_length=150):
    # Split the text into chunks of max_chunk_length tokens
    chunks = []
    input_ids = tokenizer.encode(text, truncation=True, max_length=max_chunk_length)

    # Split if necessary
    for i in range(0, len(input_ids), max_chunk_length):
        chunks.append(input_ids[i:i + max_chunk_length])

    return chunks
# 1. Text Cleaning Function
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    return text.strip()

# 2. Fetch and Store Related Content for List of Queries
def fetch_related_content(queries):
    for query in queries:
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
                embedding = similarity_model.encode(clean_text(combined_text), convert_to_tensor=False)
                article_embeddings.append(embedding)
                index.add(np.array([embedding], dtype=np.float32))  # Add to FAISS index

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
    distances, indices = index.search(np.array([query_embedding], dtype=np.float32), top_k)
    results = []
    for idx in indices[0]:
        if idx < len(article_store):  # Valid index check
            results.append(article_store[idx])
    return results

# 5. Aggregation
def final_verdict(scores, weights):
    weighted_sum = sum(score * weight for score, weight in zip(scores, weights))
    return weighted_sum / sum(weights)

# 6. Main Function to Detect Fake News
def is_fake_news(news_text):
    if not index.is_trained or len(article_store) == 0:
        print("No related content indexed. Cannot verify.")
        return "Unverified", 0

    similar_articles = retrieve_similar_articles(news_text, top_k=3)
    if not similar_articles:
        print("No similar articles found. Cannot verify.")
        return "Unverified", 0

    max_similarity = 0  # Track maximum similarity score
    for article_snippet in similar_articles:
        title, snippet = article_snippet.split(" - ", 1)  # Extract title and snippet

        summary = summarize_content(snippet)
        similarity = util.pytorch_cos_sim(
            similarity_model.encode(news_text, convert_to_tensor=True),
            similarity_model.encode(summary, convert_to_tensor=True)
        ).item()
        max_similarity = max(max_similarity, similarity)  # Update max similarity

    print(f"Maximum Similarity: {max_similarity}")
    if max_similarity > 0.4:
        return "Real News", max_similarity
    elif max_similarity > 0.25:
        return "Likely Real News", max_similarity
    elif max_similarity > 0.2:
        return "Unverified", max_similarity
    else:
        return "Likely Fake News", max_similarity


# 7. Function to Process Multiple News
def process_news_list(news_list):
    fetch_related_content(news_list)  # Fetch related content for all news articles
    results = {}
    for idx, news_text in enumerate(news_list):
        print(f"Processing News {idx + 1}...")
        verdict, max_similarity = is_fake_news(news_text)
        results[news_list[idx]] = {
            "Verdict": verdict,
            "Max Similarity": f"{max_similarity:.2f}"  # Display similarity with 2 decimal precision
        }
    return results

# Ensure required directory exists
if not os.path.exists('./transcription'):
    os.makedirs('./transcription')

@app.route('/process', methods=['GET'])
def process_file():
    # Path to the file to be processed
    print("Received a request to /process")
    file_path = './transcription/output_audio.txt'

    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    try:
        # Ensure these functions are defined or imported
        input_text = read_input_from_file(file_path)  # Reads text from the file
        summary = summarize_text(input_text)         # Summarizes the text
        chunks = split_text_into_chunks(summary, max_chunk_length=150)  # Splits text into smaller chunks

        generated_contents = []
        for chunk in chunks:
            chunk_text = tokenizer.decode(chunk, skip_special_tokens=True)  # Decodes chunk using tokenizer
            generated_content = generate_news_content(chunk_text)           # Generates content from chunk
            generated_contents.append(generated_content)

        # Process the generated contents
        generated_contents1 = generated_contents[0].split('\n')
        results = process_news_list(generated_contents1)  # Processes the news list

        # Return the results as JSON
        return jsonify(results)

    except NameError as e:
        # Handle missing functions or variables
        return jsonify({"error": f"Undefined function or variable: {str(e)}"}), 500
    except Exception as e:
        # Handle any other exceptions
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5500)