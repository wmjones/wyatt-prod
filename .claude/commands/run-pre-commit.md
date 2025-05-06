You will run pre-commit checks (including pre-push hooks) and update snapshots as needed.

1. First, update all snapshots using the manual jest-update-snapshots hook:
   - Run: `cd /workspaces/wyatt-personal-aws && pre-commit run jest-update-snapshots --hook-stage manual`

2. Run the regular pre-commit checks:
   - Run all regular pre-commit hooks: `pre-commit run --all-files`
   - Then run pre-push hooks specifically: `pre-commit run --hook-stage push --all-files`
   - Finally, save full output for analysis: `cd /workspaces/wyatt-personal-aws && pre-commit run --all-files --hook-stage push > /workspaces/wyatt-personal-aws/precommit.log 2>&1`

3. Read the log file output:
   - Use the Read tool to check the content of `/workspaces/wyatt-personal-aws/precommit.log`

4. Analyze the results:
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

5. If there are updated snapshots:
   - Add a section in your analysis explaining which snapshots were updated and why
   - Include this in your commit message: "Update Jest snapshots to reflect recent UI changes"

6. Summarize the action taken (created task or committed changes, updated snapshots)
