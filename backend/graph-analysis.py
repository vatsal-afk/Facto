from flask import Flask, request, jsonify, send_file, url_for
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util
import spacy
import networkx as nx
import time
import os
import requests
import re
import logging

app = Flask(__name__, static_folder="static")
CORS(app)

# Initialize models
tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
sentiment_analyzer = pipeline('sentiment-analysis')
nlp = spacy.load("en_core_web_sm")

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app.config['KNOWLEDGE_GRAPH_DIR'] = 'static/knowledge_graphs'

# Helper function to clean text
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s]', '', text)  # Remove non-alphanumeric characters
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
    return text.strip()

# Helper function to generate knowledge graph
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
    entities = [(ent.text, ent.label_) for ent in doc.ents if ent.label_ in ['ORG', 'GPE', 'LOC', 'PERSON', 'NORP']]
    connected_nodes = set()

    for ent in entities:
        if ent[1] in ['ORG', 'GPE', 'LOC', 'PERSON']:
            graph.add_node(ent[0], label=ent[1])

    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN'] and token.dep_ in dependency_map:
            relation = dependency_map.get(token.dep_, "related to")
            graph.add_edge(token.head.text, token.text, label=relation)
            connected_nodes.add(token.head.text)
            connected_nodes.add(token.text)

    nodes_to_remove = [node for node in graph.nodes if node not in connected_nodes]
    graph.remove_nodes_from(nodes_to_remove)

    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(graph)
    nx.draw(graph, pos, with_labels=True, node_size=3000, node_color="lightblue", font_size=10, font_weight="bold")
    plt.title("Knowledge Graph - Noun Nodes Only")

    if not os.path.exists(app.config['KNOWLEDGE_GRAPH_DIR']):
        os.makedirs(app.config['KNOWLEDGE_GRAPH_DIR'])

    filename = f"knowledge_graph_{int(time.time())}.png"
    filepath = os.path.join(app.config['KNOWLEDGE_GRAPH_DIR'], filename)
    plt.savefig(filepath, format="PNG")
    plt.close()

    return list(connected_nodes), filename

# Function to fetch related content from external sources
def fetch_related_content(query):
    articles = []
    search_url_guardian = "https://content.guardianapis.com/search"
    params_guardian = {
        "q": query,
        "api-key": "YOUR_GUARDIAN_API_KEY",
        "show-fields": "headline,standfirst"
    }
    response_guardian = requests.get(search_url_guardian, params=params_guardian)
    articles_guardian = response_guardian.json().get('response', {}).get('results', [])

    search_url_newsapi = "https://newsapi.org/v2/everything"
    params_newsapi = {
        "q": query,
        "apiKey": "YOUR_NEWS_API_KEY",
        "language": "en",
        "sortBy": "relevancy"
    }
    response_newsapi = requests.get(search_url_newsapi, params=params_newsapi)
    articles_newsapi = response_newsapi.json().get('articles', [])

    for article in articles_guardian + articles_newsapi:
        title = article.get("title", article.get("webTitle", ""))
        snippet = article.get("description", article.get("fields", {}).get("standfirst", ""))
        if title and snippet:
            articles.append(f"{title} - {snippet}")

    return articles

@app.route('/verify_news', methods=['POST'])
def verify_news():
    try:
        data = request.get_json()
        news_text = data.get('news_text')

        if not news_text:
            return jsonify({'error': 'No news text provided'}), 400

        articles = fetch_related_content(news_text)
        if not articles:
            return jsonify({'error': 'No related content found'}), 404

        news_embedding = similarity_model.encode(news_text, convert_to_tensor=True)
        max_similarity = 0
        best_article = ""

        for article in articles:
            similarity = util.pytorch_cos_sim(news_embedding, similarity_model.encode(article, convert_to_tensor=True)).item()
            if similarity > max_similarity:
                max_similarity = similarity
                best_article = article

        connected_nodes, graph_filename = create_knowledge_graph(best_article)
        graph_url = url_for('static', filename=f'knowledge_graphs/{graph_filename}', _external=True)

        response = {
            'status': 'success',
            'results': {
                'scores': {
                    'fact_density': 0.8,  # Placeholder values
                    'lexical_diversity': 0.7,
                    'readability': 60,
                    'sentiment_consistency': 0.9,
                },
                'maximum_similarity': max_similarity,
                'verdict': "Real News" if max_similarity > 0.8 else "Fake News",
                'knowledge_graph': graph_url,
            }
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
