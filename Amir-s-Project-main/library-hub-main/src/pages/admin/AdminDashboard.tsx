import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  BookOpen, ArrowLeftRight, BookCopy, UserPlus,
  AlertTriangle, TrendingUp, Users
} from "lucide-react";
import { adminNav } from "@/lib/navigation";

const recentActivity = [
  { id: 1, action: "Book issued", details: "\"Clean Code\" to John Doe", time: "2 min ago" },
  { id: 2, action: "Book returned", details: "\"Design Patterns\" by Jane Smith", time: "15 min ago" },
  { id: 3, action: "New user", details: "Sarah Connor registered", time: "1 hr ago" },
  { id: 4, action: "Fine paid", details: "$5.00 by Mike Ross", time: "2 hrs ago" },
  { id: 5, action: "Reservation", details: "\"The Pragmatic Programmer\" by Alex", time: "3 hrs ago" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: "Add New Book", icon: BookOpen, path: "/admin/books" },
    { label: "Register User", icon: UserPlus, path: "/admin/users" },
    { label: "Issue Book", icon: ArrowLeftRight, path: "/admin/transactions" },
    { label: "View Reports", icon: TrendingUp, path: "/admin/reports" },
  ];

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader title="Admin Dashboard" description="Overview of library operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Books" value="12,847" icon={BookCopy} trend="+124 this month" trendUp delay={0} />
        <StatCard title="Active Patrons" value="3,261" icon={Users} trend="+48 this week" trendUp delay={0.05} />
        <StatCard title="Books Issued" value="892" icon={ArrowLeftRight} trend="142 today" trendUp delay={0.1} />
        <StatCard title="Overdue" value="37" icon={AlertTriangle} trend="-5 from yesterday" trendUp delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Recent Activity</h2>
          <DataTable
            columns={[
              { header: "Action", accessor: "action" },
              { header: "Details", accessor: "details" },
              { header: "Time", accessor: "time", className: "text-muted-foreground text-sm" },
            ]}
            data={recentActivity}
          />
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-accent/40 hover:bg-accent/5 transition-all text-left"
              >
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium text-sm text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
