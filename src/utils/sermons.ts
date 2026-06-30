import type { CollectionEntry } from 'astro:content';
import { BIBLE_BOOKS } from '@/utils/bible-books';

export type SermonEntry = CollectionEntry<'sermons'>;

export function sortByDateDesc(entries: SermonEntry[]): SermonEntry[] {
  return [...entries].sort((a, b) => b.data.date.localeCompare(a.data.date));
}

// Flattens a collection entry into the shape SermonCard expects.
export function toCardProps(entry: SermonEntry) {
  return { id: entry.id, ...entry.data };
}

export function getYearTags(entries: SermonEntry[]): string[] {
  const years = new Set<string>();
  entries.forEach((e) => e.data.tags.forEach((t) => {
    if (/^\d{4}Sermons$/.test(t)) years.add(t);
  }));
  return [...years].sort().reverse();
}

export function getBookTags(entries: SermonEntry[]): string[] {
  const books = new Set<string>();
  entries.forEach((e) => e.data.tags.forEach((t) => {
    if ((BIBLE_BOOKS as readonly string[]).includes(t)) books.add(t);
  }));
  return [...books].sort();
}

export interface RecentPill {
  type: 'book' | 'tag';
  value: string;
}

// A small "recently used" cloud of filters, pulled from the most recent
// sermons (not the whole archive) so it stays relevant as the archive grows
// into the hundreds. Mixes scripture books and topic tags, capped
// to `limit` total and ordered by recency of first appearance.
export function getRecentPills(
  entries: SermonEntry[],
  { limit = 10, recentCount = 20 }: { limit?: number; recentCount?: number } = {},
): RecentPill[] {
  const pool = entries.slice(0, recentCount);
  const seen = new Set<string>();
  const pills: RecentPill[] = [];

  for (const entry of pool) {
    if (pills.length >= limit) break;

    for (const tag of entry.data.tags) {
      if (/^\d{4}Sermons$/.test(tag) || seen.has(tag)) continue;
      seen.add(tag);
      const type = (BIBLE_BOOKS as readonly string[]).includes(tag) ? 'book' : 'tag';
      pills.push({ type, value: tag });
    }
  }

  return pills.slice(0, limit);
}

export function formatSermonDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
