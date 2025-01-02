from flask import Flask, jsonify, request
from flask_cors import CORS
import praw
import logging
from pytrends.request import TrendReq

app = Flask(__name__)
CORS(app)

REDDIT_CLIENT_ID = "Vc0zoTH0IV6ErgqHpGtY5A"
REDDIT_CLIENT_SECRET = "q8dCCrrMcMkYiwsm4aQ0WrG9-xM6aA"

# Initialize Reddit client
reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent='python:ProdHub:0.1.0(by u/Cyphen4802)'
)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/trending-topics-by-reddit', methods=['GET'])
def get_trending_topics():
    country = request.args.get('country', "india").lower()
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        trending_searches = pytrends.trending_searches(pn=country)
        top_3_trends = trending_searches.head(3)[0].tolist()
        logging.info("Top 3 trending topics in {} are: {}".format(country, top_3_trends))

        results = {}
        for topic in top_3_trends:
            subreddit_posts = []
            for submission in reddit.subreddit("all").search(topic, sort="hot", limit=5):
                post_data = {
                    "title": submission.title,
                    "url": submission.url,
                    "score": submission.score,
                    "thumbnail": get_thumbnail(submission)
                }
                subreddit_posts.append(post_data)
            results[topic] = subreddit_posts

        return jsonify({"country": country, "top_trends": top_3_trends, "reddit_posts": results})

    except Exception as e:
        logging.error(f"Error fetching trends: {e}")
        return jsonify({"error": str(e)}), 500

# Helper function to extract thumbnail URL from Reddit post
def get_thumbnail(submission):
    if hasattr(submission, 'media') and submission.media:
        if 'reddit_video' in submission.media:
            return submission.media['reddit_video'].get('preview', {}).get('images', [{}])[0].get('source', {}).get('url', None)
        elif 'image' in submission.media:
            return submission.media['image'].get('source', {}).get('url', None)
    return None

if __name__ == '__main__':
    app.run(debug=True, port=8080)
