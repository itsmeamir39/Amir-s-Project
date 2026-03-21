import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patronNav } from "@/lib/navigation";

const reservations = [
  { id: 1, book: "Design Patterns", date: "2026-03-07", position: 1, status: "Pending" },
  { id: 2, book: "The Pragmatic Programmer", date: "2026-03-08", position: 3, status: "Pending" },
];

const PatronReservations = () => (
  <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
    <PageHeader title="My Reservations" description="Track your book reservations" />
    <DataTable
      columns={[
        { header: "Book", accessor: "book" },
        { header: "Reserved On", accessor: "date" },
        { header: "Queue Position", accessor: "position" },
        {
          header: "Status",
          accessor: (row) => <Badge variant="secondary">{row.status}</Badge>,
        },
        {
          header: "Actions",
          accessor: () => (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">Cancel</Button>
          ),
        },
      ]}
      data={reservations}
    />
  </DashboardLayout>
);

export default PatronReservations;
