import assert from "node:assert/strict";
import test from "node:test";

import { validateBugReport } from "../dist/bug-report.js";

test("validateBugReport flags missing sections", () => {
  const partialReport = `
## Reproduction
### Steps
### Observed Behavior
### Expected Behavior
`;

  const result = validateBugReport(partialReport);
  assert.strictEqual(result.valid, false);
  assert.ok(result.missing.includes("## Hypothesis"));
  assert.ok(result.missing.includes("### Patch"));
  assert.ok(result.missing.includes("## Verification"));
});

test("validateBugReport accepts a fully populated template", () => {
  const fullReport = `
## Reproduction
### Steps
### Observed Behavior
### Expected Behavior
## Hypothesis
### Single Most Likely Cause
Evidence
## Fix
### Files Changed
### Lines Modified
### Patch
## Verification
### How to Confirm the Fix
### Result
## MCP Compliance Checklist
`;

  const result = validateBugReport(fullReport);
  assert.strictEqual(result.valid, true);
  assert.deepStrictEqual(result.missing, []);
});
