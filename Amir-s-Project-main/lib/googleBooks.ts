const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBookInfo {
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  isbn: string;
}

const cache = new Map<string, GoogleBookInfo | null>();

export async function fetchBookByISBN(isbn: string): Promise<GoogleBookInfo | null> {
  const cleanISBN = isbn.replace(/-/g, "");
  if (cache.has(cleanISBN)) return cache.get(cleanISBN)!;

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}?q=isbn:${cleanISBN}&maxResults=1`);
    const data = await res.json();
    if (!data.items?.length) {
      cache.set(cleanISBN, null);
      return null;
    }
    const vol = data.items[0].volumeInfo;
    const info: GoogleBookInfo = {
      title: vol.title || "",
      authors: vol.authors || [],
      description: vol.description || "No description available.",
      thumbnail: vol.imageLinks?.thumbnail?.replace("http:", "https:") || "",
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

export async function searchBooks(query: string): Promise<GoogleBookInfo[]> {
  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5`);
    const data = await res.json();
    if (!data.items?.length) return [];
    return data.items.map((item: any) => {
      const vol = item.volumeInfo;
      return {
        title: vol.title || "",
        authors: vol.authors || [],
        description: vol.description || "No description available.",
        thumbnail: vol.imageLinks?.thumbnail?.replace("http:", "https:") || "",
        isbn: vol.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier || "",
      };
    });
  } catch {
    return [];
  }
}
