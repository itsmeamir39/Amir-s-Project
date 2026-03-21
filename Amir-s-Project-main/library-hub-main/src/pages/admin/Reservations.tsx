import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminNav } from "@/lib/navigation";

const reservations = [
  { id: 1, book: "Design Patterns", patron: "Alex Turner", date: "2026-03-07", position: 1, status: "Pending" },
  { id: 2, book: "Clean Code", patron: "Lisa Ray", date: "2026-03-08", position: 2, status: "Pending" },
  { id: 3, book: "Atomic Habits", patron: "Tom Hardy", date: "2026-03-06", position: 1, status: "Ready" },
];

const Reservations = () => (
  <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
    <PageHeader title="Reservations" description="Manage book reservation queue" />
    <DataTable
      columns={[
        { header: "Book", accessor: "book" },
        { header: "Patron", accessor: "patron" },
        { header: "Date", accessor: "date" },
        { header: "Queue #", accessor: "position" },
        {
          header: "Status",
          accessor: (row) => (
            <Badge variant={row.status === "Ready" ? "default" : "secondary"}>{row.status}</Badge>
          ),
        },
        {
          header: "Actions",
          accessor: (row) => (
            <div className="flex gap-2">
              {row.status === "Pending" && <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Approve</Button>}
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">Cancel</Button>
            </div>
          ),
        },
      ]}
      data={reservations}
    />
  </DashboardLayout>
);

export default Reservations;
