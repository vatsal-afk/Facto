import feedparser
import json

# URL of the UN News RSS feed
rss_url = "https://news.un.org/feed/subscribe/en/news/all/rss.xml"

# Parse the RSS feed
feed = feedparser.parse(rss_url)

# List to store news entries
news_entries = []

# Extract and store news entries
for entry in feed.entries:
    news_entry = {
        "Title": entry.title,
        "Link": entry.link,
        "Published": entry.published,
        "Summary": entry.summary
    }
    news_entries.append(news_entry)

# Save the data to a JSON file
with open('un_news_entries.json', 'w', encoding='utf-8') as json_file:
    json.dump(news_entries, json_file, ensure_ascii=False, indent=4)

print("News entries have been saved to 'un_news_entries.json'.")
