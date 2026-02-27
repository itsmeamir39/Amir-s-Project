import { useState } from "react";
import { Search, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: "available" | "checked-out" | "reserved" | "maintenance";
  category: string;
  dateAdded: string;
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    status: "available",
    category: "Classic Literature",
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    status: "checked-out",
    category: "Classic Literature",
    dateAdded: "2024-01-10",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    status: "available",
    category: "Science Fiction",
    dateAdded: "2024-02-01",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    status: "reserved",
    category: "Romance",
    dateAdded: "2024-01-20",
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0-547-92822-7",
    status: "available",
    category: "Fantasy",
    dateAdded: "2024-02-10",
  },
  {
    id: "6",
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "978-0-06-085052-4",
    status: "maintenance",
    category: "Science Fiction",
    dateAdded: "2024-01-05",
  },
  {
    id: "7",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    status: "available",
    category: "Classic Literature",
    dateAdded: "2024-02-15",
  },
  {
    id: "8",
    title: "Lord of the Flies",
    author: "William Golding",
    isbn: "978-0-399-50148-7",
    status: "checked-out",
    category: "Classic Literature",
    dateAdded: "2024-01-25",
  },
];

export function BookInventoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books] = useState<Book[]>(mockBooks);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
  );

  const getStatusBadge = (status: Book["status"]) => {
    const variants = {
      available: "bg-emerald-100 text-emerald-700 border-emerald-200",
      "checked-out": "bg-amber-100 text-amber-700 border-amber-200",
      reserved: "bg-blue-100 text-blue-700 border-blue-200",
      maintenance: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const labels = {
      available: "Available",
      "checked-out": "Checked Out",
      reserved: "Reserved",
      maintenance: "Maintenance",
    };

    return (
      <Badge className={`${variants[status]} border font-normal`} variant="outline">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="font-semibold text-foreground">Author</TableHead>
              <TableHead className="font-semibold text-foreground">ISBN</TableHead>
              <TableHead className="font-semibold text-foreground">Category</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Date Added</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell className="text-muted-foreground">{book.author}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {book.isbn}
                </TableCell>
                <TableCell className="text-muted-foreground">{book.category}</TableCell>
                <TableCell>{getStatusBadge(book.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(book.dateAdded).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-muted rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
}
