import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify

app = Flask(__name__)

# Endpoint to scrape and analyze
@app.route('/scrape_data', methods=['POST'])
def scrape_and_analyze():
    try:
        data = request.json
        url = data.get('url')
        analysis_server_url = data.get('analysis_server_url')

        if not url:
            return jsonify({"error": "URL is required"}), 400

        if not analysis_server_url:
            return jsonify({"error": "Analysis server URL is required"}), 400

        # Fetch the webpage
        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({"error": f"Failed to fetch the URL: HTTP {response.status_code}"}), 500

        # Parse the webpage content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract the main heading (assuming it's in <h1>)
        heading = soup.find('h1')
        heading_text = heading.get_text().strip() if heading else "No heading found."

        # Extract the first two paragraphs
        paragraphs = soup.find_all('p')
        first_two_paragraphs = [p.get_text().strip() for p in paragraphs[:2] if p.get_text()]
        paragraphs_text = '\n\n'.join(first_two_paragraphs)

        if not paragraphs_text:
            paragraphs_text = "No content found in the first two paragraphs."

        # Prepare the payload for the analysis server
        payload = {
            "news-title": heading_text,
            "news-content": paragraphs_text
        }

        # Send the data to the analysis server
        analysis_response = requests.post(analysis_server_url, json=payload)

        if analysis_response.status_code != 200:
            return jsonify({"error": f"Failed to get response from analysis server: HTTP {analysis_response.status_code}"}), 500

        # Return the analysis response to the client
        analysis_result = analysis_response.json()
        return jsonify(analysis_result)

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
