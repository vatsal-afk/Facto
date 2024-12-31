from flask import Flask, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import requests

app = Flask(__name__)
CORS(app)

# Function to extract and limit summary content under <div class="body_content">
def extract_content(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            body_content_div = soup.find('div', class_='body_content')
            if body_content_div:
                content = body_content_div.get_text(strip=True)
                # Limit to the first paragraph or 50 words
                paragraphs = content.split("\n")
                first_para = paragraphs[0] if paragraphs else content
                word_limit_summary = " ".join(first_para.split()[:50]) + "..."
                return word_limit_summary
            else:
                return "Content not found."
        else:
            return f"Failed to retrieve page. Status code: {response.status_code}"
    except Exception as e:
        return f"Error fetching content: {str(e)}"

# Endpoint to fetch bills
@app.route('/get_bills', methods=['GET'])
def get_bills():
    try:
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        # Initialize WebDriver
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

        # Open the PRS India BillTrack page
        url = "https://prsindia.org/billtrack"
        driver.get(url)
        driver.implicitly_wait(10)  # Wait for elements to load

        # Get the page source and quit the driver
        page_source = driver.page_source
        driver.quit()

        # Parse the page with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        # Find all the bill rows
        bill_rows = soup.find_all('div', class_='views-row')[:50]  # Limit to top 50 rows

        # List to store extracted data
        bills = []

        # Loop through each bill row and extract information
        for index, row in enumerate(bill_rows, start=1):
            title_div = row.find('div', class_='views-field-title-field')
            status_div = row.find('div', class_='views-field-field-bill-status')
            
            # Extract the title and link
            title = title_div.find('h3').get_text(strip=True) if title_div else "N/A"
            link = title_div.find('a')['href'] if title_div and title_div.find('a') else None
            full_link = f"https://prsindia.org{link}" if link else "N/A"
            
            # Extract the status
            status = status_div.get_text(strip=True) if status_div else "N/A"
            
            # Fetch the summary/content from the bill's page (only if the link exists)
            content = extract_content(full_link) if full_link != "N/A" else "N/A"
            
            # Append the data in JSON format
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

if __name__ == "__main__":
    app.run(debug=True)