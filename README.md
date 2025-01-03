# Welcome to **Facto**!

**Facto** is a Real-Time Misinformation Detection and Verification System for Broadcast Media. It analyzes news from various sources in real-time, validates its credibility, and provides accurate information to users.

---

## Project Setup

### Prerequisites

Ensure that you have the following software installed before setting up the project:

- **Node.js** (v14 or later)
- **npm** (v6 or later)

#### Additional Notes

- This project uses shadcn/ui components. If you need to add more components, you can do so using the following command:

```npx shadcn@latest add [component-name]```

### Steps to Set Up the Project

1. **Clone the repository**:
```bash
   git clone https://github.com/your-username/facto.git
   ```
2.  **Set up the Backend**:
Navigate to the `@/streaming` :
```bash
	chmod +x run_backend.sh
   ./run_backend.sh
   ``` 
3.  **Set up the Frontend**:
Navigate to the `@/frontend` directory:
```bash
   npm install
   npm run dev
   ``` 
       
## Configuration

To configure the project, create a `.env` file in the root directory with

`NEXT_PUBLIC_GUARDIAN_API_KEY=your_guardian_api_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
MONGODB_URI=your_mongodb_connection_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_api_secret`

# Features
1.  [Custom News Input for Verification](#1-fake-news-verification-model)
2.  [Graphical Analysis of Custom News](#graphical-output)
3.  [YouTube News Verification System](#2-live-news-verification-from-youtube)
4.  [Voting for Verified Users](#how-to-become-a-verified-user)
5.  [Discussion Forum for General Users](#how-to-join-the-discussion)
6.  [Trending News and Social Media Insights](#webscraping-the-recent-news)

## How to Become a Verified User?

To improve the reliability and credibility of the platform, users can become **verified** based on their contributions, such as sharing news insights or engaging in discussions. This feature is designed for professionals or individuals who actively contribute to the platform’s goals.

### Steps to Become Verified:

1.  **Sign Up**:
    
    -   Visit the **Auth Page** and sign up as a **general user**.
2.  **Submit Credentials**:
    
    -   Provide documentation that confirms your professional background or contributions to specific news topics.
3.  **Verification Review**:
    
    -   The verification team will assess your submission and confirm your status within a few days.
4.  **Voting Access**:
    
    -   After verification, you'll gain the ability to vote on news accuracy and contribute to the model’s evaluation.

#### Benefits of Verification:

-   **Contribute Meaningfully**: Verified users can vote to determine whether news is real or fake.
-   **Build Credibility**: Verified status enhances your recognition as a trustworthy participant.
-   **Support Accuracy**: Your verified status helps improve the quality of news verification.

----------

## How to Join the Discussion?

### Steps to Participate:

1.  **Navigate to the Discussion Page**:
    
    -   Go to the **Discussion Page** within the app to see ongoing conversations.
2.  **Share Your Thoughts**:
    
    -   Add comments, ask questions, or engage with others about the news topics being discussed.
3.  **Submit Your Comment**:
    
    -   After writing your comment, click **Submit** to post it in the discussion.
4.  **View All Comments**:
    
    -   All comments, including yours, will be visible in the discussion thread.

### How It Works:

-   **Local Storage**: Discussions are temporarily stored locally for fast access and real-time updates.
    
-   **Interactive Thread**: Comments are added dynamically to the discussion thread as users post them.
    

### Benefits of Joining:

-   **Engage with the Community**: Share opinions and interact with others to shape the platform.
-   **Dynamic Conversations**: Real-time commenting fosters active participation.
-   **Help Shape the Mission**: Your voice supports the goal of reducing misinformation.

----------

## Web Scraping for Recent News

This feature collects and analyzes the latest news articles from reliable sources like The Guardian, Reddit, and News API. Using libraries like **BeautifulSoup** for HTML parsing, **Requests** for HTTP requests, and **praw** for accessing Reddit’s API, the platform retrieves diverse and up-to-date content. The data is then processed for analysis and insights, ensuring relevant news is always available for verification.

----------

# About the Models

## 1. Fake News Verification Model

This model verifies the authenticity of news by comparing custom inputs to trusted sources. It uses advanced **natural language processing (NLP)** and **embedding-based similarity** checks to assess the credibility of news claims.

### Key Features:

-   **Embedding-Based Comparison**: Compares news input embeddings with external sources to check for similarities.
-   **Fact Density**: Measures the factual depth of news to detect sensationalism.
-   **Lexical Diversity**: Assesses vocabulary richness to flag repetitive or overly simplified language.
-   **Sentiment Analysis**: Evaluates emotional bias in the content, aiming for neutrality.
-   **Readability**: Ensures content is clear and not oversimplified.

### How It Works:

1.  **Input News**: Custom news input is provided.
2.  **Embedding Extraction**: The input is transformed into embeddings.
3.  **Similarity Check**: The model compares the embeddings to trusted sources.
4.  **Refinement**: Additional parameters (fact density, sentiment, etc.) refine the decision.
5.  **Output**: The model returns a **credibility score** and a **verdict** (real or fake).

### Visual Output:

-   Bar charts and interactive symbols display scores for each parameter, providing a clear visual summary of the news verification process.

----------

## 2. Live News Verification from YouTube

This model verifies news from YouTube videos using a multi-step process that extracts audio, transcribes it, and analyzes the content for authenticity. It relies on advanced **audio-to-text transcription** and **NLP-based chunking** to evaluate the news in smaller, context-specific pieces.

### Key Features:

-   **Audio Extraction**: Uses `youtube-dlp` to convert video content into audio.
-   **Whisper for Transcription**: Transcribes the audio into text using the Whisper model.
-   **News Chunking**: Breaks transcribed text into meaningful chunks for easier analysis.
-   **Fake News Classification**: Classifies news as real or fake based on similarity to trusted sources.
-   **Timestamp Flexibility**: Allows users to select a starting timestamp for targeted analysis.

### How It Works:

1.  **Input Video**: Upload the YouTube video to be analyzed.
2.  **Audio Conversion**: Extracts audio using `youtube-dlp`.
3.  **Audio Transcription**: Transcribes the audio to text using Whisper.
4.  **Content Chunking**: Breaks the transcription into chunks for detailed analysis.
5.  **Verification**: Each chunk is analyzed for authenticity and classified accordingly.
6.  **Timestamp Selection**: Users can specify where to start analyzing the video.

## Flow of the project

Here is a detailed flowchart showing various routes:
```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant Auth
    participant TrendAnalysis
    participant Counter
    participant LiveBroadcast
    participant Transcribe
    participant Process
    participant CustomNews
    participant GraphAnalysis
    participant Bills
    participant UN
    participant SocialMedia

    User->>Dashboard: Access Tailor-made Dashboard
    Dashboard->>Auth: User Login (Journalist/General)
    Auth->>Dashboard: Return Authenticated User
    
    Dashboard->>TrendAnalysis: Analyze Recent News Articles
    TrendAnalysis->>Counter: Vote on Articles
    
    Dashboard->>LiveBroadcast: Analyze Live YouTube Broadcast
    LiveBroadcast->>Transcribe: Use yt-dlp & FFmpeg for Audio Extraction
    Transcribe->>Process: Summarize Transcription
    
    Dashboard->>CustomNews: Input Custom News Data
    CustomNews->>GraphAnalysis: Analyze Custom News

    Dashboard->>Bills: Get Recent Parliamentary Bills
    Dashboard->>UN: Get Latest UN Convention Updates
    Dashboard->>SocialMedia: Analyze Social Media Links

    Note right of TrendAnalysis: Trend analysis helps in identifying fake news
    Note right of Counter: Voting allows users to reduce misinformation
    Note right of LiveBroadcast: Extracting and transcribing YouTube live videos
    Note right of GraphAnalysis: Web scraping and graph-based news analysis
```