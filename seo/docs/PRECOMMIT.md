# Pre-commit guard

## The hook currently installed is broken

The repository's active `pre-commit` hook shells out to an seo-engine CLI:

```sh
cd "/Users/kunal/Downloads/Agentic/App/Engine" && exec npx tsx src/cli.ts check ...
```

That directory does not exist on this machine — `App/` contains only `Atlas`,
`Milk`, `MilkProject`, `Money2Abroad`, and `Spartan`. The hook therefore aborts
with `cd: no such file or directory` on **every commit that touches a `.html`
file**, blocking the commit entirely.

Every HTML commit in this program was made with `--no-verify` as a result, and
each commit message records that.

## Replacement

`seo/hooks/pre-commit` runs `seo/check.mjs` against the staged HTML files and
blocks the commit only on ERROR-level findings. It is repo-local, has no external
dependencies beyond Node, and works from a worktree.

```bash
sh seo/hooks/install.sh
```

The installer backs up any existing hook to
`pre-commit.backup.<timestamp>` in the git common dir first, so the seo-engine
hook is recoverable if you restore that tool later.

Hooks live in the git **common** dir, so installing once covers the main checkout
and every worktree.

## What blocks a commit

| Check | Level |
|---|---|
| Missing `<title>` | ERROR |
| Missing meta description (indexable pages only) | ERROR |
| Zero or multiple `<h1>` | ERROR |
| Missing canonical (indexable pages only) | ERROR |
| `noindex` page canonicalising to a *different* URL | ERROR |
| Unparseable JSON-LD | ERROR |
| `<img>` without `alt` | ERROR |
| Broken internal link | ERROR |
| Malformed HTML (no `</head>` / `</body>`) | ERROR |
| Sitemap listing a URL no indexable page serves | ERROR |
| Title over 60 chars | warn |
| Meta description over 160 chars | warn |
| Render-blocking third-party stylesheet | warn |
| Orphan page (no internal inlinks) | warn |
| Indexable page absent from sitemap | warn |
| Self-referencing canonical alongside `noindex` | warn |

Warnings never block. Several are deliberately unfixed — see the EXP-003 entry in
`SEO_CHANGELOG.md` for why the `/news/` and `/education-support/` title lengths
were left alone.

## Run it manually

```bash
npm run seo:check
```

Whole-site runs additionally check orphans and sitemap consistency, which
single-file runs cannot determine.
