#!/usr/bin/env node
/**
 * Validate every JSON-LD block on the site.
 *
 * Checks parseability, @context/@type presence, and a few Google-required
 * fields whose absence guarantees ineligibility. Invalid structured data is
 * worse than none: it produces conflicting or ignored entity signals.
 *
 *   node seo/validate-schema.mjs
 */
import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const files = execSync(
  `find . -name "*.html" -not -path "./_archive/*" -not -path "./.git/*" -not -path "*/opportunity/_src/*" | sort`,
  { encoding: 'utf8' }
).trim().split('\n');

// type -> required properties that Google needs for eligibility
const RECOMMENDED = { Organization: ['url'] };

const REQUIRED = {
  Person: ['name'],
  Service: ['name', 'provider'],
  BreadcrumbList: ['itemListElement'],
  ImageGallery: ['name'],
  Organization: ['name'],
  Article: ['headline'],
  HowTo: ['name'],
  Event: ['name', 'startDate', 'location'],
  LocalBusiness: ['name', 'address'],
};

let blocks = 0, errors = 0, warns = 0;
const typeCount = {};

const walk = (node, file, cb) => {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file, cb));
  if (!node || typeof node !== 'object') return;
  if (node['@type']) cb(node);
  for (const v of Object.values(node)) walk(v, file, cb);
};

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const found = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const raw of found) {
    blocks++;
    const body = raw.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
    let data;
    try {
      data = JSON.parse(body);
    } catch (err) {
      errors++;
      console.log(`ERROR  ${file}: unparseable JSON-LD — ${err.message}`);
      continue;
    }
    const top = Array.isArray(data) ? data : [data];
    for (const t of top) {
      if (!t['@context']) { warns++; console.log(`WARN   ${file}: top-level block missing @context (@type=${t['@type']})`); }
    }
    walk(data, file, (node) => {
      const types = [].concat(node['@type']);
      for (const type of types) {
        typeCount[type] = (typeCount[type] || 0) + 1;
        for (const p of REQUIRED[type] || []) {
          if (node[p] === undefined) {
            errors++;
            console.log(`ERROR  ${file}: ${type} missing required "${p}"`);
          }
        }
        for (const p of RECOMMENDED[type] || []) {
          if (node[p] === undefined) {
            warns++;
            console.log(`WARN   ${file}: ${type} missing recommended "${p}"`);
          }
        }
      }
    });
  }
}

console.log(`\n${blocks} JSON-LD blocks parsed across ${files.length} files`);
console.log(`errors: ${errors}   warnings: ${warns}`);
console.log('\ntype counts:');
for (const [t, c] of Object.entries(typeCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(c).padStart(4)}  ${t}`);
}
process.exit(errors ? 1 : 0);
