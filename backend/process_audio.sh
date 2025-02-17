# #!/bin/bash

# # Arguments
# VIDEO_URL=$1
# SEGMENT_DIR=$2

# # Ensure the segment directory exists
# mkdir -p "$SEGMENT_DIR"

# # Download and segment audio into 30-second chunks, starting 30 seconds behind live
# yt-dlp -f bestaudio "$VIDEO_URL" -o - | \
# ffmpeg -i pipe:0 -f segment -segment_time 30 -c copy -reset_timestamps 1 "$SEGMENT_DIR/audio_%03d.aac" -af "adelay=30000|30000"


#!/bin/bash

# Arguments
VIDEO_URL=$1
SEGMENT_DIR=$2

# Ensure the segment directory exists
mkdir -p "$SEGMENT_DIR"

# Download and segment audio into 30-second chunks in real-time
yt-dlp -f 'bestaudio[ext=m4a]' --live-from-start "$VIDEO_URL" -o - | \
ffmpeg -i pipe:0 -f segment -segment_time 30 -acodec pcm_s16le -ar 16000 -ac 1 -reset_timestamps 1 "$SEGMENT_DIR/audio_%03d.wav"
