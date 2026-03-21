import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { librarianNav } from "@/lib/navigation";
import BookDetailDialog from "@/components/BookDetailDialog";

const books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", shelf: "A-12", status: "Available", copies: 3, category: "Software" },
  { id: 2, title: "Design Patterns", author: "Gang of Four", isbn: "978-0201633610", shelf: "A-15", status: "All Issued", copies: 0, category: "Software" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", shelf: "B-03", status: "Available", copies: 6, category: "Fiction" },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", shelf: "C-08", status: "Available", copies: 2, category: "Non-Fiction" },
  { id: 5, title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", shelf: "D-01", status: "Damaged", copies: 1, category: "Self-Help" },
];

const BookCatalog = () => {
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);

  return (
    <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
      <PageHeader title="Book Catalog" description="Browse and manage the book collection" />
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search catalog..." className="pl-10 bg-card" />
        </div>
      </div>
      <DataTable
        columns={[
          { header: "Title", accessor: (row) => (
            <button onClick={() => setSelectedBook(row)} className="text-left font-medium text-accent hover:underline">
              {row.title}
            </button>
          )},
          { header: "Author", accessor: "author" },
          { header: "Shelf", accessor: "shelf", className: "font-mono" },
          { header: "Available", accessor: (row) => String(row.copies) },
          {
            header: "Status",
            accessor: (row) => (
              <Badge variant={row.status === "Available" ? "default" : row.status === "Damaged" ? "destructive" : "secondary"}>
                {row.status}
              </Badge>
            ),
          },
          {
            header: "Actions",
            accessor: () => (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Edit</Button>
            ),
          },
        ]}
        data={books}
      />

      <BookDetailDialog
        open={!!selectedBook}
        onOpenChange={(open) => !open && setSelectedBook(null)}
        book={selectedBook}
      />
    </DashboardLayout>
  );
};

export default BookCatalog;
