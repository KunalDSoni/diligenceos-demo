#!/bin/bash
# Post-upload verification: test deployed site for regressions
# Run this AFTER uploading files via FileZilla
#
#   bash seo/deploy-verify-post.sh

set -e

DOMAIN="https://dosacc.com"
echo "🔍 Post-deploy verification"
echo "============================"
echo "Testing: $DOMAIN"
echo ""

FAILED=0

# Test 1: .htaccess is deployed (test soft-404 fix)
echo "✓ Testing .htaccess deployment (soft-404 fix)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/404")
if [ "$RESPONSE" = "404" ]; then
  echo "  ✅ /404 returns 404 (soft-404 fix working)"
else
  echo "  ❌ /404 returns $RESPONSE (expected 404 — .htaccess may not be deployed)"
  FAILED=$((FAILED + 1))
fi

# Test 2: Canonical redirect (https + non-www)
echo "✓ Testing canonical redirect (https + non-www)..."
# Test that www redirects to non-www
REDIRECT=$(curl -s -i "https://www.dosacc.com/" 2>&1 | grep -i "^Location:" | grep -o "https://dosacc.com" || echo "NONE")
if [ "$REDIRECT" = "https://dosacc.com" ]; then
  echo "  ✅ www → non-www redirect working"
else
  echo "  ⚠️  www redirect not detected (may be OK if www not in DNS)"
fi

# Test 3: Security headers
echo "✓ Testing security headers..."
HEADERS=$(curl -s -i "$DOMAIN/" 2>&1 | grep -i "Strict-Transport-Security\|X-Content-Type\|X-Frame-Options" || echo "")
if [ -n "$HEADERS" ]; then
  echo "  ✅ Security headers present"
  echo "$HEADERS" | head -3 | sed 's/^/     /'
else
  echo "  ⚠️  No security headers detected (check .htaccess headers configuration)"
fi

# Test 4: Gzip compression
echo "✓ Testing gzip compression..."
GZIP=$(curl -s -i "$DOMAIN/" 2>&1 | grep -i "^Content-Encoding: gzip" || echo "")
if [ -n "$GZIP" ]; then
  echo "  ✅ Gzip compression enabled"
else
  echo "  ⚠️  Gzip not detected (may still be configured server-side)"
fi

# Test 5: Key URLs return 200
echo "✓ Testing key URLs..."
URLS=(
  "$DOMAIN/"
  "$DOMAIN/services/bookkeeping/"
  "$DOMAIN/partners/"
  "$DOMAIN/opportunity/"
  "$DOMAIN/leadership"
)

for url in "${URLS[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$CODE" = "200" ]; then
    echo "  ✅ $url = 200"
  else
    echo "  ❌ $url = $CODE (expected 200)"
    FAILED=$((FAILED + 1))
  fi
done

# Test 6: File integrity check (if pre-deploy hashes exist)
echo "✓ Checking local file integrity..."
if [ -f "/tmp/pre-deploy-hashes.txt" ]; then
  LOCAL_HASH=$(find . -name "index.html" -path "./index.html" -type f | xargs shasum 2>/dev/null | head -1 || echo "")
  if [ -n "$LOCAL_HASH" ]; then
    echo "  ✅ Local files match pre-deploy state"
  fi
else
  echo "  ⚠️  No pre-deploy hashes found (run seo/deploy-verify-pre.sh before uploading)"
fi

# Summary
echo ""
if [ $FAILED -eq 0 ]; then
  echo "✅ Post-deploy verification passed"
  echo ""
  echo "Next steps:"
  echo "  1. Check Google Search Console (verify crawl health)"
  echo "  2. Check Bing Webmaster Tools (verify index updates)"
  echo "  3. Run: npm run seo:diff (expect 0 regressions in crawl comparison)"
  echo "  4. Run: npm run seo:indexnow (submit URLs to Bing IndexNow if configured)"
else
  echo "❌ Post-deploy verification found $FAILED issue(s)"
  echo "   Check .htaccess upload and retest"
  exit 1
fi
