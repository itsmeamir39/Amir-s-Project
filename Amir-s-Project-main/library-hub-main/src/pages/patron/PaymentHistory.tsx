import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { patronNav } from "@/lib/navigation";

const paymentHistory = [
  { id: 1, date: "2026-03-10", book: "The Great Gatsby", amount: "₹83.00", method: "UPI", status: "Completed", transactionId: "TXN20260310001" },
  { id: 2, date: "2026-02-25", book: "Clean Code", amount: "₹125.00", method: "Debit Card", status: "Completed", transactionId: "TXN20260225002" },
  { id: 3, date: "2026-02-14", book: "Sapiens", amount: "₹42.00", method: "UPI", status: "Completed", transactionId: "TXN20260214003" },
  { id: 4, date: "2026-01-30", book: "Design Patterns", amount: "₹208.00", method: "Credit Card", status: "Completed", transactionId: "TXN20260130004" },
  { id: 5, date: "2026-01-12", book: "1984", amount: "₹62.00", method: "UPI", status: "Failed", transactionId: "TXN20260112005" },
];

const PaymentHistory = () => {
  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Payment History" description="View all your past fine payments" />
      <DataTable
        columns={[
          { header: "Date", accessor: "date" },
          { header: "Book", accessor: "book" },
          { header: "Amount", accessor: "amount" },
          { header: "Method", accessor: (row) => (
            <Badge variant="secondary">{row.method}</Badge>
          )},
          { header: "Transaction ID", accessor: (row) => (
            <span className="font-mono text-xs text-muted-foreground">{row.transactionId}</span>
          )},
          {
            header: "Status",
            accessor: (row) => (
              <Badge variant={row.status === "Completed" ? "default" : "destructive"}>{row.status}</Badge>
            ),
          },
        ]}
        data={paymentHistory}
      />
    </DashboardLayout>
  );
};

export default PaymentHistory;
