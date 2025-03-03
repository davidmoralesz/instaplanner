module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Styles
        "refactor", // Code refactoring
        "test", // Tests
        "chore", // Chores
        "perf", // Performance improvements
        "revert", // Reverts
        "ci", // CI/CD
      ],
    ],
    "subject-case": [0],
  },
}
