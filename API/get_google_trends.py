import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from pytrends.request import TrendReq
import logging
import praw
import os

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Environment variables for Reddit API
REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET')

reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent='python:ProdHub:0.1.0(by u/Cyphen4802)'
)

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
                    "thumbnail": get_thumbnail(submission)  # Add thumbnail URL
                }
                subreddit_posts.append(post_data)
            results[topic] = subreddit_posts

        return jsonify({"country": country, "top_trends": top_3_trends, "reddit_posts": results})

    except Exception as e:
        logging.error(f"Error fetching trends: {e}")
        return jsonify({"error": str(e)}), 500


def get_thumbnail(submission):
    """Helper function to extract thumbnail URL from Reddit post"""
    # Check if the post has a media (image, video, etc.)
    if hasattr(submission, 'media') and submission.media:
        if 'reddit_video' in submission.media:
            # If the post is a video, we can return a thumbnail from the video
            return submission.media['reddit_video'].get('preview', {}).get('images', [{}])[0].get('source', {}).get('url', None)
        elif 'image' in submission.media:
            # If it's an image post, return the image URL
            return submission.media['image'].get('source', {}).get('url', None)
    # If no media, we can return the URL of the post itself or None
    return None


if __name__ == '__main__':
    app.run(debug=True, port=5000)
