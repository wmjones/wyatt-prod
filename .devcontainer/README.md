# Claude Code Development Container

This development container provides a fully configured environment for Claude Code development with Node.js, Python, and Terraform.

## Key Features

- Claude Code CLI pre-installed and ready to use
- MCP servers configured for extended functionality
- Authentication persistence for AWS, GitHub, and Terraform
- Development tools including node, python, and terraform
- Full terminal environment with ZSH and Git integration

## Getting Started

1. Open this project in VS Code with the Remote - Containers extension
2. When prompted, select "Reopen in Container"
3. The container will build and initialize automatically
4. Type `cl` to start Claude Code

## Available Commands

- `cl` - Start Claude Code
- `clp "query"` - Run Claude Code with a one-off query
- `tm` - Taskmaster task management
- `cl-help` - Show Claude Code help information

## Customization

Feel free to modify the following files to customize your environment:

- `.devcontainer/Dockerfile` - Container configuration
- `.devcontainer/devcontainer.json` - VS Code integration
- `CLAUDE.md` - Guidelines for Claude Code
