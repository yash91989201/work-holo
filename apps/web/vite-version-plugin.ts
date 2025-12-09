import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import type { Plugin } from "vite";

function getGitCommitHash(): string {
  try {
    // Try to get git commit hash
    const hash = execSync("git rev-parse --short HEAD", {
      encoding: "utf-8",
    }).trim();
    return hash;
  } catch {
    // Fallback to timestamp-based hash if not in git repo
    const timestamp = Date.now();
    return createHash("sha256")
      .update(timestamp.toString())
      .digest("hex")
      .substring(0, 7);
  }
}

export function viteVersionPlugin(): Plugin {
  return {
    name: "vite-plugin-version",
    generateBundle() {
      const timestamp = Date.now();
      const hash = getGitCommitHash();

      const version = {
        hash,
        timestamp,
        date: new Date(timestamp).toISOString(),
      };

      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify(version, null, 2),
      });
    },
  };
}
