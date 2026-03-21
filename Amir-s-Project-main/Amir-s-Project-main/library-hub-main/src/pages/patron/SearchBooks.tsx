import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { patronNav } from "@/lib/navigation";
import BookDetailDialog from "@/components/BookDetailDialog";

const allBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Software", available: 3, shelf: "A-12" },
  { id: 2, title: "Design Patterns", author: "Gang of Four", isbn: "978-0201633610", category: "Software", available: 0, shelf: "A-15" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "Fiction", available: 6, shelf: "B-03" },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", category: "Non-Fiction", available: 2, shelf: "C-08" },
  { id: 5, title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", category: "Self-Help", available: 4, shelf: "D-01" },
  { id: 6, title: "1984", author: "George Orwell", isbn: "978-0451524935", category: "Fiction", available: 5, shelf: "B-07" },
];

const SearchBooks = () => {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<typeof allBooks[0] | null>(null);
  const filtered = allBooks.filter((b) =>
    [b.title, b.author, b.isbn, b.category].some((f) => f.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Search Books" description="Find books in our catalog" />
      <div className="relative max-w-lg mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, ISBN, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card h-11"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="glass-card rounded-xl p-5 flex flex-col cursor-pointer hover:border-accent/40 transition-all"
            onClick={() => setSelectedBook(book)}
          >
            <Badge variant="secondary" className="self-start mb-3">{book.category}</Badge>
            <h3 className="font-display font-semibold text-foreground text-lg">{book.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">ISBN: {book.isbn}</p>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {book.shelf}
              </div>
              {book.available > 0 ? (
                <span className="text-sm font-medium text-success">{book.available} available</span>
              ) : (
                <Button size="sm" variant="outline" className="text-xs" onClick={(e) => e.stopPropagation()}>Reserve</Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <BookDetailDialog
        open={!!selectedBook}
        onOpenChange={(open) => !open && setSelectedBook(null)}
        book={selectedBook}
      />
    </DashboardLayout>
  );
};

export default SearchBooks;
