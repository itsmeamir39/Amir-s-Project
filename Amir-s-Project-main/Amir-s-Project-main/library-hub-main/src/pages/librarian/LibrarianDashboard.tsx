import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { librarianNav } from "@/lib/navigation";
import { BookCopy, AlertTriangle, CheckCircle } from "lucide-react";

const todayTransactions = [
  { id: 1, type: "Issue", book: "Clean Code", patron: "John Doe", time: "09:15 AM" },
  { id: 2, type: "Return", book: "Sapiens", patron: "Sarah Connor", time: "10:30 AM" },
  { id: 3, type: "Issue", book: "Atomic Habits", patron: "Mike Ross", time: "11:00 AM" },
  { id: 4, type: "Return", book: "The Great Gatsby", patron: "Lisa Ray", time: "01:45 PM" },
];

const LibrarianDashboard = () => (
  <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
    <PageHeader title="Librarian Dashboard" description="Today's overview" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard title="Issued Today" value="18" icon={BookCopy} trend="+3 from yesterday" trendUp delay={0} />
      <StatCard title="Returns Today" value="12" icon={CheckCircle} delay={0.05} />
      <StatCard title="Overdue Books" value="37" icon={AlertTriangle} trend="5 critical" delay={0.1} />
    </div>
    <h2 className="text-lg font-display font-semibold text-foreground mb-4">Today's Transactions</h2>
    <DataTable
      columns={[
        {
          header: "Type",
          accessor: (row) => <Badge variant={row.type === "Issue" ? "default" : "secondary"}>{row.type}</Badge>,
        },
        { header: "Book", accessor: "book" },
        { header: "Patron", accessor: "patron" },
        { header: "Time", accessor: "time", className: "text-muted-foreground" },
      ]}
      data={todayTransactions}
    />
  </DashboardLayout>
);

export default LibrarianDashboard;
