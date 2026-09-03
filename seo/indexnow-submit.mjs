#!/usr/bin/env node
/**
 * Submit URLs to Bing IndexNow for immediate re-indexing post-deploy.
 * Requires: IndexNow key stored in seo/.indexnow-key (owner-generated via Bing Webmaster Tools)
 *
 *   node seo/indexnow-submit.mjs [file1.html] [file2.html] ...
 *   npm run seo:indexnow    # submit all files from latest deploy-manifest
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const KEY_FILE = 'seo/.indexnow-key';
const INDEX_NOW_URL = 'https://www.bing.com/indexnow';
const DOMAIN = 'dosacc.com';

// Read IndexNow key from file (owner-generated from Bing Webmaster Tools)
if (!fs.existsSync(KEY_FILE)) {
  console.error(`❌ IndexNow key not found at ${KEY_FILE}`);
  console.error('   Generate at: https://www.bing.com/webmasters/indexnow');
  console.error('   Save the key value to seo/.indexnow-key (keep secret)');
  process.exit(1);
}

const key = fs.readFileSync(KEY_FILE, 'utf8').trim();
if (!key || key.length < 16) {
  console.error('❌ Invalid IndexNow key (too short or empty)');
  process.exit(1);
}

// Get URLs to submit (from command line or git diff)
let urls = process.argv.slice(2);

if (urls.length === 0) {
  // Fallback: get files from latest deploy-manifest
  try {
    const manifest = execSync('git diff a1ea778..HEAD --name-only | grep ".html$"', { encoding: 'utf8' });
    urls = manifest.trim().split('\n').filter(f => f && !f.startsWith('seo/') && !f.startsWith('docs/'));
  } catch {
    console.error('❌ No URLs provided and git diff failed');
    process.exit(1);
  }
}

if (urls.length === 0) {
  console.log('No HTML files to submit to IndexNow');
  process.exit(0);
}

// Build IndexNow payload
const urlList = urls.map(file => {
  const cleanPath = file.replace(/^\/+/, '').replace(/index\.html$/, '');
  return `https://${DOMAIN}/${cleanPath}`;
});

const payload = {
  host: DOMAIN,
  key,
  keyLocation: `https://${DOMAIN}/.well-known/indexnow`,
  urlList: urlList.slice(0, 10000), // Bing limit: 10k per request
};

console.log(`📡 Submitting ${urlList.length} URLs to Bing IndexNow...`);
console.log(`   Payload size: ${JSON.stringify(payload).length} bytes`);

// Submit to Bing IndexNow
try {
  const response = execSync(
    `curl -s -w '\\n%{http_code}' -X POST '${INDEX_NOW_URL}' -H 'Content-Type: application/json' -d '${JSON.stringify(payload)}'`,
    { encoding: 'utf8' }
  );

  const lines = response.trim().split('\n');
  const statusCode = lines[lines.length - 1];

  if (statusCode === '200') {
    console.log('✅ IndexNow submission successful (HTTP 200)');
    console.log(`   ${urlList.length} URLs queued for re-indexing`);
    console.log(`   Bing crawl acceleration: est. 24-48 hours`);
  } else {
    console.error(`❌ IndexNow submission failed (HTTP ${statusCode})`);
    console.error('   Response:', lines.slice(0, -1).join('\n'));
    process.exit(1);
  }
} catch (err) {
  console.error('❌ IndexNow submission error:', err.message);
  process.exit(1);
}
