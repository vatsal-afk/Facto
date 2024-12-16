from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import whisper
import numpy as np
import soundfile as sf
import io
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # Allow frontend running on localhost:3000
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

model = whisper.load_model("base")  # Load Whisper model

class StreamRequest(BaseModel):
    video_url: str

@app.post("/transcribe")
async def transcribe_live_stream(data: StreamRequest):
    video_url = data.video_url

    # Command to fetch audio stream from YouTube and convert to WAV in memory
    command = [
        "yt-dlp", "-f", "bestaudio", "--no-playlist", video_url,
        "-o", "-", "|", "ffmpeg", "-i", "pipe:", "-f", "wav",
        "-ac", "1", "-ar", "16000", "pipe:1"
    ]

    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error fetching audio: {stderr.decode()}")

        audio_buffer = io.BytesIO()

        while True:
            chunk = process.stdout.read(4096)
            if not chunk:
                break
            audio_buffer.write(chunk)

            if audio_buffer.tell() > 16000 * 2 * 5:  # 5 seconds of audio
                audio_buffer.seek(0)
                audio_data, _ = sf.read(audio_buffer, dtype="int16")
                audio_buffer = io.BytesIO()  # Clear buffer

                # Process the audio chunk
                audio_np = np.frombuffer(audio_data, np.int16).astype(np.float32) / 32768.0
                result = model.transcribe(audio_np)
                yield {"text": result["text"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
