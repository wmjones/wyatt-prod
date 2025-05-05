You will run pre-commit checks (including pre-push hooks) and analyze the results.

1. Run the pre-commit checks for both commit and push stages:
   - First run all regular pre-commit hooks: `pre-commit run --all-files`
   - Then run pre-push hooks specifically: `pre-commit run --hook-stage push --all-files`
   - Finally, save full output for analysis: `cd /workspaces/wyatt-personal-aws && pre-commit run --all-files --hook-stage push > /workspaces/wyatt-personal-aws/precommit.log 2>&1`

2. Read the log file output:
   - Use the Read tool to check the content of `/workspaces/wyatt-personal-aws/precommit.log`

3. Analyze the results:
   - If the log contains errors or warnings (look for words like "Failed", "Error", "Warning", "Failure"):
     a. Create a new TaskMaster task with `mcp__taskmaster-ai__add_task` for fixing the issues
     b. Set a descriptive title like "Fix pre-commit issues"
     c. Include the specific errors in the task description
     d. Set priority to "high"

   - If there are no errors:
     a. Use `git status` to see changes
     b. Use `git add .` to stage all changes
     c. Create a commit with a relevant message describing the changes
     d. End with the standard Claude signature

4. Summarize the action taken (created task or committed changes)
