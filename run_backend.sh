#!/bin/bash

# Ensure the script exits immediately if a command fails
set -e

# Navigate to the virtual environment directory and activate it
echo "Activating virtual environment..."
source ./streaming/source/venv/bin/activate

# Navigate to the backend directory (if necessary)
cd "$(dirname "$0")/backend"

# Execute the bills-conventions.py script
echo "Running bills-conventions.py..."
python3 bills-conventions.py

# Execute the graph-analysis.py script
echo "Running graph-analysis.py..."
python3 graph-analysis.py

# Execute the reddit-posts.py script
echo "Running reddit-posts.py..."
python3 reddit-posts.py

# Print a success message
echo "All scripts executed successfully!"

# Deactivate the virtual environment
deactivate
