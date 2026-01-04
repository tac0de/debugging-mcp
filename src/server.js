#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const DOCUMENTS = {
  scope: {
    title: "Scope",
    primaryPath: "rules/scope.md",
    fallbackPath: "rules/scrope.md",
  },
  behavior: {
    title: "Behavior",
    primaryPath: "rules/behavior.md",
  },
  forbidden: {
    title: "Forbidden Actions",
    primaryPath: "rules/forbidden.md",
  },
  contract: {
    title: "Output Contract",
    primaryPath: "output/contract.md",
  },
  bug_report_template: {
    title: "Bug Report Template",
    primaryPath: "examples/bug-report.md",
  },
};

const WEB_DEBUGGING_CHECKLIST = [
  "Capture the full request/response pair (method, URL, headers, body, status).",
  "Confirm auth/session state and any required cookies or tokens.",
  "Verify environment config (base URLs, secrets, feature flags, CORS, proxy).",
  "Check server logs around the request timestamp for errors and stack traces.",
  "Validate upstream dependencies (DB, cache, external APIs) and timeouts.",
  "Compare behavior across environments (local, staging, production).",
  "Inspect caching/CDN layers for stale or inconsistent responses.",
  "Confirm deployment version and recent config changes.",
  "Reproduce with minimal inputs and isolate the failing parameter.",
  "Collect metrics/traces if available to pinpoint latency or error spikes.",
].join("\n");

const REQUIRED_SECTIONS = [
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

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveDocumentPath(doc) {
  const primary = path.join(repoRoot, doc.primaryPath);
  if (await fileExists(primary)) {
    return primary;
  }
  if (doc.fallbackPath) {
    const fallback = path.join(repoRoot, doc.fallbackPath);
    if (await fileExists(fallback)) {
      return fallback;
    }
  }
  throw new Error(`Document not found: ${doc.primaryPath}`);
}

async function loadDocument(docKey) {
  const doc = DOCUMENTS[docKey];
  if (!doc) {
    throw new Error(`Unknown document: ${docKey}`);
  }
  const resolvedPath = await resolveDocumentPath(doc);
  return fs.readFile(resolvedPath, "utf8");
}

function validateBugReport(report) {
  const missing = REQUIRED_SECTIONS.filter(
    (section) => !section.pattern.test(report)
  ).map((section) => section.label);
  return {
    valid: missing.length === 0,
    missing,
  };
}

const server = new McpServer({
  name: "debugging-mcp",
  version: "0.2.0",
});

server.registerTool(
  "debugging_mcp_list_documents",
  {
    title: "Debugging MCP Documents",
    description: "List the available Debugging MCP documents.",
    inputSchema: {},
    outputSchema: {
      documents: z.array(
        z.object({
          key: z.string(),
          title: z.string(),
        })
      ),
    },
  },
  async () => {
    const documents = Object.entries(DOCUMENTS).map(([key, doc]) => ({
      key,
      title: doc.title,
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(documents, null, 2),
        },
      ],
      structuredContent: {
        documents,
      },
    };
  }
);

server.registerTool(
  "debugging_mcp_get_document",
  {
    title: "Debugging MCP Document",
    description: "Fetch a single Debugging MCP document by key.",
    inputSchema: {
      document: z.enum(Object.keys(DOCUMENTS)),
    },
    outputSchema: {
      document: z.string(),
    },
  },
  async ({ document }) => {
    const text = await loadDocument(document);
    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
      structuredContent: {
        document: text,
      },
    };
  }
);

server.registerTool(
  "debugging_mcp_get_bundle",
  {
    title: "Debugging MCP Bundle",
    description:
      "Return the combined Debugging MCP rules, output contract, and bug report template.",
    inputSchema: {},
    outputSchema: {
      bundle: z.string(),
    },
  },
  async () => {
    const entries = await Promise.all(
      Object.keys(DOCUMENTS).map(async (key) => {
        const doc = DOCUMENTS[key];
        const text = await loadDocument(key);
        return `# ${doc.title}\n\n${text}`;
      })
    );
    const bundle = entries.join("\n\n---\n\n");
    return {
      content: [
        {
          type: "text",
          text: bundle,
        },
      ],
      structuredContent: {
        bundle,
      },
    };
  }
);

server.registerTool(
  "debugging_mcp_validate_bug_report",
  {
    title: "Validate Debugging MCP Bug Report",
    description: "Validate a bug report against the Debugging MCP template.",
    inputSchema: {
      report: z.string().min(1, "Bug report content is required."),
    },
    outputSchema: {
      valid: z.boolean(),
      missing: z.array(z.string()),
    },
  },
  async ({ report }) => {
    const { valid, missing } = validateBugReport(report);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              valid,
              missing,
            },
            null,
            2
          ),
        },
      ],
      structuredContent: {
        valid,
        missing,
      },
    };
  }
);

server.registerTool(
  "debugging_mcp_web_debugging_checklist",
  {
    title: "Web Debugging Checklist",
    description: "Provide a web-service-focused debugging checklist.",
    inputSchema: {},
    outputSchema: {
      checklist: z.string(),
    },
  },
  async () => ({
    content: [
      {
        type: "text",
        text: WEB_DEBUGGING_CHECKLIST,
      },
    ],
    structuredContent: {
      checklist: WEB_DEBUGGING_CHECKLIST,
    },
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
