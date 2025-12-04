import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";

// Resolve paths relative to the project root (two levels up from this script)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Adjust "..", ".." if your script lives elsewhere
const projectRoot = path.resolve(__dirname, "..", "..");

const schemasDir = path.join(projectRoot, "src", "lib", "schemas");
const outputFile = path.join(projectRoot, "src", "lib", "types.ts");

// Regex patterns
const TS_EXTENSION_REGEX = /\.ts$/;
const SCHEMA_EXPORT_REGEX =
  /export\s+(?:const|var|let)\s+(\w+(?:Schema|Input|Output))\s*=/g;
const SCHEMA_SUFFIX_REGEX = /Schema$/;
const INPUT_SUFFIX_REGEX = /Input$/;
const OUTPUT_SUFFIX_REGEX = /Output$/;
const NON_DB_SCHEMA_PATTERNS = /(Create|Update|Delete|Form|Insert|Select)$/;

// Ensure output directory exists (but don't create schemasDir silently)
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

function extractSchemaNames(content: string): string[] {
  // Match exported variables ending with Schema, Input, or Output
  return Array.from(content.matchAll(SCHEMA_EXPORT_REGEX)).map(
    (match) => match[1]
  );
}

function getTypeName(schemaName: string): string {
  if (SCHEMA_SUFFIX_REGEX.test(schemaName)) {
    const withoutSchema = schemaName.slice(0, -6);
    if (!NON_DB_SCHEMA_PATTERNS.test(withoutSchema)) {
      return `${withoutSchema}Type`;
    }
    return `${withoutSchema}Type`;
  }

  if (
    INPUT_SUFFIX_REGEX.test(schemaName) ||
    OUTPUT_SUFFIX_REGEX.test(schemaName)
  ) {
    return `${schemaName}Type`;
  }

  return `${schemaName}Type`;
}

function generateTypes() {
  console.log("🔄 Generating types...");
  console.log("📁 Schemas dir:", schemasDir);
  console.log("📄 Output file:", outputFile);

  if (!fs.existsSync(schemasDir)) {
    console.warn(
      `! Schemas directory ${schemasDir} does not exist. No types generated.`
    );
    return;
  }

  const files = getAllSchemaFiles(schemasDir);
  const imports = new Set<string>();
  const types = new Set<string>();

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      const schemaNames = extractSchemaNames(content);

      if (schemaNames.length === 0) continue;

      // Get path relative to schemas directory
      const relPath = path
        .relative(schemasDir, file)
        .replace(/\\/g, "/")
        .replace(TS_EXTENSION_REGEX, "");

      const importPath = `@/lib/schemas/${relPath}`;

      for (const schemaName of schemaNames) {
        const typeName = getTypeName(schemaName);
        imports.add(`import type { ${schemaName} } from "${importPath}";`);
        types.add(`export type ${typeName} = z.infer<typeof ${schemaName}>;`);
      }
    } catch (error) {
      console.warn(`Could not process file ${file}:`, error);
    }
  }

  const output = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run \`bun run generate:types\` to refresh
import type { z } from "zod";

${Array.from(imports).sort().join("\n")}

${Array.from(types).sort().join("\n")}
`;

  const currentContent = fs.existsSync(outputFile)
    ? fs.readFileSync(outputFile, "utf-8")
    : "";

  if (currentContent !== output) {
    fs.writeFileSync(outputFile, output);
    console.log(`✅ Types written to ${outputFile}`);
  } else {
    console.log("✅ No changes detected");
  }
}

// Initial generation
generateTypes();

// Watch mode
if (process.argv.includes("--watch") || process.argv.includes("-w")) {
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
    console.log(`Detected change in: ${path.relative(projectRoot, filePath)}`);
    generateTypes();
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
