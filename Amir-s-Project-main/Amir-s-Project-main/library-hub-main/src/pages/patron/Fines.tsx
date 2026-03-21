import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patronNav } from "@/lib/navigation";
import PaymentDialog from "@/components/PaymentDialog";

const initialFines = [
  { id: 1, book: "Design Patterns", amount: "$2.50", daysOverdue: 5, status: "Unpaid" },
  { id: 2, book: "The Great Gatsby", amount: "$1.00", daysOverdue: 2, status: "Paid" },
];

const Fines = () => {
  const [fines, setFines] = useState(initialFines);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<typeof initialFines[0] | null>(null);

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Fines" description="View and pay outstanding fines" />
      <DataTable
        columns={[
          { header: "Book", accessor: "book" },
          { header: "Amount", accessor: "amount" },
          { header: "Days Overdue", accessor: "daysOverdue" },
          {
            header: "Status",
            accessor: (row) => (
              <Badge variant={row.status === "Unpaid" ? "destructive" : "secondary"}>{row.status}</Badge>
            ),
          },
          {
            header: "Actions",
            accessor: (row) => row.status === "Unpaid" ? (
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setPayTarget(row); setPaymentOpen(true); }}>
                Pay Now
              </Button>
            ) : null,
          },
        ]}
        data={fines}
      />

      {payTarget && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          amount={payTarget.amount}
          bookTitle={payTarget.book}
          onSuccess={() => {
            setFines(prev => prev.map(f => f.id === payTarget.id ? { ...f, status: "Paid" } : f));
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Fines;
