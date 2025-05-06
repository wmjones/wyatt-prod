module.exports = {
  extends: [
    "react-app",
    "react-app/jest"
  ],
  plugins: [
    "testing-library",
    "jest-dom"
  ],
  rules: {
    // Testing Library rules to enforce best practices
    "testing-library/await-async-queries": "off",
    "testing-library/no-await-sync-queries": "off",
    "testing-library/no-container": "error",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-dom-import": ["error", "react"],
    "testing-library/no-node-access": "warn",
    "testing-library/no-promise-in-fire-event": "error",
    "testing-library/no-render-in-setup": "error",
    "testing-library/no-unnecessary-act": "error",
    "testing-library/no-wait-for-empty-callback": "error",
    "testing-library/no-wait-for-multiple-assertions": "error",
    "testing-library/prefer-find-by": "error",
    "testing-library/prefer-presence-queries": "error",
    "testing-library/prefer-screen-queries": "error",
    "testing-library/prefer-user-event": "error",

    // Custom rules for environment safety
    "no-restricted-syntax": [
      "error",
      {
        "selector": "AssignmentExpression[left.object.name='process'][left.property.name='env']",
        "message": "Direct assignment to process.env is not allowed. Use environment utility functions instead."
      }
    ],

    // Jest DOM rules
    "jest-dom/prefer-checked": "error",
    "jest-dom/prefer-enabled-disabled": "error",
    "jest-dom/prefer-focus": "error",
    "jest-dom/prefer-in-document": "error",
    "jest-dom/prefer-required": "error",
    "jest-dom/prefer-to-have-attribute": "error",
    "jest-dom/prefer-to-have-class": "error",
    "jest-dom/prefer-to-have-style": "error",
    "jest-dom/prefer-to-have-text-content": "error",
    "jest-dom/prefer-to-have-value": "error"
  },
  overrides: [
    {
      // For test files, we're more lenient on some rules
      files: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/test-utils/**/*.[jt]s?(x)"
      ],
      rules: {
        // Allow debugging utils in test files
        "testing-library/no-debugging-utils": "off",
        // Less strict in test files
        "testing-library/no-node-access": "off",
        // These are fine in test files
        "testing-library/no-container": "off",
        "testing-library/no-wait-for-multiple-assertions": "off",
        "testing-library/prefer-user-event": "warn",
        "jest/no-conditional-expect": "off",
        "import/first": "warn"
      }
    }
  ]
};
