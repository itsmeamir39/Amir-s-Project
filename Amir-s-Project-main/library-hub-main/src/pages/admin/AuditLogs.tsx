import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { adminNav } from "@/lib/navigation";

const logs = [
  { id: 1, user: "Admin", action: "Updated fine rules", timestamp: "2026-03-09 10:30", ip: "192.168.1.1" },
  { id: 2, user: "Jane Smith", action: "Issued book #1234", timestamp: "2026-03-09 10:15", ip: "192.168.1.5" },
  { id: 3, user: "Admin", action: "Added new user", timestamp: "2026-03-09 09:45", ip: "192.168.1.1" },
  { id: 4, user: "Jane Smith", action: "Returned book #5678", timestamp: "2026-03-09 09:20", ip: "192.168.1.5" },
  { id: 5, user: "Admin", action: "Updated system settings", timestamp: "2026-03-08 16:00", ip: "192.168.1.1" },
];

const AuditLogs = () => (
  <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
    <PageHeader title="Audit Logs" description="Track system activity and changes" />
    <DataTable
      columns={[
        { header: "User", accessor: "user" },
        { header: "Action", accessor: "action" },
        { header: "Timestamp", accessor: "timestamp", className: "font-mono text-sm" },
        { header: "IP Address", accessor: "ip", className: "font-mono text-sm text-muted-foreground" },
      ]}
      data={logs}
    />
  </DashboardLayout>
);

export default AuditLogs;
