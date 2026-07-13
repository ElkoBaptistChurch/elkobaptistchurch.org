import type { CollectionEntry } from 'astro:content';
import { BIBLE_BOOKS } from '@/utils/bible-books';

export type SermonEntry = CollectionEntry<'sermons'>;

const BOOK_SET = new Set<string>(BIBLE_BOOKS);
// BIBLE_BOOKS is in canonical order, so everything before Matthew is OT.
const NT_START = BIBLE_BOOKS.indexOf('Matthew');
const OT_BOOKS = BIBLE_BOOKS.slice(0, NT_START) as readonly string[];
const NT_BOOKS = BIBLE_BOOKS.slice(NT_START) as readonly string[];

export function sortByDateDesc(entries: SermonEntry[]): SermonEntry[] {
  return [...entries].sort((a, b) => b.data.date.localeCompare(a.data.date));
}

// Flattens a collection entry into the shape SermonCard/SermonRow expect.
export function toCardProps(entry: SermonEntry) {
  return { id: entry.id, ...entry.data };
}

// A sermon's book is the first tag that matches a canonical Bible book.
export function sermonBook(tags: string[]): string | undefined {
  return tags.find((t) => BOOK_SET.has(t));
}

// Topic tags = everything that isn't a year tag (e.g. "2026Sermons") or a Bible book.
export function sermonTopics(tags: string[]): string[] {
  return tags.filter((t) => !BOOK_SET.has(t) && !/^\d{4}Sermons$/.test(t));
}

export interface Facet {
  value: string;
  count: number;
}

// Books that actually have sermons, split into the two testaments and kept in
// canonical order, each with a count — powers the Book filter dropdown.
export function getBookFacets(entries: SermonEntry[]): { ot: Facet[]; nt: Facet[] } {
  const counts = new Map<string, number>();
  entries.forEach((e) => {
    const b = sermonBook(e.data.tags);
    if (b) counts.set(b, (counts.get(b) ?? 0) + 1);
  });
  const pick = (list: readonly string[]): Facet[] =>
    list.filter((b) => counts.has(b)).map((b) => ({ value: b, count: counts.get(b)! }));
  return { ot: pick(OT_BOOKS), nt: pick(NT_BOOKS) };
}

// Topic tags with counts, most common first — powers the Topic filter dropdown.
export function getTopicFacets(entries: SermonEntry[]): Facet[] {
  const counts = new Map<string, number>();
  entries.forEach((e) =>
    sermonTopics(e.data.tags).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
  );
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export function formatSermonDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
