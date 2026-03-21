const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export type GoogleBookInfo = {
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  isbn: string;
  publisher?: string;
};

const cache = new Map<string, GoogleBookInfo | null>();

function cleanIsbn(isbn: string) {
  return isbn.replace(/[-\s]/g, '');
}

type GoogleBooksVolumeInfo = {
  title?: unknown;
  authors?: unknown;
  description?: unknown;
  publisher?: unknown;
  imageLinks?: { thumbnail?: unknown } | undefined;
  industryIdentifiers?: { type?: unknown; identifier?: unknown }[] | undefined;
};

type GoogleBooksItem = { volumeInfo?: GoogleBooksVolumeInfo };
type GoogleBooksResponse = { items?: GoogleBooksItem[] };

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

export async function fetchBookByISBN(
  isbn: string
): Promise<GoogleBookInfo | null> {
  const key = cleanIsbn(isbn);
  if (!key) return null;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}?q=isbn:${key}&maxResults=1`);
    const data = (await res.json()) as GoogleBooksResponse;
    if (!data.items?.length) {
      cache.set(key, null);
      return null;
    }

    const vol = data.items[0]?.volumeInfo;
    if (!vol) {
      cache.set(key, null);
      return null;
    }

    const info: GoogleBookInfo = {
      title: asString(vol.title) ?? '',
      authors: asStringArray(vol.authors),
      description: asString(vol.description) ?? 'No description available.',
      thumbnail:
        (asString(vol.imageLinks?.thumbnail)?.replace('http:', 'https:') ?? ''),
      isbn: key,
      publisher: asString(vol.publisher) ?? undefined,
    };
    cache.set(key, info);
    return info;
  } catch {
    cache.set(key, null);
    return null;
  }
}

export async function searchBooks(query: string): Promise<GoogleBookInfo[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const res = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(q)}&maxResults=5`
    );
    const data = (await res.json()) as GoogleBooksResponse;
    if (!data.items?.length) return [];
    return data.items
      .map((item): GoogleBookInfo | null => {
        const vol = item.volumeInfo;
        if (!vol) return null;

        const isbn13 =
          vol.industryIdentifiers?.find(
            (id) => asString(id.type) === 'ISBN_13'
          )?.identifier ?? null;

      return {
          title: asString(vol.title) ?? '',
          authors: asStringArray(vol.authors),
          description: asString(vol.description) ?? 'No description available.',
          thumbnail:
            (asString(vol.imageLinks?.thumbnail)?.replace('http:', 'https:') ??
              ''),
          isbn: asString(isbn13) ?? '',
          publisher: asString(vol.publisher) ?? undefined,
        };
      })
      .filter((x): x is GoogleBookInfo => x != null);
  } catch {
    return [];
  }
}

