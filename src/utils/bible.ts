// Build-time King James Version passage lookup for the sermon "Read the Passage"
// tab. The full KJV lives in data/bible/kjv.json (committed, public domain — see
// data/bible/README.md), so this does ZERO network. It's used only in
// getStaticPaths, so the imported text is bundled into the build-time SSR pass
// and never shipped to the client.
import kjv from '../../data/bible/kjv.json';

export interface Passage {
  reference: string; // the display reference as authored, e.g. "Luke 2:8–14"
  translation: string; // "KJV"
  verses: { num: number; text: string }[];
}

type Bible = Record<string, Record<string, Record<string, string>>>;

const bible = kjv as Bible;

// Book-name aliases: sermon references don't always match the KJV data's book
// keys. (Sermons write "Psalm 1:1–3"; the data uses "Psalms".)
const BOOK_ALIASES: Record<string, string> = {
  Psalm: 'Psalms',
};

// Parse a reference string into its parts. Handles the shapes our sermons use:
//   "Luke 2:8–14"  (verse range)   "John 3:16"  (single verse)   "Psalm 23"  (chapter)
// En/em dashes are normalized to '-'. Cross-chapter ranges and comma lists are
// not supported and return null (callers fall back to a link).
function parseReference(scripture: string): {
  book: string;
  chapter: string;
  start?: number;
  end?: number;
} | null {
  const normalized = scripture.replace(/[–—]/g, '-').trim();
  const match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+)(?:\s*-\s*(\d+))?)?$/);
  if (!match) return null;

  const [, rawBook, chapter, start, end] = match;
  const book = BOOK_ALIASES[rawBook] ?? rawBook;

  return {
    book,
    chapter,
    start: start ? Number(start) : undefined,
    end: end ? Number(end) : start ? Number(start) : undefined,
  };
}

// Resolve a scripture reference to its KJV verse text. Returns null if the
// reference can't be parsed or isn't found, so the passage panel degrades to a
// link instead of breaking the build.
export function getPassage(scripture: string): Passage | null {
  const parsed = parseReference(scripture);
  if (!parsed) return null;

  const chapterVerses = bible[parsed.book]?.[parsed.chapter];
  if (!chapterVerses) return null;

  // No verse specified → the whole chapter, in numeric order.
  const nums =
    parsed.start === undefined
      ? Object.keys(chapterVerses)
          .map(Number)
          .sort((a, b) => a - b)
      : range(parsed.start, parsed.end ?? parsed.start);

  const verses = nums
    .map((num) => ({ num, text: chapterVerses[String(num)] }))
    .filter((v): v is { num: number; text: string } => typeof v.text === 'string');

  if (verses.length === 0) return null;

  return { reference: scripture, translation: 'KJV', verses };
}

function range(start: number, end: number): number[] {
  if (end < start) return [start];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
