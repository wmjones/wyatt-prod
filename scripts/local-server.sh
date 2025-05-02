#!/bin/bash
# Simple script to start a local development server for testing the static website

STATIC_SITE_DIR="/workspaces/wyatt-personal-aws/src/frontend/static-site"
PORT=8080

# Check if Python is installed
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "Error: Python is not installed. Please install Python to use this script."
    exit 1
fi

# Check if the static site directory exists
if [ ! -d "$STATIC_SITE_DIR" ]; then
    echo "Error: Static site directory not found at $STATIC_SITE_DIR"
    exit 1
fi

# Navigate to the static site directory
cd "$STATIC_SITE_DIR" || exit 1

echo "Starting local development server at http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"

# Start Python HTTP server
if [ "$PYTHON_CMD" = "python3" ]; then
    $PYTHON_CMD -m http.server $PORT
else
    $PYTHON_CMD -m SimpleHTTPServer $PORT
fi
