import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { adminNav } from "@/lib/navigation";
import BookFormDialog, { type BookFormData } from "@/components/BookFormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";

interface BookRow extends BookFormData {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  category: string;
}

const initialBooks: BookRow[] = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", copies: 5, available: 3, category: "Software" },
  { id: 2, title: "Design Patterns", author: "Gang of Four", isbn: "978-0201633610", copies: 3, available: 0, category: "Software" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", copies: 8, available: 6, category: "Fiction" },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", copies: 4, available: 2, category: "Non-Fiction" },
  { id: 5, title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", copies: 6, available: 4, category: "Self-Help" },
];

const BookManagement = () => {
  const [books, setBooks] = useState<BookRow[]>(initialBooks);
  const [formOpen, setFormOpen] = useState(false);
  const [editBook, setEditBook] = useState<BookFormData | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookRow | null>(null);
  const [search, setSearch] = useState("");

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn.includes(search)
  );

  const handleSubmit = (data: BookFormData) => {
    if (editBook) {
      setBooks(prev => prev.map(b => b.id === data.id ? { ...data, id: data.id, title: data.title || "", author: data.author || "", isbn: data.isbn || "", copies: data.copies || 0, available: data.available || 0, category: data.category || "" } : b));
    } else {
      const newBook: BookRow = {
        ...data,
        id: Math.max(...books.map(b => b.id)) + 1,
        title: data.title || "",
        author: data.author || "",
        isbn: data.isbn || "",
        copies: data.copies || 0,
        available: data.available || 0,
        category: data.category || "",
      };
      setBooks(prev => [...prev, newBook]);
    }
  };

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader
        title="Book Management"
        description="Manage the library book catalog"
        actions={
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditBook(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Book
          </Button>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search books..." className="pl-10 bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <DataTable
        columns={[
          { header: "Title", accessor: (row: BookRow) => row.title },
          { header: "Author", accessor: (row: BookRow) => row.author },
          { header: "ISBN", accessor: (row: BookRow) => row.isbn, className: "font-mono text-sm" },
          { header: "Category", accessor: (row: BookRow) => <Badge variant="secondary">{row.category}</Badge> },
          {
            header: "Availability",
            accessor: (row: BookRow) => (
              <span className={row.available > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                {row.available}/{row.copies}
              </span>
            ),
          },
          {
            header: "Actions",
            accessor: (row: BookRow) => (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => { setEditBook(row); setFormOpen(true); }}>Edit</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => { setDeleteTarget(row); setDeleteOpen(true); }}>Delete</Button>
              </div>
            ),
          },
        ]}
        data={filtered}
      />

      <BookFormDialog open={formOpen} onOpenChange={setFormOpen} book={editBook} onSubmit={handleSubmit} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteTarget) {
            setBooks(prev => prev.filter(b => b.id !== deleteTarget.id));
            toast({ title: "Book Deleted", description: `"${deleteTarget.title}" has been removed.` });
          }
        }}
      />
    </DashboardLayout>
  );
};

export default BookManagement;
