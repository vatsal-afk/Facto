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

# Download the entire audio and trim it to the first 20 minutes
yt-dlp -f bestaudio "$VIDEO_URL" -o - | \
ffmpeg -i pipe:0 -t 120 -c copy "$SEGMENT_DIR/output_audio.aac"
