#!/usr/bin/env node
/**
 * Clears Next.js/webpack caches then starts the dev server.
 * Use when `next dev` hangs on "Starting..." (usually a locked/corrupt .next folder).
 */
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function rm(dir) {
  const full = path.join(root, dir);
  try {
    fs.rmSync(full, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  } catch {
    // ignore
  }
}

console.log("Clearing caches...");
rm(".next");
rm("node_modules/.cache");

console.log("Starting dev server...\n");

const child = spawn("npx", ["next", "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});

child.on("exit", (code) => process.exit(code ?? 0));
