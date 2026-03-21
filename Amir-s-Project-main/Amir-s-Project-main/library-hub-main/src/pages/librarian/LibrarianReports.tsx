import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { ArrowLeftRight, CheckCircle, DollarSign } from "lucide-react";
import { librarianNav } from "@/lib/navigation";
import { BorrowingTrendChart, OverdueTrendChart, FineCollectionChart } from "@/components/AnalyticsCharts";

const LibrarianReports = () => (
  <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
    <PageHeader title="Reports" description="Daily transaction and fine reports" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard title="Daily Transactions" value="30" icon={ArrowLeftRight} delay={0} />
      <StatCard title="Returns Processed" value="12" icon={CheckCircle} delay={0.05} />
      <StatCard title="Fines Collected" value="$85" icon={DollarSign} delay={0.1} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <BorrowingTrendChart />
      <OverdueTrendChart />
    </div>
    <FineCollectionChart />
  </DashboardLayout>
);

export default LibrarianReports;
