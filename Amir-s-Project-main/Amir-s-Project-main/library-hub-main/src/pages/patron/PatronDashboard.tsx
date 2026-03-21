import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { BookCopy, CalendarCheck, AlertTriangle } from "lucide-react";
import { patronNav } from "@/lib/navigation";

const borrowedBooks = [
  { id: 1, title: "Clean Code", dueDate: "2026-03-15", status: "Active" },
  { id: 2, title: "Sapiens", dueDate: "2026-03-19", status: "Active" },
  { id: 3, title: "Design Patterns", dueDate: "2026-03-06", status: "Overdue" },
];

const PatronDashboard = () => (
  <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
    <PageHeader title="My Dashboard" description="Welcome back, John" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard title="Books Borrowed" value="3" icon={BookCopy} delay={0} />
      <StatCard title="Reservations" value="1" icon={CalendarCheck} delay={0.05} />
      <StatCard title="Pending Fines" value="$2.50" icon={AlertTriangle} delay={0.1} />
    </div>
    <h2 className="text-lg font-display font-semibold text-foreground mb-4">Currently Borrowed</h2>
    <DataTable
      columns={[
        { header: "Book", accessor: "title" },
        { header: "Due Date", accessor: "dueDate" },
        {
          header: "Status",
          accessor: (row) => (
            <Badge variant={row.status === "Overdue" ? "destructive" : "default"}>{row.status}</Badge>
          ),
        },
      ]}
      data={borrowedBooks}
    />
  </DashboardLayout>
);

export default PatronDashboard;
