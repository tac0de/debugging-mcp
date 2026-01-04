# Debugging MCP Server

A strict debugging protocol MCP server for AI coding agents.
Language-agnostic, with a web-service-focused checklist.

This MCP is designed to prevent agents from escaping into refactoring,
redesign, or speculative fixes while debugging.

---

## What This MCP Is

- A debugging-only protocol
- A set of hard behavioral constraints for AI coding agents
- A method to reduce token waste caused by trial-and-error loops
- An MCP server that exposes these rules and validation helpers

The MCP server provides tools that return the documents, enforce the bug
report format, and supply a web-service-focused debugging checklist.

---

## What This MCP Is NOT

- Not a refactoring guide
- Not a performance optimization tool
- Not a feature development workflow
- Not an architecture discussion framework

If your task involves any of the above,
do not use this MCP.

---

## When to Use Debugging MCP

Activate this MCP ONLY when all conditions below are true:

- A bug or unintended behavior already exists
- Expected behavior is clearly defined
- The goal is correctness, not improvement
- No redesign or feature addition is requested

Typical use cases:

- Runtime errors
- Incorrect outputs
- Crashes
- Edge-case failures

---

## Core Principles

1. Reproduction First  
   No fix without confirmed reproduction

2. Single Hypothesis  
   One cause at a time, no branching theories

3. Minimal Fix  
   Smallest possible code change, no cosmetic edits

4. Explicit Verification  
   The fix must be verifiable

---

## Forbidden Actions

While this MCP is active, the agent MUST NOT:

- Refactor unrelated code
- Improve readability
- Rename variables or functions
- Introduce abstractions
- Change project structure
- Add new features

Correctness is prioritized over elegance.

---

## Required Output Format

All debugging responses MUST follow the structure defined in:

    examples/bug-report.md

Responses that do not comply with this format are invalid.

---

## How to Use (Agent Setup)

### 1. Load the MCP Rules

Provide the agent with the contents of:

- rules/scope.md
- rules/behavior.md
- rules/forbidden.md
- output/contract.md

These should be placed in the system prompt or instruction context.

### 2. Require a Bug Report

Before attempting any fix:

- The bug report template MUST be completed
- Missing sections mean debugging must stop

### 3. Enforce Compliance

If the agent:

- Suggests refactoring
- Adds features
- Makes speculative claims

Stop immediately and restate the MCP constraints.

---

## MCP Server Usage

### Install

    npm install -g @tac0de/debugging-mcp

### Run (stdio)

    debugging-mcp

### Example MCP Client Config

    {
      "command": "npx",
      "args": ["-y", "@tac0de/debugging-mcp"]
    }

### Tools

- `debugging_mcp_list_documents`
- `debugging_mcp_get_document`
- `debugging_mcp_get_bundle`
- `debugging_mcp_validate_bug_report`
- `debugging_mcp_web_debugging_checklist`

### Documents

- `scope`
- `behavior`
- `forbidden`
- `contract`
- `bug_report_template`

---

## Design Philosophy

This MCP is intentionally restrictive.

Most AI-assisted debugging failures come from:

- Overthinking
- Premature refactoring
- Unbounded speculation

This MCP removes those failure paths.

If it feels uncomfortable, it is working as intended.

---

## License

MIT
