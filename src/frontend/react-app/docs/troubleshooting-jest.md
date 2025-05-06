# Troubleshooting Jest in DevContainer Environment

This document provides solutions for common issues that may occur when running Jest tests in the VS Code DevContainer environment.

## Common Issues and Solutions

### 1. "spawn /bin/sh ENOENT" Error

This error occurs when Jest attempts to spawn a shell process but cannot find the shell executable.

**Solutions:**

- **Check shell symlink**: Ensure `/bin/sh` is properly linked to `/bin/bash`:
  ```bash
  ls -la /bin/sh
  ```
  If it's not linked to bash, fix it with:
  ```bash
  sudo rm -f /bin/sh && sudo ln -sf /bin/bash /bin/sh
  ```

- **Explicitly define shell paths** in your devcontainer.json:
  ```json
  "terminal.integrated.profiles.linux": {
    "bash": {
      "path": "/bin/bash",
      "icon": "terminal-bash"
    }
  }
  ```

### 2. Path Variables in Jest Configuration

Using VS Code variables like `${workspaceFolder}` in Jest configurations can cause ENOENT errors.

**Solutions:**

- Use relative paths instead of VS Code variables:
  ```json
  // Instead of:
  "jest.rootPath": "${workspaceFolder}/src/frontend/react-app"

  // Use:
  "jest.rootPath": "src/frontend/react-app"
  ```

- Add a `"cwd"` setting to your Jest configuration:
  ```json
  "jest.cwd": "src/frontend/react-app"
  ```

### 3. Jest Command Line Issues

**Solutions:**

- Simplify the Jest command line:
  ```json
  "jest.jestCommandLine": "npm test --"
  ```

- Ensure the command runs in the correct directory:
  ```json
  "jest.jestCommandLine": "cd /workspaces/your-project/src/frontend/react-app && npm test --"
  ```

### 4. Extension Conflicts

Having multiple Jest extensions installed can cause conflicts.

**Solutions:**

- Use only one Jest extension - the current recommended one is:
  ```json
  "jest-community.jest"
  ```

- Remove older Jest extensions:
  ```json
  // Remove:
  "orta.vscode-jest"
  "firsttris.vscode-jest-runner"
  ```

### 5. Running Tests Results in Zero Tests Found

**Solutions:**

- Check the Jest configuration file paths:
  ```bash
  cat src/frontend/react-app/jest.config.js
  ```

- Ensure the test paths are correctly configured:
  ```javascript
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ]
  ```

- Verify test file naming convention matches the configuration

### 6. Debugging Tests Doesn't Work

**Solutions:**

- Update launch.json for debugging Jest tests:
  ```json
  {
    "name": "Debug Jest Tests",
    "type": "node",
    "request": "launch",
    "runtimeExecutable": "npm",
    "runtimeArgs": [
      "test",
      "--",
      "--runInBand",
      "--watchAll=false"
    ],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen",
    "cwd": "${workspaceFolder}/src/frontend/react-app",
    "env": {
      "NODE_ENV": "test"
    }
  }
  ```

### 7. Permission Denied Errors When Running Tests

**Solutions:**

- Check and fix permissions for Jest binary:
  ```bash
  chmod +x src/frontend/react-app/node_modules/.bin/jest
  ```

- Ensure test directories have proper permissions:
  ```bash
  sudo chown -R vscode:vscode /home/vscode/.cache/jest
  sudo chmod -R 755 /home/vscode/.cache/jest
  ```

## Verifying Your Configuration

After making changes, verify that your environment is properly configured:

1. Check shell path:
   ```bash
   ls -la /bin/sh
   ```

2. Check Jest binary permissions:
   ```bash
   ls -la src/frontend/react-app/node_modules/.bin/jest
   ```

3. Run Jest in dry-run mode to verify configuration:
   ```bash
   cd src/frontend/react-app && npm test -- --listTests
   ```

## Recovering from Persistent Issues

If issues persist after trying the above solutions:

1. **Rebuild the container**:
   - Open VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Select "Remote-Containers: Rebuild Container"

2. **Reinstall Jest**:
   ```bash
   cd src/frontend/react-app
   npm uninstall jest @testing-library/react @testing-library/jest-dom
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

3. **Reset Jest cache**:
   ```bash
   npm test -- --clearCache
   ```
