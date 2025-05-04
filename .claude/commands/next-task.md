You will help me get the next task from TaskMaster, create a new branch for it, and check it out.

First, do the following:
1. If "$ARGUMENTS" is non-empty, use it as the branch name and skip to step 5.
2. If "$ARGUMENTS" is empty, run `mcp__taskmaster-ai__next_task` to get the next task from TaskMaster.
3. Extract the task ID and title from the response.
4. Create a branch name based on the task ID and title, following the format: `task/ID-title-kebab-case` (convert spaces to hyphens, lowercase, remove special characters).
5. Use `git checkout -b [branch-name]` to create and check out the new branch.
6. Summarize what you did and what the next task is (if from TaskMaster).

Always show the full task details when getting a task from TaskMaster.
