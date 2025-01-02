#!/bin/bash

# Ensure the script exits immediately if a command fails
set -e

# Navigate to the virtual environment directory and activate it
echo "Activating virtual environment..."
source ./streaming/venv/bin/activate

# Navigate to the backend directory (if necessary)
cd "$(dirname "$0")/backend"

# Run the Python scripts concurrently
echo "Running bills-conventions.py..."
python3 bills-conventions.py &

echo "Running graph-analysis.py..."
python3 graph-analysis.py &

echo "Running reddit-posts.py..."
python3 reddit-posts.py &

# Wait for all background jobs to complete
wait

# Print a success message
echo "All scripts executed successfully!"

# Deactivate the virtual environment
deactivate
