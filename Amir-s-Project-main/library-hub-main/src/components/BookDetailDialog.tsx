import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, BookOpen, Hash, Layers, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBookByISBN, type GoogleBookInfo } from "@/lib/googleBooks";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  available?: number;
  copies?: number;
  shelf?: string;
  status?: string;
}

interface BookDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
}

const BookDetailDialog = ({ open, onOpenChange, book }: BookDetailDialogProps) => {
  const [googleInfo, setGoogleInfo] = useState<GoogleBookInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && book?.isbn) {
      setLoading(true);
      setGoogleInfo(null);
      fetchBookByISBN(book.isbn).then((info) => {
        setGoogleInfo(info);
        setLoading(false);
      });
    } else {
      setGoogleInfo(null);
    }
  }, [open, book?.isbn]);

  if (!book) return null;

  const availableCount = book.available ?? book.copies ?? 0;
  const coverUrl = googleInfo?.thumbnail;
  const description = googleInfo?.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-display">Book Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh]">
          <div className="flex flex-col items-center gap-5 py-2 pr-3">
            {loading ? (
              <div className="w-40 h-56 rounded-lg bg-muted flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : coverUrl ? (
              <img src={coverUrl} alt={`${book.title} cover`} className="w-40 h-56 rounded-lg shadow-xl object-cover" />
            ) : (
              <div className="relative w-40 h-56 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 shadow-xl flex flex-col items-center justify-center p-4 text-center">
                <BookOpen className="h-8 w-8 text-white/40 mb-3" />
                <h3 className="text-sm font-bold text-white leading-tight">{book.title}</h3>
                <p className="text-xs text-white/70 mt-1">{book.author}</p>
              </div>
            )}

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-semibold text-foreground">{book.title}</h2>
                {book.category && <Badge variant="secondary">{book.category}</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>{book.author}</span>
                </div>
                {book.isbn && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="font-mono text-xs">{book.isbn}</span>
                  </div>
                )}
                {book.shelf && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>Shelf {book.shelf}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4 shrink-0" />
                  <span>{availableCount} available</span>
                </div>
              </div>

              {description && (
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-foreground">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              )}

              {book.status && (
                <Badge variant={book.status === "Available" ? "default" : book.status === "Damaged" ? "destructive" : "secondary"}>
                  {book.status}
                </Badge>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailDialog;
