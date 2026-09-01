#!/usr/bin/env node
/**
 * Generate the exact upload list for a manual (FileZilla/SFTP) deploy.
 *
 *   node seo/deploy-manifest.mjs [since-ref]
 *
 * Defaults to a1ea778, the commit currently live on dosacc.com. Prints every
 * changed file that belongs on the web host, and names what must NOT be uploaded.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const SINCE = process.argv[2] || 'a1ea778';

// Never upload: tooling, source, version control, editor and OS cruft.
const EXCLUDE = [
  /^seo\//, /^docs\//, /^\.git/, /^\.claude\//, /^_archive\//,
  /^opportunity\/_src\//, /^README\.md$/, /^package(-lock)?\.json$/,
  /\.DS_Store$/, /^node_modules\//,
];

const changed = execSync(`git diff --name-status ${SINCE}..HEAD`, { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)
  .map((l) => { const [status, ...rest] = l.split('\t'); return { status, file: rest.join('\t') }; });

const deployable = changed.filter(({ file }) => !EXCLUDE.some((re) => re.test(file)));
const skipped = changed.filter(({ file }) => EXCLUDE.some((re) => re.test(file)));

const added = deployable.filter((f) => f.status === 'A');
const modified = deployable.filter((f) => f.status === 'M');
const deleted = deployable.filter((f) => f.status === 'D');

const dotfiles = deployable.filter(({ file }) => path.basename(file).startsWith('.'));

console.log(`Deploy manifest — changes since ${SINCE} (the commit live on dosacc.com)\n`);

if (dotfiles.length) {
  console.log('!! HIDDEN FILES — FileZilla does not show these by default.');
  console.log('   Enable: Server menu > "Force showing hidden files", then upload:');
  for (const { file } of dotfiles) console.log(`     ${file}`);
  console.log('   Missing .htaccess means clean URLs, the canonical host redirect,');
  console.log('   security headers and the /404 fix all silently fail to deploy.\n');
}

const show = (label, list) => {
  if (!list.length) return;
  console.log(`${label} (${list.length})`);
  const dirs = new Map();
  for (const { file } of list) {
    const d = path.dirname(file);
    if (!dirs.has(d)) dirs.set(d, []);
    dirs.get(d).push(path.basename(file));
  }
  for (const [d, files] of [...dirs].sort()) {
    console.log(`  ${d === '.' ? '(site root)' : d}/`);
    for (const f of files.sort()) console.log(`      ${f}`);
  }
  console.log('');
};

show('NEW — create these directories on the server', added);
show('MODIFIED — overwrite existing', modified);
if (deleted.length) show('DELETED — remove from the server', deleted);

console.log(`DO NOT UPLOAD (${skipped.length} files: tooling, source, docs, git)`);
console.log('  seo/  docs/  opportunity/_src/  _archive/  .git/  .claude/');
console.log('  README.md  package.json  package-lock.json  .DS_Store\n');

console.log(`TOTAL TO UPLOAD: ${deployable.length} files`);
console.log('\nAfter uploading, verify from this machine:');
console.log('  npm run seo:diff        # expect 0 regressions');
console.log('  curl -sS -o /dev/null -w "%{http_code}\\n" https://dosacc.com/404          # expect 404');
console.log('  curl -sS -o /dev/null -w "%{http_code}\\n" https://dosacc.com/opportunity/  # expect 200');
