#!/bin/bash
# Script to start a local development server for testing the React application

REACT_APP_DIR="/workspaces/wyatt-personal-aws/src/frontend/react-app"
PORT=3000

# Check if Node.js is installed
if ! command -v npm &>/dev/null; then
    echo "Error: Node.js/npm is not installed. Please install Node.js to use this script."
    exit 1
fi

# Check if the React app directory exists
if [ ! -d "$REACT_APP_DIR" ]; then
    echo "Error: React app directory not found at $REACT_APP_DIR"
    exit 1
fi

# Navigate to the React app directory
cd "$REACT_APP_DIR" || exit 1

# Install dependencies if node_modules doesn't exist
if [ ! -d "$REACT_APP_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting React development server at http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"

# Start React development server
npm start
