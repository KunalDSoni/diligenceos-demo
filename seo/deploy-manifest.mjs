#!/usr/bin/env node
/**
 * Generate the exact upload list for a manual (FileZilla/SFTP) deploy.
 *
 *   node seo/deploy-manifest.mjs [since-ref] [--verify]
 *
 * Prints every changed file that belongs on the web host, and names what must
 * NOT be uploaded.
 *
 * SINCE defaults to a1ea778. That is an ASSUMPTION about what is live, not a
 * fact - nothing publishes the deployed commit back to this repo. A manual
 * FileZilla deploy can and does drift from it: on 2026-09-04 both
 * assets/js/hero-canvas.js and llms.txt were 404 on the host despite being
 * added at or before a1ea778, so a diff against it omitted them.
 *
 * Pass --verify to HEAD-check every deployable file against the live host and
 * list what is actually missing. That check is the authority; the diff is a
 * convenience.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const args = process.argv.slice(2);
const VERIFY = args.includes('--verify');
const SINCE = args.find((a) => !a.startsWith('--')) || 'a1ea778';
const HOST = 'https://dosacc.com';

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

console.log(`Deploy manifest — changes since ${SINCE} (ASSUMED live on dosacc.com)\n`);

if (!VERIFY) {
  console.log('   Nothing reports the deployed commit back to this repo, so the');
  console.log('   baseline above is unverified and this list can omit files that');
  console.log('   never reached the host. Confirm with:  npm run seo:manifest -- --verify\n');
}

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

/* ── live verification ─────────────────────────────────────────────────────
   The diff above trusts SINCE. This does not: it asks the host what it
   actually serves, which is the only way to catch a file that was never
   uploaded in some earlier deploy. */

if (VERIFY) {
  const { readdirSync, statSync, readFileSync } = await import('node:fs');

  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full);
    if (EXCLUDE.some((re) => re.test(rel)) || name === '.git') return [];
    return statSync(full).isDirectory() ? walk(full) : [rel];
  });

  // Images are large and rarely change; a HEAD sweep of them is mostly noise.
  const targets = walk(ROOT).filter((f) => !/^(Photos|Event)\//.test(f));

  const urlFor = (f) => `${HOST}/${f.split('/').map(encodeURIComponent).join('/')}`;

  console.log(`\nVERIFYING ${targets.length} files against ${HOST} ...`);

  // 404.html is an error document, not an addressable page. Requesting it
  // returns 404 by design - .htaccess answers /404 with a hard 404 so Search
  // Console does not see a soft 404 - so a status probe cannot tell "never
  // uploaded" from "working exactly as intended", and reported it missing
  // either way. Assert what actually matters instead: that a URL which does
  // not exist renders OUR styled page and not the server's bare default.
  // The marker is read from the local file so it cannot drift out of sync.
  const errorPageTitle = (readFileSync(path.join(ROOT, '404.html'), 'utf8')
    .match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();

  const missing = [];
  for (const f of targets) {
    // .htaccess is config, never served; a 403/404 on it proves nothing.
    if (path.basename(f) === '.htaccess') continue;

    // 404.html cannot be checked at /404.html: the .html-stripping rule 301s
    // it to /404, which answers with a deliberate hard 404, so a plain probe
    // reports it missing whether it is there or not. An encoded dot resolves
    // to the same file on disk while leaving no literal ".html" in the raw
    // request line for that rule to match, so this reaches the file itself.
    //
    // This proves the file is uploaded. It does NOT mean visitors see it:
    // GoDaddy ignores ErrorDocument on this account (verified 2026-09-05 - a
    // local path and a literal string both yield Apache's bare "404 Not
    // Found", with .htaccess demonstrably live), so a mistyped URL shows the
    // host's page. That is a hosting setting, not a deploy problem, and no
    // upload will change it.
    if (f === '404.html') {
      if (!errorPageTitle) { missing.push({ f, status: 'no <title>' }); continue; }
      try {
        const res = await fetch(`${HOST}/404%2Ehtml`);
        const body = await res.text();
        if (res.status >= 400 || !body.includes(errorPageTitle)) {
          missing.push({ f, status: `HTTP ${res.status}, ${body.length}B` });
        }
      } catch {
        missing.push({ f, status: 'unreachable' });
      }
      continue;
    }

    try {
      const res = await fetch(urlFor(f), { method: 'HEAD', redirect: 'follow' });
      if (res.status >= 400) missing.push({ f, status: res.status });
    } catch {
      missing.push({ f, status: 'unreachable' });
    }
  }

  if (!missing.length) {
    console.log('  every deployable file is present on the host.');
  } else {
    console.log(`\n!! MISSING FROM THE HOST (${missing.length}) — upload regardless of the diff:`);
    for (const { f, status } of missing) console.log(`     ${String(status).padEnd(16)} ${f}`);
    if (missing.some((m) => m.f === '404.html')) {
      console.log(`\n   404.html is not on the server. Note that uploading it will not`);
      console.log('   make mistyped URLs show it - GoDaddy ignores ErrorDocument on');
      console.log('   this account. See the error page section of .htaccess.');
    }
  }
}
