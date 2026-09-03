# IndexNow Setup for Bing Acceleration

**Purpose:** IndexNow submits updated URLs to Bing immediately upon deploy, reducing the indexing lag from 7-14 days to 24-48 hours.

**Status:** Ready to implement. Requires owner action to generate IndexNow key from Bing Webmaster Tools.

## Prerequisites

1. **Bing Webmaster Tools access** (owner dep 3)
   - Verify dosacc.com domain property
   - Navigate to: https://www.bing.com/webmasters/indexnow
   - Generate IndexNow key (64-char hex string)

2. **Key storage**
   - Save key to: `seo/.indexnow-key` (git-ignored, never commit)
   - Keep confidential — do not share or log

## Implementation

### Step 1: Create .well-known endpoint (on Apache host)

Add to `.htaccess` or create static file at `/.well-known/indexnow`:

```
Bing IndexNow key verification
<key-value-here>
```

**Or in .htaccess:**
```apache
RewriteCond %{REQUEST_URI} ^/\.well-known/indexnow$
RewriteRule ^ - [L]
```

Then create `/.well-known/indexnow` file containing only the key value (no markup).

### Step 2: Store key locally

```bash
echo "YOUR_64_CHAR_KEY_HERE" > seo/.indexnow-key
chmod 600 seo/.indexnow-key
# .gitignore already excludes seo/.indexnow-key
```

### Step 3: Submit URLs post-deploy

After uploading files to Apache:

```bash
npm run seo:indexnow   # submits all changed HTML files since a1ea778
```

Or submit specific files:

```bash
npm run seo:indexnow partners/index.html services/bookkeeping/index.html
```

### Step 4: Verify submission

Check Bing Webmaster Tools > IndexNow > Submission History for "Success" status.

## Measurement

**Instrument:** AI crawl log (server logs) + Bing Webmaster Tools

**Metrics:**
- Time from IndexNow ping → first Bingbot re-crawl (target: <48 hours)
- Time from ping → OAI-SearchBot/GPTBot re-crawl (target: <72 hours, via Bing index)
- Bing index coverage increase (should stabilize faster)

**Checkpoint:** 2 weeks post-deploy; compare Bing crawl lag to pre-deploy baseline

## Files Modified

- `seo/indexnow-submit.mjs` — submission script
- `package.json` — added `seo:indexnow` script
- `seo/.indexnow-key` — (created by owner, git-ignored)

## Cost & Dependencies

- **No cost** — IndexNow is free Bing service
- **Depends on:** Owner dep 3 (Bing Webmaster Tools + IndexNow key)
- **Requires:** .well-known endpoint on Apache (one-time setup)

## Rollback

If submission fails or needs suspension:
1. Remove `seo/.indexnow-key`
2. Stop running `npm run seo:indexnow`
3. No other code or infrastructure changes needed

## References

- Bing IndexNow: https://www.bing.com/webmasters/indexnow
- Protocol: https://www.bing.com/indexnow/getstarted
- Spec section: EXP-010 (exploratory-specs)
