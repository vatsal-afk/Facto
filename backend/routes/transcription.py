from flask import Blueprint, request, jsonify, current_app
import os
import subprocess
import time
from transformers import GPT2LMHeadModel, GPT2Tokenizer, BartForConditionalGeneration, BartTokenizer
from sentence_transformers import SentenceTransformer, util
import numpy as np
import faiss
import re
from db_config import MongoDBConnection
from db_operations import TranscriptionOperations

transcription_bp = Blueprint("transcription", __name__)

db_connection = MongoDBConnection.get_instance()
transcription_ops = TranscriptionOperations(db_connection)

# Initialize models and tokenizers
model_name = "gpt2"
summarizer_model_name = "facebook/bart-large-cnn"
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
summarizer_model = BartForConditionalGeneration.from_pretrained(summarizer_model_name)
summarizer_tokenizer = BartTokenizer.from_pretrained(summarizer_model_name)
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')

# FAISS Index Setup
embedding_dim = 384
index = faiss.IndexFlatL2(embedding_dim)

# Global variables
article_store = []
article_embeddings = []

# Routes start here
@transcription_bp.route("/transcribe", methods=["POST"])
def transcribe():
    data = request.json
    video_url = data.get("video_url")
    if not video_url:
        return jsonify({"error": "No video URL provided"}), 400

    audio_dir = os.path.join(current_app.root_path, "segments")
    transcription_dir = os.path.join(current_app.root_path, "transcription")

    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(transcription_dir, exist_ok=True)

    # Run the bash script to process the video URL
    command = f'bash process_audio.sh "{video_url}" "{audio_dir}"'
    process = subprocess.run(command, shell=True, text=True, capture_output=True)

    if process.returncode != 0:
        return jsonify({"error": f"Audio processing failed: {process.stderr}"}), 500

    # Transcribe the processed audio file using Whisper
    audio_file_path = os.path.join(audio_dir, "output_audio.aac")
    transcription_file = os.path.join(transcription_dir, "transcription.txt")
    whisper_command = f'whisper "{audio_file_path}" --model base --output_format txt --output_dir "{transcription_dir}"'
    
    whisper_process = subprocess.run(whisper_command, shell=True, text=True, capture_output=True)

    if whisper_process.returncode != 0:
        return jsonify({"error": f"Transcription failed: {whisper_process.stderr}"}), 500

    # Wait for the transcription file to be created
    for _ in range(10):  # Wait up to 5 seconds
        if os.path.exists(transcription_file):
            with open(transcription_file, "r", encoding="utf-8") as f:
                transcription = f.read().strip()
            
            # Process the transcription immediately
            try:
                summary = summarize_text(transcription)
                chunks = split_text_into_chunks(summary, max_chunk_length=150)
                generated_contents = []
                for chunk in chunks:
                    chunk_text = tokenizer.decode(chunk, skip_special_tokens=True)
                    generated_content = generate_news_content(chunk_text)
                    generated_contents.append(generated_content)
                
                generated_contents1 = generated_contents[0].split('\n')
                results = process_news_list(generated_contents1)
                
                return jsonify({
                    "message": "Transcription and analysis completed",
                    "transcriptionUrl": f"/transcription/transcription.txt",
                    "analysis": results
                }), 200
            except Exception as e:
                return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
        
        time.sleep(0.5)

    return jsonify({"error": "Transcription file not found"}), 500

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
# if not os.path.exists('./transcription'):
#     os.makedirs('./transcription')
transcription_bp.route('/save_transcription', methods=['POST'])
def save_transcription_route():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    content = request.json.get('content')
    if not content:
        return jsonify({"error": "No content provided"}), 400

    try:
        document_id = transcription_ops.save_transcription(content)
        return jsonify({"success": True, "document_id": document_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

transcription_bp.route('/process', methods=['GET'])
def process_file():
    print("Received a request to /process")
    # file_path = os.path.join(current_app.root_path, 'transcription', 'output_audio.txt')

    # if not os.path.exists(file_path):
    #     return jsonify({"error": "File not found"}), 404

    try:
        input_text = transcription_ops.get_latest_transcription() 
        if not input_text:
            return jsonify({"error": "No transcription found"}), 404
        summary = summarize_text(input_text)
        chunks = split_text_into_chunks(summary, max_chunk_length=150)

        generated_contents = []
        for chunk in chunks:
            chunk_text = tokenizer.decode(chunk, skip_special_tokens=True)
            generated_content = generate_news_content(chunk_text)
            generated_contents.append(generated_content)

        generated_contents1 = generated_contents[0].split('\n')
        results = process_news_list(generated_contents1)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

