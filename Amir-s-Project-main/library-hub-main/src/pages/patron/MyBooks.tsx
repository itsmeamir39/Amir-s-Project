import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patronNav } from "@/lib/navigation";

const myBooks = [
  { id: 1, title: "Clean Code", issueDate: "2026-03-01", dueDate: "2026-03-15", status: "Active" },
  { id: 2, title: "Sapiens", issueDate: "2026-03-05", dueDate: "2026-03-19", status: "Active" },
  { id: 3, title: "Design Patterns", issueDate: "2026-02-20", dueDate: "2026-03-06", status: "Overdue" },
];

const MyBooks = () => (
  <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
    <PageHeader title="My Borrowed Books" description="Books currently checked out" />
    <DataTable
      columns={[
        { header: "Book", accessor: "title" },
        { header: "Issue Date", accessor: "issueDate" },
        { header: "Due Date", accessor: "dueDate" },
        {
          header: "Status",
          accessor: (row) => <Badge variant={row.status === "Overdue" ? "destructive" : "default"}>{row.status}</Badge>,
        },
        {
          header: "Actions",
          accessor: (row) => row.status === "Active" ? (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Request Renewal</Button>
          ) : null,
        },
      ]}
      data={myBooks}
    />
  </DashboardLayout>
);

export default MyBooks;
