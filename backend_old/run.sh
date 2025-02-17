#!/bin/bash

echo "Starting backend scripts..."

# Run all Python scripts concurrently
python3 bills-conventions.py &
python3 graph-analysis.py &
python3 reddit-posts.py &

# Keep the script running
wait
