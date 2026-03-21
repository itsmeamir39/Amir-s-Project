/**
 * Google Books API integration service
 * Provides book search and retrieval functionality with caching
 */

interface VolumeInfo {
  title?: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

interface GoogleBooksVolume {
  volumeInfo: VolumeInfo;
}

interface GoogleBooksApiResponse {
  items?: GoogleBooksVolume[];
}

export interface GoogleBookInfo {
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  isbn: string;
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const cache = new Map<string, GoogleBookInfo | null>();

/**
 * Extract ISBN-13 from industry identifiers
 * @param identifiers - Array of industry identifiers from Google Books API
 * @returns ISBN-13 string or empty string if not found
 */
function extractISBN13(identifiers: VolumeInfo['industryIdentifiers']): string {
  if (!identifiers) return "";
  const isbn13 = identifiers.find((id) => id.type === "ISBN_13");
  return isbn13?.identifier || "";
}

/**
 * Extract thumbnail URL and convert to HTTPS
 * @param imageLinks - Image links object from Google Books API
 * @returns HTTPS thumbnail URL or empty string
 */
function extractThumbnail(imageLinks: VolumeInfo['imageLinks']): string {
  if (!imageLinks?.thumbnail) return "";
  return imageLinks.thumbnail.replace("http:", "https:");
}

/**
 * Fetch a book by ISBN from Google Books API
 * @param isbn - ISBN number (with or without hyphens)
 * @returns Normalized book info or null if not found
 */
export async function fetchBookByISBN(isbn: string): Promise<GoogleBookInfo | null> {
  const cleanISBN = isbn.replace(/-/g, "");
  if (cache.has(cleanISBN)) return cache.get(cleanISBN)!;

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}?q=isbn:${cleanISBN}&maxResults=1`);
    const data: GoogleBooksApiResponse = await res.json();
    
    if (!data.items?.length) {
      cache.set(cleanISBN, null);
      return null;
    }

    const vol = data.items[0].volumeInfo;
    const info: GoogleBookInfo = {
      title: vol.title || "",
      authors: vol.authors || [],
      description: vol.description || "No description available.",
      thumbnail: extractThumbnail(vol.imageLinks),
      isbn: cleanISBN,
    };
    
    cache.set(cleanISBN, info);
    return info;
  } catch (err) {
    console.error("Google Books API error:", err);
    cache.set(cleanISBN, null);
    return null;
  }
}

/**
 * Search for books by query string
 * @param query - Search query
 * @returns Array of normalized book information
 */
export async function searchBooks(query: string): Promise<GoogleBookInfo[]> {
  try {
    const res = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5`
    );
    const data: GoogleBooksApiResponse = await res.json();
    
    if (!data.items?.length) return [];
    
    return data.items.map((item: GoogleBooksVolume): GoogleBookInfo => {
      const vol = item.volumeInfo;
      return {
        title: vol.title || "",
        authors: vol.authors || [],
        description: vol.description || "No description available.",
        thumbnail: extractThumbnail(vol.imageLinks),
        isbn: extractISBN13(vol.industryIdentifiers),
      };
    });
  } catch {
    return [];
  }
}
