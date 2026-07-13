# Bible text — `data/bible/`

## `kjv.json`

The full **King James Version** (66 books, 31,102 verses, ~4 MB), used at build
time to render the "Read the Passage" tab on sermon pages
(`src/pages/sermons/[id].astro`).

**Shape** — a lookup object keyed for verse-range extraction:

```json
{
  "Luke": { "2": { "8": "And there were in the same country shepherds…" } },
  "Psalms": { "1": { "1": "Blessed is the man that walketh not…" } }
}
```

Book keys are full display names (`1 Corinthians`, `Song of Solomon`, `Psalms`).
Note sermon references use the singular `Psalm`; the lookup maps `Psalm → Psalms`.

## Why it's committed

The KJV is **public domain in the United States**, so the text lives in the repo
rather than being fetched at build time. This means the site build does **zero
network** for scripture — a deploy can never fail or lose verse text because an
external Bible API is slow or down. (The KJV is under perpetual Crown copyright
in the *UK* only; not relevant to a US church site.)

## Regenerating

Source: [`aruljohn/Bible-kjv`](https://github.com/aruljohn/Bible-kjv) — clean,
verse-numbered public-domain KJV, one file per book. That repo rarely changes, so
this is a one-time pull, not a build dependency. To refresh:

```
node scripts/build-kjv.mjs
```

The script downloads all 66 books and flattens them into `kjv.json`. We keep only
the formatted output under version control — no git submodule.
