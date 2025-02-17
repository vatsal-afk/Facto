import feedparser
import json
from flask import Blueprint, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import requests

bills_bp = Blueprint("bills", __name__)
CORS(bills_bp)

RSS_URL = "https://news.un.org/feed/subscribe/en/news/all/rss.xml"

@bills_bp.route('/get_un_news', methods=['GET'])
def get_un_news():
    try:
        feed = feedparser.parse(RSS_URL)
        news_entries = [{"Title": entry.title, "Link": entry.link, "Published": entry.published, "Summary": entry.summary} for entry in feed.entries]
        return jsonify({"news_entries": news_entries})
    except Exception as e:
        return jsonify({"error": f"Failed to fetch UN news: {str(e)}"}), 500


def extract_content(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            body_content_div = soup.find('div', class_='body_content')
            if body_content_div:
                content = body_content_div.get_text(strip=True)
                word_limit_summary = " ".join(content.split()[:50]) + "..."
                return word_limit_summary
            else:
                return "Content not found."
        else:
            return f"Failed to retrieve page. Status code: {response.status_code}"
    except Exception as e:
        return f"Error fetching content: {str(e)}"


@bills_bp.route('/get_bills', methods=['GET'])
def get_bills():
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        driver.get("https://prsindia.org/billtrack")
        driver.implicitly_wait(10)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()

        bill_rows = soup.find_all('div', class_='views-row')[:50]  # Limit to top 50 rows
        bills = []

        for index, row in enumerate(bill_rows, start=1):
            title_div = row.find('div', class_='views-field-title-field')
            status_div = row.find('div', class_='views-field-field-bill-status')

            title = title_div.find('h3').get_text(strip=True) if title_div else "N/A"
            link = title_div.find('a')['href'] if title_div and title_div.find('a') else None
            full_link = f"https://prsindia.org{link}" if link else "N/A"
            status = status_div.get_text(strip=True) if status_div else "N/A"
            content = extract_content(full_link) if full_link != "N/A" else "N/A"

            bills.append({
                "index": index,
                "title": title,
                "link": full_link,
                "status": status,
                "summary": content
            })

        return jsonify({"bills": bills})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
