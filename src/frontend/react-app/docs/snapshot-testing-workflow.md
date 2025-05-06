# Snapshot Testing Workflow

This document outlines the workflow for handling Jest snapshot tests in this project.

## Understanding Snapshots

Jest snapshots are serialized representations of React components used to detect unintentional UI changes. When a component's rendering changes, the snapshot test will fail, prompting developers to either:

1. Fix the component to match the existing snapshot
2. Update the snapshot to match the new component behavior

## Workflow for Developers

### Running Tests WITHOUT Updating Snapshots

During normal development and git operations, tests run without automatically updating snapshots:

```bash
# Run all tests without updating snapshots (also happens during pre-push)
npm test

# Run targeted tests without updating snapshots
npm test -- MyComponent
```

### Intentionally Updating Snapshots

When you've made intentional UI changes that should be reflected in snapshots:

```bash
# Update all snapshots
npm run test:update-snapshots

# Update snapshots for a specific component
npm run test:update-snapshots -- MyComponent

# Update snapshots via pre-commit hook
pre-commit run jest-update-snapshots --hook-stage manual
```

After updating snapshots, commit the changes separately:

```bash
git add '**/*.snap'
git commit -m "Update snapshots for [feature/component]"
```

## Handling CI and Pre-commit Hooks

The project is configured to:

1. Run tests without updating snapshots during CI and pre-push hooks
2. Require explicit snapshot updates via the dedicated commands above
3. Exclude snapshot files from trailing whitespace checks

## Best Practices

1. **Review snapshot changes carefully** - Make sure they represent intentional UI changes
2. **Commit snapshot updates separately** - This makes code reviews easier
3. **Use component-specific updates** - Update only the snapshots related to your changes
4. **Consider snapshot alternatives** - For complex components, use more targeted assertions instead of relying solely on snapshots

## Troubleshooting

If you encounter snapshot-related issues:

1. **"Cannot find module '...' from 'XXX.snap.test.tsx'"** - Run `npm run test:update-snapshots`
2. **Failing tests due to whitespace** - Make sure you're using consistent editors/formatters
3. **Snapshot bloat** - Consider refactoring to make your snapshots more focused
