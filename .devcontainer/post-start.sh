#!/bin/bash
set -e

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Running post-start configuration...${NC}"

# Check for npm package.json changes and install if needed
if [ -f "package.json" ]; then
    # Store package.json hash to compare changes
    if [ ! -f ~/.package-hash ] || [ "$(md5sum package.json | cut -d ' ' -f 1)" != "$(cat ~/.package-hash 2>/dev/null || echo '')" ]; then
        echo -e "${YELLOW}Installing npm dependencies...${NC}"
        npm install
        md5sum package.json | cut -d ' ' -f 1 > ~/.package-hash
    else
        echo -e "${GREEN}npm dependencies are up to date${NC}"
    fi
fi

# Install pre-commit hooks if git repository exists
if [ -d ".git" ] && [ -f ".pre-commit-config.yaml" ]; then
    if [ ! -f ".git/hooks/pre-commit" ]; then
        echo -e "${YELLOW}Installing pre-commit hooks...${NC}"
        pre-commit install
    else
        echo -e "${GREEN}pre-commit hooks already installed${NC}"
    fi
fi

# Create default environment variables if needed
if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Setting up default environment...${NC}"
    ~/.devcontainer/helpers/env-switch.sh local
fi

# Create Terraform backend configuration if needed
if command -v terraform &>/dev/null && [ -d "terraform" ] && [ ! -f "terraform/backend.tf" ]; then
    echo -e "${YELLOW}Would you like to set up Terraform backend configuration? (y/n)${NC}"
    read -p "> " setup_terraform
    if [[ $setup_terraform == "y" ]] || [[ $setup_terraform == "Y" ]]; then
        mkdir -p terraform
        cat > terraform/backend.tf << 'EOL'
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
  # Uncomment for S3 backend
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "your-project/terraform.tfstate"
  #   region = "us-west-2"
  #   encrypt = true
  # }
}
EOL
        chmod 644 terraform/backend.tf
        echo -e "${GREEN}Created Terraform backend configuration${NC}"
    fi
fi

# Check for Claude authentication
if [ ! -f "$HOME/.claude.json" ] || [ ! -s "$HOME/.claude.json" ]; then
    echo -e "${YELLOW}Claude Code is not authenticated${NC}"
    echo "To authenticate, run: ~/.claude/local/claude"
fi

# Security check for credentials
if [ -x ".devcontainer/security/credentials-check.sh" ]; then
    echo -e "${BLUE}Running security check...${NC}"
    .devcontainer/security/credentials-check.sh
fi

echo -e "${GREEN}Post-start configuration completed successfully!${NC}"
