'use strict';
// Standalone Node.js RiceScript compiler using the same METranslator that
// mepack.js drives from `window.me.compile()`.
//
// Usage: node compile-rice.js path/to/file.rice
//
// Note: `me.compile()` itself can't run in Node — it's a browser UI object
// (MEApplication) bound to DOM elements (#editor, #preview, #console) and
// reads source text out of the on-screen editor, it takes no argument.
// What it actually calls under the hood is:
//   me.preview.compile(text) -> translator.compile(text)
// where `translator` is a plain METranslator instance with no DOM
// dependency. That's what this script drives directly.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PACK_DIR = __dirname;

const sandbox = { console };
sandbox.window = sandbox;                       // so `window.x = y` at module-init time works
sandbox.navigator = { userAgent: 'node' };       // MEUtil reads navigator.userAgent at load time
vm.createContext(sandbox);

for (const file of ['transpack.js', 'evalpack.js', 'mepack.js']) {
  const code = fs.readFileSync(path.join(PACK_DIR, file), 'utf8');
  vm.runInContext(code, sandbox, { filename: file });
}

const riceFile = process.argv[2];
if (!riceFile) {
  console.error('usage: node compile-rice.js <file.rice>');
  process.exit(1);
}

const source = fs.readFileSync(riceFile, 'utf8');

// `2` = eval_version, matching `new METranslator(2)` in index.js's
// MEApplication constructor.
const translator = new sandbox.METranslator(2);

try {
  const output = translator.compile(source);
  console.log(`Compiled OK: ${output.length} program(s)`);
  console.log(output[0].trans_code);
} catch (err) {
  console.error('Compile error:', err);
  process.exit(1);
}
