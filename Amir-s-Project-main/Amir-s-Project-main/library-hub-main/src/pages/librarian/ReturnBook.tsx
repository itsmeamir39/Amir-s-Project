import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { librarianNav } from "@/lib/navigation";
import BarcodeScanner from "@/components/BarcodeScanner";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Barcode from "react-barcode";

const patronDb: Record<string, { name: string; email: string; barcode: string }> = {
  LIB00000001: { name: "John Doe", email: "john@library.com", barcode: "LIB00000001" },
  LIB00000002: { name: "Jane Smith", email: "jane@library.com", barcode: "LIB00000002" },
  LIB00000003: { name: "Mike Ross", email: "mike@library.com", barcode: "LIB00000003" },
  LIB00000004: { name: "Sarah Connor", email: "sarah@library.com", barcode: "LIB00000004" },
};

const ReturnBook = () => {
  const [bookBarcode, setBookBarcode] = useState("");
  const [patronBarcode, setPatronBarcode] = useState("");
  const [txInfo, setTxInfo] = useState<{ title: string; dueDate: string } | null>(null);
  const [patronInfo, setPatronInfo] = useState<{ name: string; email: string; barcode: string } | null>(null);

  const handleBookScan = (code: string) => {
    setBookBarcode(code);
    setTxInfo({ title: "Clean Code", dueDate: "2026-03-15" });
    toast({ title: "Transaction Found", description: `"Clean Code" — due 2026-03-15` });
  };

  const handlePatronScan = (code: string) => {
    setPatronBarcode(code);
    const patron = patronDb[code.trim()];
    if (patron) {
      setPatronInfo(patron);
      toast({ title: "Patron Verified", description: patron.name });
    } else {
      setPatronInfo(null);
      toast({ title: "Not Found", description: "No patron found with that barcode.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
      <PageHeader title="Return Book" description="Process a book return" />
      <div className="max-w-xl space-y-6">
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Book Barcode / ISBN</Label>
            <BarcodeScanner onScan={handleBookScan} value={bookBarcode} onChange={setBookBarcode} />
          </div>
          {txInfo && (
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-1">
              <p className="font-medium text-foreground">{txInfo.title}</p>
              <p className="text-sm text-muted-foreground">Due: {txInfo.dueDate}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-foreground">Patron Member Barcode</Label>
            <BarcodeScanner onScan={handlePatronScan} value={patronBarcode} onChange={setPatronBarcode} placeholder="Scan patron member barcode..." />
          </div>
          {patronInfo && (
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-2">
              <p className="font-medium text-foreground">{patronInfo.name}</p>
              <p className="text-sm text-muted-foreground">{patronInfo.email}</p>
              <div className="flex justify-center pt-1">
                <Barcode value={patronInfo.barcode} width={1.5} height={40} fontSize={12} background="transparent" lineColor="currentColor" />
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            Scan the book barcode and patron member barcode to process the return.
          </div>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
            disabled={!txInfo || !patronInfo}
            onClick={() => toast({ title: "Book Returned", description: "Return processed successfully." })}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Process Return
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReturnBook;
