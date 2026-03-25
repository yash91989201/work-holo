import fs from "node:fs";
import path from "node:path";
import chokidar from "chokidar";

// Regex patterns
const TS_EXTENSION_REGEX = /\.ts$/;
const SCHEMA_EXPORT_REGEX =
  /export\s+(?:const|var|let)\s+(\w+(?:Schema|Input|Output))\s*=/g;
const SIMPLE_SCHEMA_REGEX = /Schema$/;
const BACKSLASH_REGEX = /\\/g;

type SchemaEntry = {
  schemaName: string;
  importPath: string;
  sourceFile: string;
  line: number;
};

type DuplicateSchemaLocation = {
  sourceFile: string;
  line: number;
};

type DuplicateSchemaConflict = {
  schemaName: string;
  locations: DuplicateSchemaLocation[];
};

class TypeGeneratorError extends Error {
  readonly code:
    | "SCHEMAS_DIR_NOT_FOUND"
    | "SCHEMA_FILE_READ_FAILED"
    | "DUPLICATE_SCHEMA_NAMES";

  constructor(
    code:
      | "SCHEMAS_DIR_NOT_FOUND"
      | "SCHEMA_FILE_READ_FAILED"
      | "DUPLICATE_SCHEMA_NAMES",
    message: string
  ) {
    super(message);
    this.code = code;
    this.name = "TypeGeneratorError";
  }
}

class SchemasDirectoryNotFoundError extends TypeGeneratorError {
  readonly directory: string;

  constructor(directory: string) {
    super(
      "SCHEMAS_DIR_NOT_FOUND",
      `Schemas directory does not exist: ${directory}`
    );
    this.directory = directory;
    this.name = "SchemasDirectoryNotFoundError";
  }
}

class SchemaFileReadError extends TypeGeneratorError {
  readonly sourceFile: string;
  readonly causeMessage: string;

  constructor(sourceFile: string, causeMessage: string) {
    super(
      "SCHEMA_FILE_READ_FAILED",
      `Could not read schema file: ${sourceFile}`
    );
    this.sourceFile = sourceFile;
    this.causeMessage = causeMessage;
    this.name = "SchemaFileReadError";
  }
}

class DuplicateSchemaNamesError extends TypeGeneratorError {
  readonly conflicts: DuplicateSchemaConflict[];

  constructor(conflicts: DuplicateSchemaConflict[]) {
    super(
      "DUPLICATE_SCHEMA_NAMES",
      "Duplicate Zod schema export names detected"
    );
    this.conflicts = conflicts;
    this.name = "DuplicateSchemaNamesError";
  }
}

// Paths relative to the package root (scripts folder is at packages/api/scripts/)
const schemasDir = path.resolve("src/lib/schemas");
const outputFile = path.resolve("src/lib/types.ts");

if (!fs.existsSync(path.dirname(outputFile))) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

function getAllSchemaFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllSchemaFiles(fullPath);
    return entry.isFile() && TS_EXTENSION_REGEX.test(entry.name)
      ? [fullPath]
      : [];
  });
}

function getLineNumberAt(content: string, index: number): number {
  let line = 1;

  for (let i = 0; i < index; i += 1) {
    if (content.charCodeAt(i) === 10) {
      line += 1;
    }
  }

  return line;
}

function extractSchemaEntries(
  content: string
): Array<{ schemaName: string; line: number }> {
  return Array.from(content.matchAll(SCHEMA_EXPORT_REGEX))
    .map((match) => {
      const schemaName = match[1];
      if (!schemaName) {
        return null;
      }

      return {
        schemaName,
        line: getLineNumberAt(content, match.index ?? 0),
      };
    })
    .filter(
      (entry): entry is { schemaName: string; line: number } => entry !== null
    );
}

function getTypeName(schemaName: string): string {
  if (SIMPLE_SCHEMA_REGEX.test(schemaName)) {
    return `${schemaName.slice(0, -6)}Type`;
  }
  return `${schemaName}Type`;
}

function collectSchemaEntries(files: string[]): SchemaEntry[] {
  const schemaEntries: SchemaEntry[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      const extractedEntries = extractSchemaEntries(content);

      if (extractedEntries.length === 0) continue;

      const relPath = path
        .relative(schemasDir, file)
        .replace(BACKSLASH_REGEX, "/")
        .replace(TS_EXTENSION_REGEX, "");
      const sourceFile = path
        .relative(process.cwd(), file)
        .replace(BACKSLASH_REGEX, "/");

      const importPath = `./schemas/${relPath}`;

      for (const extractedEntry of extractedEntries) {
        schemaEntries.push({
          schemaName: extractedEntry.schemaName,
          importPath,
          sourceFile,
          line: extractedEntry.line,
        });
      }
    } catch (error) {
      const sourceFile = path
        .relative(process.cwd(), file)
        .replace(BACKSLASH_REGEX, "/");
      const causeMessage =
        error instanceof Error ? error.message : "Unknown read error";
      throw new SchemaFileReadError(sourceFile, causeMessage);
    }
  }

  return schemaEntries;
}

function assertNoDuplicateSchemaNames(schemaEntries: SchemaEntry[]) {
  const schemaToLocations = new Map<string, DuplicateSchemaLocation[]>();

  for (const entry of schemaEntries) {
    if (!schemaToLocations.has(entry.schemaName)) {
      schemaToLocations.set(entry.schemaName, []);
    }

    const locations = schemaToLocations.get(entry.schemaName);
    locations?.push({
      sourceFile: entry.sourceFile,
      line: entry.line,
    });
  }

  const duplicates = Array.from(schemaToLocations.entries())
    .map(([schemaName, locations]) => {
      const deduped = new Map<string, DuplicateSchemaLocation>();
      for (const location of locations) {
        deduped.set(`${location.sourceFile}:${location.line}`, location);
      }

      return {
        schemaName,
        locations: Array.from(deduped.values()).sort((left, right) => {
          const byFile = left.sourceFile.localeCompare(right.sourceFile);
          if (byFile !== 0) return byFile;
          return left.line - right.line;
        }),
      };
    })
    .filter((conflict) => conflict.locations.length > 1)
    .sort((left, right) => left.schemaName.localeCompare(right.schemaName));

  if (duplicates.length === 0) {
    return;
  }

  throw new DuplicateSchemaNamesError(duplicates);
}

function buildTypeDeclarations(schemaEntries: SchemaEntry[]) {
  const imports: string[] = [];
  const inferredTypes: string[] = [];

  for (const entry of schemaEntries) {
    const { schemaName, importPath } = entry;
    imports.push(`import type { ${schemaName} } from "${importPath}";`);
    inferredTypes.push(
      `export type ${getTypeName(schemaName)} = z.infer<typeof ${schemaName}>;`
    );
  }

  return { imports, inferredTypes };
}

function generateTypes() {
  console.log("🔄 Generating types...");

  if (!fs.existsSync(schemasDir)) {
    throw new SchemasDirectoryNotFoundError(schemasDir);
  }

  const files = getAllSchemaFiles(schemasDir);
  const schemaEntries = collectSchemaEntries(files);

  schemaEntries.sort((a, b) => {
    const bySchemaName = a.schemaName.localeCompare(b.schemaName);
    if (bySchemaName !== 0) return bySchemaName;
    return a.importPath.localeCompare(b.importPath);
  });

  assertNoDuplicateSchemaNames(schemaEntries);
  const { imports, inferredTypes } = buildTypeDeclarations(schemaEntries);

  const output = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run \`bun run generate:types\` to refresh
import type { z } from "zod";

${imports.sort().join("\n")}

${inferredTypes.sort().join("\n")}
`;

  const currentContent = fs.existsSync(outputFile)
    ? fs.readFileSync(outputFile, "utf-8")
    : "";

  if (currentContent === output) {
    console.log("✅ No changes detected");
  } else {
    fs.writeFileSync(outputFile, output);
    console.log(`✅ Types written to ${outputFile}`);
  }
}

function formatDuplicateSchemaNamesError(
  error: DuplicateSchemaNamesError
): string {
  const conflicts = error.conflicts
    .map((conflict) => {
      const locations = conflict.locations
        .map((location) => `    - ${location.sourceFile}:${location.line}`)
        .join("\n");
      return `  - ${conflict.schemaName}\n${locations}`;
    })
    .join("\n");

  return [
    "",
    "Type generation failed.",
    "",
    "Reason:",
    "  Duplicate Zod schema export names were found.",
    "",
    "Conflicts:",
    conflicts,
    "",
    "How to fix:",
    "  Rename duplicate schema exports so names ending with Schema/Input/Output are globally unique.",
    "",
  ].join("\n");
}

function formatGeneratorError(error: TypeGeneratorError): string {
  if (error instanceof DuplicateSchemaNamesError) {
    return formatDuplicateSchemaNamesError(error);
  }

  if (error instanceof SchemasDirectoryNotFoundError) {
    return [
      "",
      "Type generation failed.",
      "",
      "Reason:",
      "  Schemas directory was not found.",
      "",
      "Details:",
      `  ${error.directory}`,
      "",
      "How to fix:",
      "  Ensure src/lib/schemas exists before running generate:types.",
      "",
    ].join("\n");
  }

  if (error instanceof SchemaFileReadError) {
    return [
      "",
      "Type generation failed.",
      "",
      "Reason:",
      "  A schema file could not be read.",
      "",
      "Details:",
      `  File: ${error.sourceFile}`,
      `  Cause: ${error.causeMessage}`,
      "",
      "How to fix:",
      "  Verify the file exists and is readable, then rerun generate:types.",
      "",
    ].join("\n");
  }

  return [
    "",
    "Type generation failed.",
    "",
    `Reason: ${error.message}`,
    "",
  ].join("\n");
}

function reportGeneratorError(error: unknown) {
  if (error instanceof TypeGeneratorError) {
    console.error(formatGeneratorError(error));
    return;
  }

  if (error instanceof Error) {
    console.error(
      ["", "Type generation failed.", "", `Reason: ${error.message}`, ""].join(
        "\n"
      )
    );
    return;
  }

  console.error("\nType generation failed.\n\nReason: Unknown error\n");
}

function runGenerateTypes(exitOnError: boolean) {
  try {
    generateTypes();
  } catch (error) {
    reportGeneratorError(error);

    if (exitOnError) {
      process.exit(1);
    }
  }
}

const isWatchMode =
  process.argv.includes("--watch") || process.argv.includes("-w");

runGenerateTypes(!isWatchMode);

if (isWatchMode) {
  const watcher = chokidar.watch(schemasDir, {
    ignored: /(^|[/\\])node_modules[/\\]/,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100,
    },
  });

  const handleChange = (filePath: string) => {
    console.log(
      `Detected change in: ${path.relative(process.cwd(), filePath)}`
    );
    runGenerateTypes(false);
  };

  watcher
    .on("add", handleChange)
    .on("change", handleChange)
    .on("unlink", handleChange)
    .on("error", (error) => console.error("Watcher error:", error));

  const shutdown = () => {
    watcher.close().then(() => {
      console.log("✅ Watcher closed successfully");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log("👀 Watching for changes...");
}
