#!/usr/bin/env bash
# Freeze the immutable pre-program baseline (spec section 5.1).
#
# Run ONCE, before any P1 change ships. Everything it writes into seo/baseline/
# is a permanent reference point: later regressions are diagnosed by diffing
# against it, pinned to the exact source commit captured here.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=seo/baseline
mkdir -p "$OUT"

echo "-> crawl"
node seo/crawl.mjs --out "$OUT/SEO_CRAWL_BASELINE.csv"

echo "-> site config"
curl -sS --max-time 20 https://dosacc.com/robots.txt  -o "$OUT/robots.txt"
curl -sS --max-time 20 https://dosacc.com/sitemap.xml -o "$OUT/sitemap.xml"
cp .htaccess "$OUT/htaccess.txt"

echo "-> sitemap url list"
grep -o '<loc>[^<]*</loc>' "$OUT/sitemap.xml" | sed 's|</\?loc>||g' > "$OUT/sitemap-urls.txt"

echo "-> provenance"
{
  echo "captured_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "commit=$(git rev-parse HEAD)"
  echo "branch=$(git rev-parse --abbrev-ref HEAD)"
  echo "crawler_sha256=$(shasum -a 256 seo/crawl.mjs | cut -d' ' -f1)"
} > "$OUT/PROVENANCE.txt"

echo
echo "baseline frozen in $OUT"
cat "$OUT/PROVENANCE.txt"
