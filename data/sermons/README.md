# Sermon data — `data/sermons/`

Each sermon is **one JSON file**. n8n writes them here and the commit triggers a
deploy. At build time Astro's `glob` loader (see `src/content.config.ts`) reads
**every `*.json` file in this tree recursively**, so the live site reflects
whatever files are present — there is no generated index file to keep in sync.

## Folder convention

Organize by the sermon date:

```
data/sermons/<YYYY>/<MM>/<slug>.json   e.g. data/sermons/2026/05/come-as-you-are.json
```

Subfolders are only for human organization — the loader globs recursively, so the
exact layout doesn't matter to the build. Keep one sermon per file.

## File shape

```json
{
  "id": "come-as-you-are",
  "title": "Come As You Are",
  "speaker": "Pastor Wayne Holcomb",
  "date": "2026-05-18",
  "scripture": "John 4:1–26",
  "description": "Full sermon summary…",
  "duration": "38 min",
  "youtubeId": "YBECuXzRKKo",
  "tags": ["grace", "salvation", "John", "2026Sermons"],
  "needsReview": false
}
```

Validated by the Zod schema in `src/content.config.ts`. A build **fails** if any
file violates it, so n8n output must conform.

| Field         | Required | Notes |
|---------------|----------|-------|
| `id`          | no\*     | URL-safe slug; also use it as the filename. Falls back to the filename if omitted. |
| `title`       | yes      | |
| `speaker`     | no       | Defaults to `Pastor Wayne Holcomb`. Rendered as a minor detail beside the date. |
| `date`        | yes      | ISO `YYYY-MM-DD`. Drives sort order (newest first). |
| `scripture`   | yes      | e.g. `John 4:1–26`. |
| `description` | yes      | |
| `duration`    | no       | e.g. `38 min`. |
| `youtubeId`   | no       | When present, cards link straight to YouTube. |
| `tags`        | no       | Defaults to `[]`. See below. |
| `needsReview` | no       | Defaults to `false`. Shows a "Needs tagging" badge. |

\* Recommended. The `id` must be unique across all files.

## Tags drive the filters

The sermons page builds its filter UI from `tags`, so n8n should include:

- A **year tag** in the exact form `YYYYSermons` (e.g. `2026Sermons`) — powers the
  year filter (`getYearTags` in `src/utils/sermons.ts`).
- **Bible book names** matching `src/utils/bible-books.ts` (e.g. `John`, `Psalm`) —
  powers the book filter (`getBookTags`).
- Any free-form topic tags (e.g. `grace`, `hope`).
