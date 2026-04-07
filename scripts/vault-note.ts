/**
 * vault-note — Controlled interface for adding notes to the docs vault.
 *
 * Usage:
 *   deno task vault-note add <type> <title> [--area=X] [--body=text]
 *   deno task vault-note promote <file> <target-dir>
 *   deno task vault-note list <type> [--area=X] [--status=X]
 */

const VAULT_ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const NOTE_TYPES = [
  "decision",
  "convention",
  "debt",
  "question",
  "observation",
  "session",
] as const;
type NoteType = (typeof NOTE_TYPES)[number];

/** Where each note type lives by default. */
const TYPE_DIRS: Record<NoteType, string> = {
  decision: "decisions",
  convention: "conventions",
  debt: "debt",
  question: "questions",
  observation: "observations",
  session: "sessions",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function git(...args: string[]): Promise<string> {
  const cmd = new Deno.Command("git", {
    args,
    cwd: VAULT_ROOT,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await cmd.output();
  if (code !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${new TextDecoder().decode(stderr)}`);
  }
  return new TextDecoder().decode(stdout).trim();
}

function readTemplate(type: NoteType): string {
  try {
    return Deno.readTextFileSync(`${VAULT_ROOT}/templates/${type}.md`);
  } catch {
    // Fallback if template doesn't exist
    return `---\ndate: {{date}}\ntype: ${type}\narea:\nstatus: inbox\n---\n\n`;
  }
}

function parseArgs(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (const arg of args) {
    const m = arg.match(/^--(\w[\w-]*)=(.*)$/);
    if (m) flags[m[1]] = m[2];
  }
  return flags;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdAdd(args: string[]): Promise<void> {
  const typeStr = args[0];
  if (!typeStr || !NOTE_TYPES.includes(typeStr as NoteType)) {
    console.error(`Usage: vault-note add <${NOTE_TYPES.join("|")}> <title> [--area=X] [--body=text]`);
    Deno.exit(1);
  }
  const type = typeStr as NoteType;

  const titleParts: string[] = [];
  const flagArgs: string[] = [];
  for (const a of args.slice(1)) {
    if (a.startsWith("--")) flagArgs.push(a);
    else titleParts.push(a);
  }
  const title = titleParts.join(" ");
  if (!title) {
    console.error("Error: title is required");
    Deno.exit(1);
  }

  const flags = parseArgs(flagArgs);
  const date = today();
  const slug = slugify(title);
  const filename = `${date}-${slug}.md`;
  const dir = TYPE_DIRS[type];
  const filepath = `${VAULT_ROOT}/${dir}/${filename}`;

  // Build note from template
  let content = readTemplate(type);
  content = content.replace(/\{\{date\}\}/g, date);
  if (flags.area) {
    content = content.replace(/^area:$/m, `area: ${flags.area}`);
  }

  // If body provided, append it after the frontmatter
  if (flags.body) {
    // Replace the first section's placeholder text with the body
    const parts = content.split("---");
    if (parts.length >= 3) {
      content = `${parts[0]}---${parts[1]}---\n\n${flags.body}\n`;
    }
  }

  await Deno.writeTextFile(filepath, content);
  await git("add", `${dir}/${filename}`);
  await git("commit", "-m", `add ${type}: ${title}`);

  console.log(`Created ${dir}/${filename}`);
}

async function cmdPromote(args: string[]): Promise<void> {
  const file = args[0];
  const targetDir = args[1];
  if (!file || !targetDir) {
    console.error("Usage: vault-note promote <file> <target-dir>");
    Deno.exit(1);
  }

  const sourcePath = `${VAULT_ROOT}/${file}`;
  const basename = file.split("/").pop()!;
  const destPath = `${VAULT_ROOT}/${targetDir}/${basename}`;

  // Read, update status, write to new location
  let content = await Deno.readTextFile(sourcePath);
  content = content.replace(/^status: inbox$/m, "status: active");

  await Deno.writeTextFile(destPath, content);
  await Deno.remove(sourcePath);

  await git("add", file, `${targetDir}/${basename}`);
  await git("commit", "-m", `promote: ${basename} → ${targetDir}`);

  console.log(`Promoted ${file} → ${targetDir}/${basename}`);
}

async function cmdList(args: string[]): Promise<void> {
  const typeStr = args[0];
  if (!typeStr || !NOTE_TYPES.includes(typeStr as NoteType)) {
    console.error(`Usage: vault-note list <${NOTE_TYPES.join("|")}> [--area=X] [--status=X]`);
    Deno.exit(1);
  }
  const type = typeStr as NoteType;
  const flags = parseArgs(args.slice(1));
  const dir = `${VAULT_ROOT}/${TYPE_DIRS[type]}`;

  let files: string[];
  try {
    files = [];
    for await (const entry of Deno.readDir(dir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        files.push(entry.name);
      }
    }
  } catch {
    console.log(`No ${type} notes found.`);
    return;
  }

  files.sort().reverse(); // newest first

  for (const file of files) {
    const content = await Deno.readTextFile(`${dir}/${file}`);
    // Parse frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;

    const fm = fmMatch[1];
    const area = fm.match(/^area:\s*(.*)$/m)?.[1]?.trim() || "";
    const status = fm.match(/^status:\s*(.*)$/m)?.[1]?.trim() || "";
    const date = fm.match(/^date:\s*(.*)$/m)?.[1]?.trim() || "";

    // Apply filters
    if (flags.area && area !== flags.area) continue;
    if (flags.status && status !== flags.status) continue;

    // Extract title from filename (strip date prefix and extension)
    const title = file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "").replace(/-/g, " ");

    console.log(`${date}  ${status.padEnd(10)}  ${area.padEnd(15)}  ${title}  (${file})`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const [command, ...args] = Deno.args;

switch (command) {
  case "add":
    await cmdAdd(args);
    break;
  case "promote":
    await cmdPromote(args);
    break;
  case "list":
    await cmdList(args);
    break;
  default:
    console.error("Usage: vault-note <add|promote|list> [args...]");
    console.error("");
    console.error("Commands:");
    console.error("  add <type> <title> [--area=X] [--body=text]  Create a note");
    console.error("  promote <file> <target-dir>                  Move from inbox");
    console.error("  list <type> [--area=X] [--status=X]          List notes");
    console.error("");
    console.error(`Types: ${NOTE_TYPES.join(", ")}`);
    Deno.exit(1);
}
