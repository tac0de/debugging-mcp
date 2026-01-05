export type RequiredSection = {
  id: string;
  label: string;
  pattern: RegExp;
};

export type BugReportValidationResult = {
  valid: boolean;
  missing: string[];
};

export const REQUIRED_SECTIONS: RequiredSection[] = [
  {
    id: "reproduction",
    label: "## Reproduction",
    pattern: /^##\s+Reproduction\b/im,
  },
  { id: "steps", label: "### Steps", pattern: /^###?\s+Steps\b/im },
  {
    id: "observed",
    label: "### Observed Behavior",
    pattern: /^###?\s+Observed Behavior\b/im,
  },
  {
    id: "expected",
    label: "### Expected Behavior",
    pattern: /^###?\s+Expected Behavior\b/im,
  },
  { id: "hypothesis", label: "## Hypothesis", pattern: /^##\s+Hypothesis\b/im },
  {
    id: "single_cause",
    label: "### Single Most Likely Cause",
    pattern: /^###?\s+Single Most Likely Cause\b/im,
  },
  { id: "evidence", label: "Evidence", pattern: /^Evidence\b/im },
  { id: "fix", label: "## Fix", pattern: /^##\s+Fix\b/im },
  {
    id: "files_changed",
    label: "### Files Changed",
    pattern: /^###?\s+Files Changed\b/im,
  },
  {
    id: "lines_modified",
    label: "### Lines Modified",
    pattern: /^###?\s+Lines Modified\b/im,
  },
  { id: "patch", label: "### Patch", pattern: /^###?\s+Patch\b/im },
  {
    id: "verification",
    label: "## Verification",
    pattern: /^##\s+Verification\b/im,
  },
  {
    id: "confirm_fix",
    label: "### How to Confirm the Fix",
    pattern: /^###?\s+How to Confirm the Fix\b/im,
  },
  { id: "result", label: "### Result", pattern: /^###?\s+Result\b/im },
  {
    id: "compliance",
    label: "## MCP Compliance Checklist",
    pattern: /^##\s+MCP Compliance Checklist\b/im,
  },
];

export function validateBugReport(report: string): BugReportValidationResult {
  const missing = REQUIRED_SECTIONS.filter(
    (section) => !section.pattern.test(report)
  ).map((section) => section.label);

  return {
    valid: missing.length === 0,
    missing,
  };
}
