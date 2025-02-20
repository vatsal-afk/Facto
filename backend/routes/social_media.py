from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import praw
import logging
from pytrends.request import TrendReq
from dotenv import load_dotenv
import os

social_router = APIRouter()

load_dotenv()

REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")

reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent='python:ProdHub:0.1.0(by u/Cyphen4802)'
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@social_router.get('/trending-topics-by-reddit')
async def get_trending_topics(country: str = Query("india", description="Country to fetch trends for")):
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        trending_searches = pytrends.trending_searches(pn=country)
        top_3_trends = trending_searches.head(3)[0].tolist()
        logging.info(f"Top 3 trending topics in {country} are: {top_3_trends}")

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

        return JSONResponse(content={"country": country, "top_trends": top_3_trends, "reddit_posts": results})

    except Exception as e:
        logging.error(f"Error fetching trends: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

def get_thumbnail(submission):
    if hasattr(submission, 'media') and submission.media:
        if 'reddit_video' in submission.media:
            return submission.media['reddit_video'].get('preview', {}).get('images', [{}])[0].get('source', {}).get('url', None)
        elif 'image' in submission.media:
            return submission.media['image'].get('source', {}).get('url', None)
    return None
