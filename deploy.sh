pip install -r /Users/wyatt.jones6/Library/CloudStorage/OneDrive-Chick-fil-A,Inc/Documents/git_repos/wyatt-prod/requirements.txt -t ./
zip -r9 deployment_package.zip .
cp /Users/wyatt.jones6/Library/CloudStorage/OneDrive-Chick-fil-A,Inc/Documents/git_repos/wyatt-prod/src/lambda/getTodoist.py .
zip -r deployment_package.zip getTodoist.py