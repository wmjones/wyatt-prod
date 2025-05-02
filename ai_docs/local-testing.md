# Testing the Static Website Locally

This guide explains how to test and view the static website locally before deploying it to AWS.

## Prerequisites

- Python 3.x installed (for the simple HTTP server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Access to project files

## Option 1: Using Python's Built-in HTTP Server

Python comes with a simple HTTP server that's perfect for testing static websites.

1. Open a terminal and navigate to the static site directory:

```bash
cd /workspaces/wyatt-personal-aws/src/frontend/static-site
```

2. Start the HTTP server:

```bash
# For Python 3
python -m http.server 8080

# For Python 2 (if you're using an older version)
python -m SimpleHTTPServer 8080
```

3. Open your browser and navigate to:

```
http://localhost:8080
```

4. The website should now be visible in your browser.

5. To stop the server, press `Ctrl+C` in your terminal.

## Option 2: Using the VS Code Live Server Extension

If you're using VS Code, the Live Server extension provides a more feature-rich experience with auto-refresh.

1. Install the "Live Server" extension in VS Code:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. Open the static site folder in VS Code:
   - Navigate to `/workspaces/wyatt-personal-aws/src/frontend/static-site`
   - Open the `index.html` file

3. Start Live Server by clicking on "Go Live" in the status bar at the bottom of VS Code, or right-click on the `index.html` file and select "Open with Live Server".

4. Your browser will automatically open with the website at a URL like:

```
http://127.0.0.1:5500/
```

5. The page will automatically refresh when you make changes to the files.

## Option 3: Using the AWS CLI to Test S3 Website Features

If you want to test S3 website features locally:

1. Create a local S3 website configuration:

```bash
mkdir -p /tmp/s3-local-test
cd /workspaces/wyatt-personal-aws/src/frontend/static-site
cp -r * /tmp/s3-local-test/
```

2. Create a simple S3 website configuration file:

```bash
cat > /tmp/s3-local-test/.s3-website.json << EOF
{
  "IndexDocument": {
    "Suffix": "index.html"
  },
  "ErrorDocument": {
    "Key": "error.html"
  }
}
EOF
```

3. Use the AWS CLI command to simulate the S3 website hosting:

```bash
cd /tmp/s3-local-test
aws s3 website s3://fake-bucket/ --index-document index.html --error-document error.html

# Note: This doesn't actually create a bucket, it just helps you understand
# the S3 website configuration that would be applied.
```

## Testing Tips

1. **Test on Different Browsers**: Ensure your website looks good in Chrome, Firefox, Safari, and Edge.

2. **Test Responsive Design**: Resize your browser window to simulate different screen sizes, or use your browser's developer tools to simulate mobile devices.

3. **Check Error Pages**: Deliberately navigate to a non-existent page (e.g., `/nonexistent.html`) to verify your error page works correctly.

4. **Validate HTML and CSS**: Use online validators like [W3C Markup Validation Service](https://validator.w3.org/) and [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) to check your code.

5. **Test Loading Speed**: Use the Network tab in your browser's developer tools to check how quickly your site loads.

## Deploying Changes

After you've tested your changes locally and are satisfied with them, you can deploy to AWS using the CI/CD pipeline:

1. Commit your changes to the `src/frontend/static-site` directory.
2. Push to the `dev` or `main` branch to trigger the automated deployment:

```bash
git add src/frontend/static-site/
git commit -m "Update static website content"
git push origin dev  # or main for production
```

Alternatively, you can manually deploy using the script provided:

```bash
bash scripts/ci/deploy_static_site.sh dev  # or prod for production
```

## Troubleshooting

- **CORS Issues**: If you're fetching resources from other domains, you might encounter CORS issues. This is expected in a local development environment and will likely work correctly when deployed to S3/CloudFront.

- **Paths Not Working**: Ensure all your links use relative paths correctly. Absolute paths starting with `/` might work differently in local testing vs. when deployed to S3/CloudFront.

- **Images Not Loading**: Check that image paths are correct. The case-sensitivity of file paths may differ between your local environment and S3.
