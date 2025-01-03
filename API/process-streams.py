from flask import Flask, request, jsonify, send_file, url_for
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import spacy
from textstat import flesch_reading_ease
import networkx as nx
import matplotlib.pyplot as plt
import requests
import re
import time
import os
from flask_cors import CORS

app = Flask(__name__, static_folder="static")
CORS(app)

# API Keys from environment variables
GUARDIAN_API_KEY = os.getenv('GUARDIAN_API_KEY')
NEWS_API_KEY = os.getenv('NEWS_API_KEY')

# Model Initialization
tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
sentiment_analyzer = pipeline('sentiment-analysis')
nlp = spacy.load("en_core_web_sm")

# Data storage
article_store = []
app.config['KNOWLEDGE_GRAPH_DIR'] = 'static/knowledge_graphs'

def clean_text(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def create_knowledge_graph(summary):
    doc = nlp(summary)
    graph = nx.DiGraph()
    
    dependency_map = {
        "nsubj": "subject of",
        "dobj": "object of",
        "prep": "related to",
        "amod": "describes",
        "pobj": "prepositional object",
        "advmod": "modifies",
        "ROOT": "main action",
        "attr": "attribute of",
        "acomp": "complement",
    }

    entities = [(ent.text, ent.label_) for ent in doc.ents 
               if ent.label_ in ['ORG', 'GPE', 'LOC', 'PERSON', 'NORP']]
    connected_nodes = set()

    for ent in entities:
        if ent[1] in ['ORG', 'GPE', 'LOC', 'PERSON']:
            graph.add_node(ent[0], label=ent[1])

    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN']:
            if token.dep_ in dependency_map and token.head.pos_ == "VERB":
                relation = dependency_map.get(token.dep_, "related to")
                graph.add_edge(token.head.text, token.text, label=relation)
                connected_nodes.add(token.head.text)
                connected_nodes.add(token.text)

    nodes_to_remove = [node for node in graph.nodes if node not in connected_nodes]
    graph.remove_nodes_from(nodes_to_remove)

    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(graph)
    nx.draw(graph, pos, with_labels=True, node_size=3000, 
            node_color="lightblue", font_size=10, font_weight="bold")
    plt.title("Knowledge Graph - Noun Nodes Only")
    # plt.savefig("knowledge_graph.png", format="PNG")
    # plt.close()
    if not os.path.exists(app.config['KNOWLEDGE_GRAPH_DIR']):
        os.makedirs(app.config['KNOWLEDGE_GRAPH_DIR'])
    
    filename = f"knowledge_graph_{int(time.time())}.png"
    filepath = os.path.join(app.config['KNOWLEDGE_GRAPH_DIR'], filename)
    plt.savefig(filepath, format="PNG")
    plt.close()

    return list(connected_nodes), filename

def fetch_related_content(query):
    # Guardian API
    search_url_guardian = "https://content.guardianapis.com/search"
    params_guardian = {
        "q": query,
        "api-key": GUARDIAN_API_KEY,
        "show-fields": "headline,standfirst"
    }
    response_guardian = requests.get(search_url_guardian, params=params_guardian)
    articles_guardian = response_guardian.json().get('response', {}).get('results', [])
    
    # NewsAPI
    search_url_newsapi = "https://newsapi.org/v2/everything"
    params_newsapi = {
        "q": query,
        "apiKey": NEWS_API_KEY,
        "language": "en",
        "sortBy": "relevancy"
    }
    response_newsapi = requests.get(search_url_newsapi, params=params_newsapi)
    articles_newsapi = response_newsapi.json().get('articles', [])
    
    # Process articles
    for article in articles_guardian:
        title = article.get("webTitle", "")
        snippet = article["fields"].get("standfirst", "")
        process_article(title, snippet)

    for article in articles_newsapi:
        title = article.get("title", "")
        snippet = article.get("description", "")
        process_article(title, snippet)

def process_article(title, snippet):
    if snippet:
        combined_text = f"{title} - {snippet}"
        article_store.append(combined_text)

def calculate_scores(input_text, related_snippet):
    sentiment_score = sentiment_consistency(input_text, related_snippet)
    fact_density = fact_density_score(input_text)
    readability = readability_score(input_text)
    lexical_diversity = lexical_diversity_score(input_text)
    
    return {
        'sentiment_consistency': sentiment_score,
        'fact_density': fact_density,
        'readability': readability,
        'lexical_diversity': lexical_diversity
    }

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

def get_verdict(similarity_score):
    if similarity_score > 0.4:
        return "Real News"
    elif similarity_score > 0.25:
        return "Likely Real News"
    elif similarity_score > 0.2:
        return "Unverified"
    else:
        return "Likely Fake News"

@app.route('/verify_news', methods=['POST'])
def verify_news():
    try:
        data = request.get_json()
        news_text = data.get('news_text')
        
        if not news_text:
            return jsonify({'error': 'No news text provided'}), 400
        
        # Clear previous data
        article_store.clear()
        
        # Fetch and process related content
        fetch_related_content(news_text)
        
        if not article_store:
            return jsonify({'error': 'No related content found'}), 404
        
        # Calculate similarity
        news_embedding = similarity_model.encode(news_text, convert_to_tensor=True)
        max_similarity = 0
        best_article = ""
        
        for article in article_store:
            similarity = util.pytorch_cos_sim(
                news_embedding,
                similarity_model.encode(article, convert_to_tensor=True)
            ).item()
            
            if similarity > max_similarity:
                max_similarity = similarity
                best_article = article
        
        # Generate knowledge graph
        connected_nodes, graph_filename = create_knowledge_graph(best_article)
        graph_url = url_for('static', filename=f'knowledge_graphs/{graph_filename}', _external=True)
        
        # Calculate scores
        scores = calculate_scores(news_text, best_article)
        verdict = get_verdict(max_similarity)
        
        response = {
            'status': 'success',
            'results': {
                'scores': scores,
                'maximum_similarity': max_similarity,
                'verdict': verdict,
                'knowledge_graph': graph_url,
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
