import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { patronNav } from "@/lib/navigation";

const history = [
  { id: 1, title: "Atomic Habits", issueDate: "2026-01-10", returnDate: "2026-01-24" },
  { id: 2, title: "1984", issueDate: "2025-12-05", returnDate: "2025-12-19" },
  { id: 3, title: "The Alchemist", issueDate: "2025-11-15", returnDate: "2025-11-29" },
  { id: 4, title: "Thinking, Fast and Slow", issueDate: "2025-10-01", returnDate: "2025-10-15" },
];

const BorrowingHistory = () => (
  <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
    <PageHeader title="Borrowing History" description="Your past borrowed books" />
    <DataTable
      columns={[
        { header: "Book", accessor: "title" },
        { header: "Issue Date", accessor: "issueDate" },
        { header: "Return Date", accessor: "returnDate" },
      ]}
      data={history}
    />
  </DashboardLayout>
);

export default BorrowingHistory;
