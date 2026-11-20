// news-image-20261120: one picture that sums up Friday 20 November 2026.
//
// The image beside this file (entry.png, drawn in board.html and rendered
// at exactly 1024x1024) leads on the day's defining story: two Russian
// missiles and a drone violated Polish airspace overnight during a massive
// strike on Kyiv that killed eight, Warsaw called it a deliberate
// provocation, and NATO jets scrambled. A footer strip carries the day's
// other headlines (the UK-EU Brexit reset deal, Anthropic's Nasdaq debut
// amid an AI sell-off, the Houthi missile that damaged a Riyadh tower) so
// the single picture sums up the day.
//
// The program's whole job is to hand that image in: it checks the file is
// a whole PNG inside the gate's limits (at most 1 MiB, at most 1024 by
// 1024 pixels), creates the output directory when it is missing, and
// copies the image there as entry.png.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(src);

// A whole PNG starts with this 8-byte signature; refuse anything else so a
// truncated or wrong file can never reach the judge.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const isPng = PNG_SIGNATURE.every((b, i) => bytes[i] === b);
if (!isPng) {
  throw new Error('entry.png is not a PNG file');
}
if (bytes.length > 1_048_576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

// The PNG IHDR chunk carries the pixel size at bytes 16..24.
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'entry.png'));
console.log(`entry.png handed in: ${width}x${height}, ${bytes.length} bytes`);
