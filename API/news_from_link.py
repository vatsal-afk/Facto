from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def is_news_title(title):
    # Define keywords commonly found in news titles
    news_keywords = [
        "breaking", "live", "update", "report", "news", 
        "analysis", "opinion", "interview", "world", 
        "politics", "economy", "sports", "entertainment"
    ]
    # Check if any keyword is in the title (case-insensitive)
    return any(keyword in title.lower() for keyword in news_keywords)

def scrape_data(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad HTTP responses
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract the title
        title = soup.title.string if soup.title else "No title found"
        
        # Analyze if the title is likely a news article
        news_analysis = "The title suggests it is likely a news article." if is_news_title(title) else "The title does not appear to be a news article."
        
        # Extract the first paragraph of the article
        paragraph = soup.find('p')  # Finds the first <p> tag
        first_paragraph = paragraph.get_text(strip=True) if paragraph else "No paragraph found."
        
        return title, news_analysis, first_paragraph
    
    except requests.exceptions.RequestException as e:
        return None, f"An error occurred: {e}", None

@app.route('/scrape', methods=['POST'])
def scrape():
    # Get URL from the POST request
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    title, news_analysis, first_paragraph = scrape_data(url)
    
    if title:
        try:
            verify_url= "http://localhost:8000/verify_news"
            payload = {"news_text": title+first_paragraph}
            verify_response = requests.post(verify_url, json=payload)
            verify_response.raise_for_status()
            return jsonify(verify_response.json())
        except requests.exceptions.RequestException as e:
            return jsonify({"error:"f"failed to scrape and push: {e}"}), 500
    else:
        return jsonify({"error": news_analysis}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5000)