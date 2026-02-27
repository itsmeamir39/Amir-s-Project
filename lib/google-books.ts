export async function getBookByISBN(isbn: string) {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  );
  const data = await res.json();

  if (!data.items) return null;

  const book = data.items[0].volumeInfo;

  return {
    title: book.title as string | undefined,
    author: book.authors?.join(', '),
    publisher: book.publisher as string | undefined,
    cover: book.imageLinks?.thumbnail as string | undefined,
    description: book.description as string | undefined,
  };
}

