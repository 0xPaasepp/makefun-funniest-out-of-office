import { mkdirSync, writeFileSync } from "node:fs";

// The entry line: exactly one line, 1-140 characters (the competition's
// gate). A single out-of-office auto-reply, as funny as one line allows.
const LINE =
  "I'm out until Monday. Your email has been forwarded to my future self, who is already disappointed in both of us.\n";

// Runtime guard: the entry must be exactly one line (a single trailing
// newline only) and within the 1-140 character limit.
const text = LINE.slice(0, -1);
const charCount = [...text].length;
if (LINE.length === 0 || !LINE.endsWith("\n")) {
  throw new Error("entry must be non-empty and end with exactly one newline");
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be exactly one line (no internal newlines)");
}
if (charCount < 1 || charCount > 140) {
  throw new Error(
    `entry must be 1-140 characters, got ${charCount}`,
  );
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
