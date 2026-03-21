import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, CheckCircle } from "lucide-react";
import { adminNav } from "@/lib/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import BarcodeScanner from "@/components/BarcodeScanner";
import Barcode from "react-barcode";
import { toast } from "@/hooks/use-toast";

const patronDb: Record<string, { name: string; email: string; barcode: string }> = {
  LIB00000001: { name: "John Doe", email: "john@library.com", barcode: "LIB00000001" },
  LIB00000002: { name: "Jane Smith", email: "jane@library.com", barcode: "LIB00000002" },
  LIB00000003: { name: "Mike Ross", email: "mike@library.com", barcode: "LIB00000003" },
  LIB00000004: { name: "Sarah Connor", email: "sarah@library.com", barcode: "LIB00000004" },
};

const bookDb: Record<string, { title: string; author: string }> = {
  "978-0132350884": { title: "Clean Code", author: "Robert C. Martin" },
  "9780132350884": { title: "Clean Code", author: "Robert C. Martin" },
  "978-0201633610": { title: "Design Patterns", author: "Gang of Four" },
  "9780201633610": { title: "Design Patterns", author: "Gang of Four" },
  "978-0743273565": { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  "9780743273565": { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  "978-0062316097": { title: "Sapiens", author: "Yuval Noah Harari" },
  "9780062316097": { title: "Sapiens", author: "Yuval Noah Harari" },
  "978-0735211292": { title: "Atomic Habits", author: "James Clear" },
  "9780735211292": { title: "Atomic Habits", author: "James Clear" },
};

const initialTransactions = [
  { id: 1, book: "Clean Code", patron: "John Doe", issueDate: "2026-03-01", dueDate: "2026-03-15", status: "Active" },
  { id: 2, book: "Design Patterns", patron: "Jane Smith", issueDate: "2026-02-20", dueDate: "2026-03-06", status: "Overdue" },
  { id: 3, book: "Sapiens", patron: "Mike Ross", issueDate: "2026-03-05", dueDate: "2026-03-19", status: "Active" },
  { id: 4, book: "The Great Gatsby", patron: "Sarah Connor", issueDate: "2026-02-28", dueDate: "2026-03-14", status: "Returned" },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [issueOpen, setIssueOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState<typeof initialTransactions[0] | null>(null);

  // Issue book state
  const [bookBarcode, setBookBarcode] = useState("");
  const [patronBarcode, setPatronBarcode] = useState("");
  const [bookInfo, setBookInfo] = useState<{ title: string; author: string } | null>(null);
  const [patronInfo, setPatronInfo] = useState<{ name: string; email: string; barcode: string } | null>(null);

  const resetIssueForm = () => {
    setBookBarcode("");
    setPatronBarcode("");
    setBookInfo(null);
    setPatronInfo(null);
  };

  const handleBookScan = (code: string) => {
    setBookBarcode(code);
    const book = bookDb[code.trim()];
    if (book) {
      setBookInfo(book);
      toast({ title: "Book Found", description: `"${book.title}" by ${book.author}` });
    } else {
      setBookInfo(null);
      toast({ title: "Not Found", description: "No book found with that ISBN.", variant: "destructive" });
    }
  };

  const handlePatronScan = (code: string) => {
    setPatronBarcode(code);
    const patron = patronDb[code.trim()];
    if (patron) {
      setPatronInfo(patron);
      toast({ title: "Patron Found", description: patron.name });
    } else {
      setPatronInfo(null);
      toast({ title: "Not Found", description: "No patron found with that barcode.", variant: "destructive" });
    }
  };

  const handleIssue = () => {
    if (!bookInfo || !patronInfo) return;
    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);
    const newTx = {
      id: transactions.length + 1,
      book: bookInfo.title,
      patron: patronInfo.name,
      issueDate: today.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      status: "Active",
    };
    setTransactions(prev => [newTx, ...prev]);
    toast({ title: "Book Issued", description: `"${bookInfo.title}" issued to ${patronInfo.name}` });
    setIssueOpen(false);
    resetIssueForm();
  };

  const handleReturn = () => {
    if (!returnTarget) return;
    setTransactions(prev =>
      prev.map(tx => tx.id === returnTarget.id ? { ...tx, status: "Returned" } : tx)
    );
    toast({ title: "Book Returned", description: `"${returnTarget.book}" returned successfully.` });
    setReturnOpen(false);
    setReturnTarget(null);
  };

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader title="Issue & Return" description="Manage book transactions" actions={
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { resetIssueForm(); setIssueOpen(true); }}>
          <ArrowLeftRight className="h-4 w-4 mr-2" /> Issue Book
        </Button>
      } />
      <DataTable
        columns={[
          { header: "Book", accessor: "book" },
          { header: "Patron", accessor: "patron" },
          { header: "Issue Date", accessor: "issueDate" },
          { header: "Due Date", accessor: "dueDate" },
          {
            header: "Status",
            accessor: (row) => (
              <Badge variant={row.status === "Overdue" ? "destructive" : row.status === "Returned" ? "secondary" : "default"}>
                {row.status}
              </Badge>
            ),
          },
          {
            header: "Actions",
            accessor: (row) => row.status !== "Returned" ? (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => { setReturnTarget(row); setReturnOpen(true); }}>
                {row.status === "Overdue" ? "Record Return" : "Return"}
              </Button>
            ) : null,
          },
        ]}
        data={transactions}
      />

      {/* Issue Book Dialog */}
      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Issue Book</DialogTitle>
            <DialogDescription>Scan or enter the book ISBN and patron barcode to issue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Book Barcode / ISBN</Label>
              <BarcodeScanner onScan={handleBookScan} value={bookBarcode} onChange={setBookBarcode} />
            </div>
            {bookInfo && (
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                <p className="font-medium text-foreground">{bookInfo.title}</p>
                <p className="text-sm text-muted-foreground">{bookInfo.author}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-foreground">Patron Member Barcode</Label>
              <BarcodeScanner onScan={handlePatronScan} value={patronBarcode} onChange={setPatronBarcode} placeholder="Scan patron member barcode..." />
            </div>
            {patronInfo && (
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 space-y-2">
                <p className="font-medium text-foreground">{patronInfo.name}</p>
                <p className="text-sm text-muted-foreground">{patronInfo.email}</p>
                <div className="flex justify-center pt-1">
                  <Barcode value={patronInfo.barcode} width={1.5} height={40} fontSize={12} background="transparent" lineColor="currentColor" />
                </div>
              </div>
            )}
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full" disabled={!bookInfo || !patronInfo} onClick={handleIssue}>
              <ArrowLeftRight className="h-4 w-4 mr-2" /> Issue Book
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Confirmation Dialog */}
      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Return</DialogTitle>
            <DialogDescription>Process the return for this transaction.</DialogDescription>
          </DialogHeader>
          {returnTarget && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="font-medium text-foreground">{returnTarget.book}</p>
                <p className="text-sm text-muted-foreground">Patron: {returnTarget.patron}</p>
                <p className="text-sm text-muted-foreground">Due: {returnTarget.dueDate}</p>
                {returnTarget.status === "Overdue" && (
                  <Badge variant="destructive" className="mt-1">Overdue</Badge>
                )}
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full" onClick={handleReturn}>
                <CheckCircle className="h-4 w-4 mr-2" /> Confirm Return
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transactions;
