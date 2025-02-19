#!/bin/bash

# Arguments
VIDEO_URL=$1
SEGMENT_DIR=$2

# Check if arguments are provided
if [ -z "$VIDEO_URL" ] || [ -z "$SEGMENT_DIR" ]; then
  echo "Usage: $0 <VIDEO_URL> <SEGMENT_DIR>"
  exit 1
fi

# Ensure the segment directory exists
mkdir -p "$SEGMENT_DIR"

# Start downloading and segmenting audio
yt-dlp -f 'bestaudio[ext=m4a]' --live-from-start "$VIDEO_URL" -o - | \
ffmpeg -i pipe:0 -f segment -segment_time 30 -acodec pcm_s16le -ar 16000 -ac 1 -reset_timestamps 1 "$SEGMENT_DIR/audio_%03d.wav"
