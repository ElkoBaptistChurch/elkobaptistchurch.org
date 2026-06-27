# Sermon Enrichments

Drop zone for AI-generated sermon metadata (n8n or any other automation).

Each file is named `<youtubeId>.json` and looks like:

```json
{
  "youtubeId": "dQw4w9WgXcQ",
  "series": "No Strangers Here",
  "scripture": "Genesis 1:1, Genesis 1:31, Romans 5:12, Romans 8:20-22, John 3:16",
  "description": "A short pastoral summary of the sermon...",
  "tags": ["sin", "creation", "hope"]
}
```

All fields except `youtubeId` are optional — only send what you have. `scripts/sync-sermons.mjs`
(run by `.github/workflows/sync-sermons.yml` on a daily schedule, or manually via
`npm run sermons:sync`) merges each file into the matching sermon in
`src/content/sermons/sermons.json`, clears that sermon's `needsReview` flag, and deletes the
file so it's only applied once.

If a file references a `youtubeId` that isn't in the archive yet (e.g. it posted before the
daily YouTube sync ran), it's left in place and retried on the next sync.
