import whisper

# Load the whisper model
model = whisper.load_model("base")

# Transcribe the audio file
result = model.transcribe("segments/audio_224.aac")

# Print the transcribed text
print(result["text"])
