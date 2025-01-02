# Misinformation Detection System

A Real-Time Misinformation Detection and Verification System for Broadcast Media built with Next.js, React, and TypeScript.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (v14.0.0 or later)
* You have installed npm (v6.0.0 or later)
* You have a basic understanding of React and Next.js

## Installation

To install the Misinformation Detection System, follow these steps:

1. Clone the repository:

```git clone [https://github.com/vatsal-afk/TruthTell.git]```


2. Navigate to the project directory:

```cd TruthTell```

3. Install the dependencies:

```npm install```

4. Start the server:

you might need to create a virtual env?

```python -m spacy download en_core_web_sm```

```pip install -r requirements.txt```

## Configuration

1. Create a `.env.local` file in the root directory of the project.

2. Add the following environment variables to the `.env.local`.


## Running the Project

To run the Misinformation Detection System, follow these steps:

1. Start the development server:

```npm run dev```

2. Open your web browser and navigate to `http://localhost:3000`.

## Additional Notes

- This project uses shadcn/ui components. If you need to add more components, you can do so using the following command:

```npx shadcn@latest add [component-name]```

- The smart contract integration for voting is currently a placeholder. You'll need to implement the actual smart contract and update the `voting.tsx` component accordingly.

- The live broadcast analysis using WebRTC and ffmpeg is also a placeholder. You'll need to implement the actual integration in the `live-broadcast-analysis.tsx` component.

- Make sure to update the `AuthProvider` in `components/auth-provider.tsx` with your chosen authentication method.

# Features
1. [Custom News Input for checking](#1-fake-news-verification-model)
2. Graphical analysis of custom news
3. [Youtube news verification system](#2-live-news-verfication-from-youtube)
4. [Voting page for verified users](#how-to-become-a-verified-user)
5. [Discussion page for general users](https://github.com/MaSsKmAn/TruthTell/edit/main/README.md#how-to-join-the-discussion-)
6. Social media display and Trending news display

## How to become a verified user?
To enhance the instructiveness and credibility of the website, users can become **verified users** based on their discussions and posts, particularly for well-known professionals or individuals contributing positively to the platform.

#### Steps to Become a Verified User:

1. **Sign Up**:  
   - Go to the **Auth Page** of the app.
   - Sign up as a **generalist** (a regular user).
   
2. **Submit Documentation**:  
   - Provide the required documentation to verify your identity and professional background.
   - This may include details about your contributions to specific news topics or professional credentials.

3. **Verification Process**:  
   - The **verification team** will review your submission within a few days.
   - Once verified, you will receive access to vote on news topics and contribute to the mission.

4. **Voting Access**:  
   - Once you are verified, you can vote on news topics to help classify them as either **real** or **fake**. Your contributions will directly influence the accuracy of the news verification model.

#### Benefits of Verified Users:
- **Enhanced Contribution**: Verified users can participate in voting and help assess the credibility of news content.
- **Professional Recognition**: Verified users are recognized for their contributions, making the platform more credible and trustworthy.
- **Contribute to the Mission**: As a verified user, you help further the goal of promoting truthfulness and accuracy in news dissemination.
Join the Discussion

## How to join the discussion ?:

### Steps to Participate in the Discussion:

1. **Go to the Discussion Page**:
   - Navigate to the **Discussion Page** within the app where all the ongoing discussions are displayed.

2. **Add Your Comments**:
   - Once you're on the discussion page, you can **write your comments** or opinions about the news topic being discussed.
   - Feel free to share your views, ask questions, or engage with others in the community.

3. **Submit Your Comment**:
   - After writing your comment, simply click on the **Submit Button** to post your response.
   - Your comment will be added to the thread of the discussion along with others' comments.

4. **View the Content**:
   - All content, including your own comments and those of other users, will be displayed in the discussion thread.
   - For now, the content is **stored in the local database** to ensure quick access to the discussions.

### How It Works:

- **Local Storage**:  
  The content posted in discussions is stored temporarily in the local database. This allows users to view all the discussions and participate in real-time.

- **Discussion Thread**:  
  Once submitted, your content will appear along with other users' contributions. The discussion thread will be updated dynamically as more comments are added.

### Benefits of Participating:

- **Engage with Others**:  
  Join in the discussions and share your thoughts on various news topics.
  
- **Enhance the Community**:  
  Your participation helps foster a community of informed and engaged users contributing to the mission of news verification.

- **Real-Time Interaction**:  
  All submitted content is displayed in real-time, allowing for an interactive and dynamic discussion environment.

# About the models

## 1. Fake News Verification Model
This model is designed to accurately verify news claims by utilizing advanced natural language processing (NLP) techniques and embeddings comparison. The core functionality of the model revolves around extracting embeddings from custom news inputs and performing a graph-based search across existing news sources to evaluate similarity. The model ensures comprehensive and precise validation by incorporating multiple decision parameters to detect fake news. 

### Key Features

- **Embedding-Based Similarity Check**:  
  The model generates embeddings of custom news inputs and compares them with embeddings from external news sources. The comparison is based on the distance between these embeddings, which reflects the similarity between the two. This similarity score plays a crucial role in determining the accuracy of the news claim.

- **Fact Density**:  
  Measures the information content per sentence. Fake news often lacks factual depth, focusing more on sensationalism than on providing substantial, evidence-backed details. This parameter helps to detect such shallow content.

- **Lexical Diversity**:  
  Evaluates the vocabulary richness of the news content. Fake news typically uses repetitive or simplified language to mislead readers. By measuring the lexical diversity, the model detects the richness of vocabulary and flags overly simplistic or repetitive language patterns.

- **Sentiment Score**:  
  Evaluates the neutrality of the news content. Fake news often exaggerates negative emotions to trigger a stronger emotional response. The sentiment score helps remove such biases by ensuring that the content maintains a neutral tone.

- **Readability**:  
  Measures the ease of comprehension of the content. Fake news often targets a broad audience, using simpler language to ensure maximum reach. This parameter ensures the content is easy to understand but not oversimplified for manipulation.

### Decision Parameters

The primary decision parameter is the **similarity score** based on the distance between embeddings. This score indicates how similar the input news is to existing content on trusted news sources. The other parameters—fact density, lexical diversity, sentiment score, and readability—serve to refine the accuracy of the verification process. However, the **embedding similarity** carries the highest weight in the calculation of the final score, ensuring that the most significant factor in determining news accuracy is how closely it aligns with verified information.

### How It Works

1. **Input**: A custom news statement is fed into the model.
2. **Embedding Extraction**: The model extracts the embedding of the input news.
3. **Graph-Based Search**: The model performs a graph-based search using the embeddings to find similar news content from external sources.
4. **Similarity Calculation**: The distance between the embeddings of the input news and the external content is calculated. A lower distance indicates higher similarity.
5. **Additional Parameters**: Fact density, lexical diversity, sentiment score, and readability are calculated and used to refine the final decision.
6. **Output**: The model returns a similarity score, verdict (True, False, or somewhere in between), and additional insights into the content quality.

## 2. Live News Verfication from YouTube

This model is a multi-step process for verifying news claims derived from video content. The process starts by converting the video to an audio file, then transcribing it using Whisper. After the transcription, the audio is broken down into news chunks, which are processed with NLP techniques. These chunks are then evaluated for authenticity by a deep learning model that classifies them as either real or fake. Additionally, the system includes an option to specify the timestamp from which to start the recording.

### Key Features

- **Video to Audio Conversion**:  
  The model uses the `youtube-dlp` library to extract audio from video content, making it easy to work with video-based news sources.

- **Audio Transcription with Whisper**:  
  The extracted audio file is passed through the Whisper model to transcribe the audio into text.

- **News Chunk Extraction**:  
  Once transcribed, the text is divided into chunks using a Transformer model and NLP-based word extraction. This allows the model to handle smaller, contextually relevant pieces of information for better analysis.

- **Fake News Classification**:  
  The chunks are sent to the main model for classification as real or fake news. The decision is based on several factors such as fact density, lexical diversity, sentiment score, readability, and most importantly, similarity to existing trusted news content.

- **Timestamp Selection**:  
  The model provides an option to choose the starting timestamp for the recording. This allows for focused analysis on specific sections of a video.

### How It Works

1. **Video Input**: drag and drop the selcted youtube video sample in the placeholder and then click connect to backend.
2. **Audio Extraction**: The video is processed with `youtube-dlp` to extract the audio.
3. **Audio Transcription**: The extracted audio is passed to the Whisper model for transcription.
4. **Chunk Extraction**: The transcribed text is broken down into meaningful chunks using a Transformer model and NLP techniques.
5. **Fake News Detection**: Each chunk is sent to the main model, which compares it against known news sources to classify it as either real or fake.
6. **Timestamp Selection**: Users can select a specific timestamp to start the recording, allowing for tailored news analysis.


## Contributing

If you want to contribute to this project, please fork the repository and create a pull request, or open an issue for discussion.
