// The Funniest Out-of-Office — entry writer (Node stdlib only).
// Writes exactly one line to /output/entry.txt: the out-of-office reply,
// 113 chars, plus a single trailing newline (114 bytes total).

const fs = require('node:fs');
const path = require('node:path');

const OUT_DIR = '/output';
const OUT_FILE = path.join(OUT_DIR, 'entry.txt');

const ENTRY =
  "I'm out until Monday. Your email has been forwarded to my future self, who is already disappointed in both of us.";

function validate(text) {
  if (typeof text !== 'string' || text.length === 0) {
    throw new Error('entry must be a non-empty string');
  }
  if (text.length > 180) {
    throw new Error(`entry too long: ${text.length} chars (max 180)`);
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('entry must be a single line with no internal newlines');
  }
  // Reject any other control characters (tabs, NUL, DEL, etc.) — the
  // entry must be plain printable text only.
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) {
      throw new Error(`entry contains a control character at position ${i} (U+${code.toString(16).padStart(4, '0')})`);
    }
  }
  if (text.trim() !== text) {
    throw new Error('entry must not have leading or trailing whitespace');
  }
  return text;
}

function main() {
  const line = validate(ENTRY);
  const content = line + '\n';
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, content, 'utf8');

  // Runtime guards: re-read and verify what was actually written.
  const written = fs.readFileSync(OUT_FILE, 'utf8');
  if (written !== content) {
    throw new Error('written output does not match expected content');
  }
  if (!written.endsWith('\n') || written.endsWith('\n\n')) {
    throw new Error('output must end with exactly one trailing newline');
  }
  const lines = written.split('\n');
  if (lines.length !== 2 || lines[1] !== '') {
    throw new Error('output must be exactly one line plus a trailing newline');
  }
  if (Buffer.byteLength(written, 'utf8') !== 114) {
    throw new Error(`unexpected output size: ${Buffer.byteLength(written, 'utf8')} bytes (expected 114)`);
  }
}

main();
