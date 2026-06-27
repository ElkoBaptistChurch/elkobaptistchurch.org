#!/usr/bin/env node
// Syncs src/content/sermons/sermons.json against the church's YouTube uploads,
// and merges in any AI-generated enrichment files dropped by n8n.
//
// Usage:
//   node scripts/sync-sermons.mjs            # incremental: add new videos only
//   node scripts/sync-sermons.mjs --clear     # full reimport: refetch everything
//
// Required env vars: YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID
//
// n8n contract: after generating an AI summary/scripture/tags from a sermon's
// transcript, commit a file to data/sermon-enrichments/<youtubeId>.json shaped:
//   { "youtubeId": "...", "series"?: "...", "scripture"?: "...",
//     "description"?: "...", "tags"?: ["..."] }
// This script merges it into the matching sermon entry, clears needsReview,
// and deletes the file so it's only applied once.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SERMONS_PATH = path.join(REPO_ROOT, 'src/content/sermons/sermons.json');
const ENRICHMENTS_DIR = path.join(REPO_ROOT, 'data/sermon-enrichments');

const CLEAR = process.argv.includes('--clear');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// Kept in sync with src/utils/bible-books.ts (plain Node script, can't import TS).
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges',
  'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles',
  '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
  'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John',
  '2 John', '3 John', 'Jude', 'Revelation',
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDuration(iso8601) {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes > 0 ? `${totalMinutes} min` : undefined;
}

function parseDateFromTitle(title) {
  const match = title.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return undefined;
  const [, mm, dd, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}

function parseDescription(description) {
  const firstLine = (description.split('\n')[0] || '').trim();
  const match = firstLine.match(/Summary:\s*(.*?)\s*\|\s*Scripture:\s*(.*)/i);

  if (!match) {
    return {
      description: description.trim().slice(0, 500),
      scripture: '',
      ok: false,
    };
  }

  const [, , scriptureRaw] = match;
  const scripture = scriptureRaw.replace(/\s+v(\d)/gi, ' $1').trim();

  const lines = description.split('\n');
  const timestampsIdx = lines.findIndex((l) => /^Timestamps\s*$/i.test(l.trim()));
  const bodyLines = (timestampsIdx === -1 ? lines.slice(1) : lines.slice(1, timestampsIdx))
    .map((l) => l.trim())
    .filter(Boolean)
    // Drop the trailing hashtag line if present.
    .filter((l) => !/^#\w+/.test(l));

  return {
    description: bodyLines.join(' ').trim() || firstLine,
    scripture,
    ok: true,
  };
}

function deriveTags(scripture, date) {
  const tags = new Set();
  BIBLE_BOOKS.forEach((book) => {
    if (scripture.includes(book)) tags.add(book);
  });
  const year = date.slice(0, 4);
  if (year) tags.add(`${year}Sermons`);
  return [...tags];
}

async function fetchUploadsPlaylistId() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  const playlistId = json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) throw new Error('Could not resolve uploads playlist ID for channel');
  return playlistId;
}

async function fetchAllPlaylistVideoIds(playlistId) {
  const ids = [];
  let pageToken = '';
  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    (json.items || []).forEach((item) => ids.push(item.contentDetails.videoId));
    pageToken = json.nextPageToken || '';
  } while (pageToken);
  return ids;
}

async function fetchVideoDetails(videoIds) {
  const details = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batch.join(',')}&key=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    details.push(...(json.items || []));
  }
  return details;
}

function buildSermonFromVideo(video) {
  const { snippet, contentDetails } = video;
  const date = parseDateFromTitle(snippet.title) || snippet.publishedAt.slice(0, 10);
  const { description, scripture, ok } = parseDescription(snippet.description || '');

  return {
    id: `${slugify(snippet.title)}-${date}`,
    title: snippet.title,
    speaker: 'Pastor Wayne Holcomb',
    date,
    scripture,
    description,
    duration: parseDuration(contentDetails.duration),
    youtubeId: video.id,
    tags: deriveTags(scripture, date),
    needsReview: !ok,
  };
}

function loadEnrichments() {
  if (!fs.existsSync(ENRICHMENTS_DIR)) return [];
  return fs.readdirSync(ENRICHMENTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const filePath = path.join(ENRICHMENTS_DIR, f);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return { filePath, data };
    });
}

function applyEnrichment(sermon, enrichment) {
  const merged = { ...sermon };
  if (enrichment.series) merged.series = enrichment.series;
  if (enrichment.scripture) merged.scripture = enrichment.scripture;
  if (enrichment.description) merged.description = enrichment.description;
  if (enrichment.tags?.length) {
    merged.tags = [...new Set([...(merged.tags || []), ...enrichment.tags])];
  }
  merged.needsReview = false;
  return merged;
}

async function main() {
  if (!API_KEY || !CHANNEL_ID) {
    console.error('Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID environment variables.');
    process.exit(1);
  }

  const existing = CLEAR ? [] : JSON.parse(fs.readFileSync(SERMONS_PATH, 'utf-8'));
  const existingIds = new Set(existing.map((s) => s.youtubeId).filter(Boolean));

  console.log(CLEAR ? 'Full reimport: fetching entire channel history…' : 'Incremental sync: checking for new videos…');

  const playlistId = await fetchUploadsPlaylistId();
  const videoIds = await fetchAllPlaylistVideoIds(playlistId);
  const idsToFetch = CLEAR ? videoIds : videoIds.filter((id) => !existingIds.has(id));

  console.log(`Found ${videoIds.length} videos on channel, ${idsToFetch.length} new.`);

  const newSermons = idsToFetch.length > 0
    ? (await fetchVideoDetails(idsToFetch)).map(buildSermonFromVideo)
    : [];

  let all = [...existing, ...newSermons];

  const enrichments = loadEnrichments();
  if (enrichments.length > 0) {
    console.log(`Applying ${enrichments.length} enrichment file(s)…`);
    enrichments.forEach(({ filePath, data }) => {
      const idx = all.findIndex((s) => s.youtubeId === data.youtubeId);
      if (idx === -1) {
        console.warn(`  Skipping ${path.basename(filePath)} — no sermon found with youtubeId ${data.youtubeId}`);
        return;
      }
      all[idx] = applyEnrichment(all[idx], data);
      fs.unlinkSync(filePath);
    });
  }

  all.sort((a, b) => b.date.localeCompare(a.date));

  fs.writeFileSync(SERMONS_PATH, `${JSON.stringify(all, null, 2)}\n`);
  console.log(`Wrote ${all.length} sermons to ${path.relative(REPO_ROOT, SERMONS_PATH)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
