#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Function to display errors
error_exit() {
  echo "ERROR: $1" >&2
  exit 1
}

# Function to display status
status() {
  echo "✅ $1"
}

# Function to display warning
warning() {
  echo "⚠️ $1"
}

echo "Running post-create setup..."

# Determine project directory more reliably
WORKSPACE_DIR="/workspaces"

# Check if we can find the actual workspace directory
if [ -d "$WORKSPACE_DIR" ]; then
  # Find the first directory in /workspaces that isn't node_modules or package
  PROJECT_DIR=$(find "$WORKSPACE_DIR" -mindepth 1 -maxdepth 1 -type d -not -name "node_modules" -not -name "package" | head -n 1)

  # If we couldn't find a directory, default to the workspace dir itself
  if [ -z "$PROJECT_DIR" ]; then
    PROJECT_DIR="$WORKSPACE_DIR"
  fi
else
  # If /workspaces doesn't exist, use the current directory
  PROJECT_DIR="$(pwd)"
fi

echo "Using project directory: $PROJECT_DIR"

# Install Claude Code globally instead of locally
if ! command -v claude &> /dev/null; then
  echo "Installing Claude Code globally..."

  # Install Claude Code globally
  npm install -g @anthropic-ai/claude-code || error_exit "Failed to install Claude Code globally"

  status "Claude Code installed globally"
else
  status "Claude Code already installed globally"
fi

# Set up ZSH plugins if not already installed
echo "Setting up ZSH plugins..."

# Install zsh-autosuggestions if not already installed
if [ ! -d "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ]; then
  echo "Installing zsh-autosuggestions plugin..."
  git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
  status "zsh-autosuggestions plugin installed"
else
  warning "zsh-autosuggestions plugin already installed, skipping"
fi

# Install zsh-syntax-highlighting if not already installed
if [ ! -d "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting" ]; then
  echo "Installing zsh-syntax-highlighting plugin..."
  git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
  status "zsh-syntax-highlighting plugin installed"
else
  warning "zsh-syntax-highlighting plugin already installed, skipping"
fi

# Update .zshrc plugins if needed
if grep -q "plugins=(git)" ~/.zshrc; then
  echo "Updating plugins in .zshrc..."
  sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc
  status "Updated plugins in .zshrc"
elif ! grep -q "zsh-autosuggestions" ~/.zshrc; then
  echo "Adding plugins to .zshrc..."
  # This is a bit trickier - we need to find the plugins line and modify it
  # For now, let's just inform the user
  warning "Couldn't automatically update plugins in .zshrc"
  echo "   Please manually ensure these plugins are enabled in your .zshrc:"
  echo "   plugins=(... zsh-autosuggestions zsh-syntax-highlighting ...)"
fi
