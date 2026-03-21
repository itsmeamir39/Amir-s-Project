import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BarcodeScanner from "./BarcodeScanner";
import { toast } from "@/hooks/use-toast";

export interface BookFormData {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  category: string;
}

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: BookFormData | null;
  onSubmit: (data: BookFormData) => void;
}

const categories = ["Software", "Fiction", "Non-Fiction", "Self-Help", "Science", "History", "Biography", "Children"];

const emptyBook: BookFormData = { title: "", author: "", isbn: "", copies: 1, available: 1, category: "" };

const BookFormDialog = ({ open, onOpenChange, book, onSubmit }: BookFormDialogProps) => {
  const [form, setForm] = useState<BookFormData>(emptyBook);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!book?.id;

  useEffect(() => {
    if (open) {
      setForm(book ? { ...book } : { ...emptyBook });
      setErrors({});
    }
  }, [open, book]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.isbn.trim()) e.isbn = "ISBN is required";
    if (form.isbn.trim() && !/^[\d-]{10,17}$/.test(form.isbn.trim())) e.isbn = "Invalid ISBN format";
    if (!form.category) e.category = "Category is required";
    if (form.copies < 1) e.copies = "At least 1 copy required";
    if (form.available < 0) e.available = "Cannot be negative";
    if (form.available > form.copies) e.available = "Cannot exceed total copies";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, id: book?.id || Date.now() });
    toast({ title: isEdit ? "Book Updated" : "Book Added", description: `"${form.title}" has been ${isEdit ? "updated" : "added"} successfully.` });
    onOpenChange(false);
  };

  const handleBarcodeScan = (barcode: string) => {
    setForm(prev => ({ ...prev, isbn: barcode }));
    // Simulate auto-fill from barcode lookup
    if (!form.title) {
      setForm(prev => ({ ...prev, isbn: barcode, title: "Scanned Book Title", author: "Auto-detected Author", category: "Software" }));
      toast({ title: "Book Found", description: "Book details auto-filled from barcode database." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>ISBN / Barcode</Label>
            <BarcodeScanner
              onScan={handleBarcodeScan}
              value={form.isbn}
              onChange={(v) => setForm(prev => ({ ...prev, isbn: v }))}
              placeholder="Scan barcode or enter ISBN..."
            />
            {errors.isbn && <p className="text-sm text-destructive">{errors.isbn}</p>}
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Book title" />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <Label>Author</Label>
            <Input value={form.author} onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))} placeholder="Author name" />
            {errors.author && <p className="text-sm text-destructive">{errors.author}</p>}
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Copies</Label>
              <Input type="number" min={1} value={form.copies} onChange={(e) => setForm(prev => ({ ...prev, copies: parseInt(e.target.value) || 0 }))} />
              {errors.copies && <p className="text-sm text-destructive">{errors.copies}</p>}
            </div>
            <div className="space-y-2">
              <Label>Available</Label>
              <Input type="number" min={0} value={form.available} onChange={(e) => setForm(prev => ({ ...prev, available: parseInt(e.target.value) || 0 }))} />
              {errors.available && <p className="text-sm text-destructive">{errors.available}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isEdit ? "Save Changes" : "Add Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;
