# Bug Report (Debugging MCP v1)

This document MUST be completed before any debugging work begins.
If any required section is missing, debugging must NOT proceed.

---

## Reproduction

### Steps

1.
2.
3.

### Observed Behavior

- What actually happens:
- Error messages or logs (if any):

### Expected Behavior

- What should happen instead:

---

## Hypothesis

### Single Most Likely Cause

- Describe ONE concrete cause only.
- Must directly explain the observed behavior.
- Do NOT list multiple possibilities.

Evidence:

- Logs:
- Code reference:
- Runtime condition:

---

## Fix

### Files Changed

- path/to/file.ext

### Lines Modified

- e.g. 42–47

### Patch

    // Minimal change only
    // No refactoring
    // No renaming
    // No structural changes

---

## Verification

### How to Confirm the Fix

1.
2.

### Result

- [ ] Bug no longer reproduces
- [ ] No unrelated behavior changed

---

## MCP Compliance Checklist

- [ ] Bug existed before the fix
- [ ] No new feature added
- [ ] No refactoring performed
- [ ] Only one hypothesis used
- [ ] Fix explicitly verified
