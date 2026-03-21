import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { BookOpen, BookCopy, AlertTriangle, DollarSign } from "lucide-react";
import { adminNav } from "@/lib/navigation";
import { BorrowingTrendChart, CategoryChart, OverdueTrendChart, UserActivityChart, FineCollectionChart } from "@/components/AnalyticsCharts";

const Reports = () => (
  <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
    <PageHeader title="Reports & Analytics" description="Library performance insights" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Books Issued Today" value="42" icon={BookOpen} delay={0} />
      <StatCard title="Total Inventory" value="12,847" icon={BookCopy} delay={0.05} />
      <StatCard title="Overdue Books" value="37" icon={AlertTriangle} delay={0.1} />
      <StatCard title="Fines Collected" value="$1,240" icon={DollarSign} delay={0.15} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <BorrowingTrendChart />
      <CategoryChart />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <OverdueTrendChart />
      <UserActivityChart />
    </div>
    <FineCollectionChart />
  </DashboardLayout>
);

export default Reports;
