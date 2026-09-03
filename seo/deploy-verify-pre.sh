#!/bin/bash
# Pre-upload verification: validate files before FileZilla deploy
# Run this BEFORE uploading to Apache to catch issues early
#
#   bash seo/deploy-verify-pre.sh

set -e

echo "🔍 Pre-deploy verification"
echo "=========================="

MANIFEST=$(node seo/deploy-manifest.mjs 2>/dev/null || echo "")
FILE_COUNT=$(echo "$MANIFEST" | grep -c "^      " || echo "0")

# Check .htaccess exists
echo "✓ Checking .htaccess..."
if [ ! -f ".htaccess" ]; then
  echo "❌ FATAL: .htaccess missing — clean URLs, canonical redirect, and security headers will fail"
  exit 1
fi

if ! grep -q "RewriteEngine On" .htaccess; then
  echo "❌ FATAL: .htaccess missing RewriteEngine — routing will fail"
  exit 1
fi

echo "  ✅ .htaccess present and valid"

# Check file count from manifest
echo "✓ Checking file inventory..."
echo "  Files to upload: $FILE_COUNT"

if [ "$FILE_COUNT" -lt 30 ]; then
  echo "⚠️  WARNING: File count seems low (expected ~32). Run 'node seo/deploy-manifest.mjs' to verify."
fi

# Validate JSON-LD schema
echo "✓ Validating JSON-LD schema..."
if ! npm run seo:schema > /tmp/schema-check.txt 2>&1; then
  echo "❌ Schema validation failed:"
  tail -5 /tmp/schema-check.txt
  exit 1
fi

if grep -q "errors: 0" /tmp/schema-check.txt && grep -q "warnings: 0" /tmp/schema-check.txt; then
  echo "  ✅ Schema valid (0 errors, 0 warnings)"
else
  echo "❌ Schema validation found issues:"
  grep "errors:\|warnings:" /tmp/schema-check.txt
  exit 1
fi

# Check for common breaking changes
echo "✓ Checking for common issues..."

if grep -r "TODO\|FIXME" *.html 2>/dev/null | head -5 | grep -q .; then
  echo "⚠️  WARNING: Found TODO/FIXME comments in HTML (should be removed before deploy)"
fi

if grep -r "localhost\|127.0.0.1" *.html 2>/dev/null | grep -q .; then
  echo "❌ FATAL: Found localhost references in HTML (must be absolute URLs)"
  exit 1
fi

# File integrity hashes (for comparison post-upload)
echo "✓ Computing file integrity hashes..."
find . -name "*.html" -type f | xargs shasum > /tmp/pre-deploy-hashes.txt 2>/dev/null || true
echo "  Hashes saved to /tmp/pre-deploy-hashes.txt (use for post-upload comparison)"

echo ""
echo "✅ Pre-deploy verification passed"
echo ""
echo "Next steps:"
echo "  1. Upload files via FileZilla (remember: Force showing hidden files > upload .htaccess LAST)"
echo "  2. Run: bash seo/deploy-verify-post.sh"
echo "  3. Run: npm run seo:indexnow (if IndexNow key is configured)"
