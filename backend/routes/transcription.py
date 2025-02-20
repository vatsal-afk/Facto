from flask import Blueprint, request, jsonify
import numpy as np
import whisper
from transformers import (
    GPT2LMHeadModel, 
    GPT2Tokenizer, 
    BartForConditionalGeneration, 
    BartTokenizer
)
from sentence_transformers import SentenceTransformer, util
import subprocess
import io
import wave
import re
import faiss

transcription_bp = Blueprint("transcription", __name__)

# Initialize models and tokenizers
model_name = "gpt2"
summarizer_model_name = "facebook/bart-large-cnn"
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
summarizer_model = BartForConditionalGeneration.from_pretrained(summarizer_model_name)
summarizer_tokenizer = BartTokenizer.from_pretrained(summarizer_model_name)
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
whisper_model = whisper.load_model("base")

# FAISS Index Setup
embedding_dim = 384
index = faiss.IndexFlatL2(embedding_dim)

# Global variables
article_store = []
article_embeddings = []

def process_audio_chunk(chunk):
    with io.BytesIO(chunk) as buf:
        with wave.open(buf, 'rb') as wav:
            frames = wav.readframes(wav.getnframes())
            audio_data = np.frombuffer(frames, dtype=np.int16)
            audio_float32 = audio_data.astype(np.float32) / 32768.0
            return audio_float32

def clean_conversational_text(text):
    conversational_phrases = [
        "I'm sorry", "I believe", "I think", "In my opinion",
        "you know", "I feel", "I just", "Actually", "Let me tell you"
    ]
    
    for phrase in conversational_phrases:
        text = text.replace(phrase, "")
    
    text = re.sub(r'\bI\b', '', text)
    text = re.sub(r'\bI\'m\b', '', text)
    return text.strip()

def generate_news_content(input_text):
    clean_input = clean_conversational_text(input_text)
    inputs = tokenizer(clean_input, return_tensors="pt", truncation=True)
    
    outputs = model.generate(
        inputs['input_ids'],
        max_new_tokens=150,
        num_beams=5,
        no_repeat_ngram_size=2,
        temperature=0.7,
        top_k=50
    )
    
    news_content = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return clean_conversational_text(news_content)

def summarize_text(text):
    clean_text = clean_conversational_text(text)
    inputs = summarizer_tokenizer(clean_text, return_tensors="pt", max_length=1024, truncation=True)
    
    summary_ids = summarizer_model.generate(
        inputs['input_ids'],
        num_beams=4,
        max_length=150,
        early_stopping=True
    )
    
    return summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def split_text_into_chunks(text, max_chunk_length=150):
    chunks = []
    input_ids = tokenizer.encode(text, truncation=True, max_length=max_chunk_length)
    
    for i in range(0, len(input_ids), max_chunk_length):
        chunks.append(input_ids[i:i + max_chunk_length])
    
    return chunks

def retrieve_similar_articles(news_text, top_k=3):
    query_embedding = similarity_model.encode(news_text, convert_to_tensor=False)
    distances, indices = index.search(np.array([query_embedding], dtype=np.float32), top_k)
    
    results = []
    for idx in indices[0]:
        if idx < len(article_store):
            results.append(article_store[idx])
    return results

def is_fake_news(news_text):
    if not index.is_trained or len(article_store) == 0:
        return "Unverified", 0

    similar_articles = retrieve_similar_articles(news_text, top_k=3)
    if not similar_articles:
        return "Unverified", 0

    max_similarity = 0
    for article_text in similar_articles:
        similarity = util.pytorch_cos_sim(
            similarity_model.encode(news_text, convert_to_tensor=True),
            similarity_model.encode(article_text, convert_to_tensor=True)
        ).item()
        max_similarity = max(max_similarity, similarity)

    if max_similarity > 0.4:
        return "Real News", max_similarity
    elif max_similarity > 0.25:
        return "Likely Real News", max_similarity
    elif max_similarity > 0.2:
        return "Unverified", max_similarity
    else:
        return "Likely Fake News", max_similarity

def process_news_list(news_list):
    results = {}
    for idx, news_text in enumerate(news_list):
        verdict, max_similarity = is_fake_news(news_text)
        results[news_text] = {
            "Verdict": verdict,
            "Max Similarity": f"{max_similarity:.2f}"
        }
    return results

@transcription_bp.route("/transcribe", methods=["POST"])
def transcribe():
    try:
        video_url = request.json.get("video_url")
        if not video_url:
            return jsonify({"error": "No video URL provided"}), 400

        yt_command = [
            "yt-dlp",
            "-f", "bestaudio[ext=m4a]",
            "--live-from-start",
            "-o", "-",
            video_url
        ]

        ffmpeg_command = [
            "ffmpeg",
            "-i", "pipe:0",
            "-f", "segment",
            "-segment_time", "30",
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            "-f", "wav",
            "pipe:1"
        ]

        transcriptions = []
        total_duration = 0

        with subprocess.Popen(yt_command, stdout=subprocess.PIPE) as yt_process:
            with subprocess.Popen(ffmpeg_command, 
                                stdin=yt_process.stdout,
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE) as ffmpeg_process:
                
                while True:
                    chunk = ffmpeg_process.stdout.read(16000 * 2 * 30)
                    if not chunk:
                        break
                    
                    audio_array = process_audio_chunk(chunk)
                    result = whisper_model.transcribe(audio_array)
                    transcriptions.append(result["text"])
                    
                    total_duration += 30
                    if total_duration >= 1800:  # 30 minutes max
                        break

        full_transcription = " ".join(transcriptions)
        summary = summarize_text(full_transcription)
        chunks = split_text_into_chunks(summary)
        
        generated_contents = [generate_news_content(tokenizer.decode(chunk, skip_special_tokens=True)) 
                            for chunk in chunks]
        
        analysis_results = process_news_list(generated_contents)

        return jsonify({
            "status": "success",
            "transcription": full_transcription,
            "summary": summary,
            "analysis": analysis_results
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500