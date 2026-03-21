"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { adminNav } from "@/lib/navigation";
import { AlertTriangle, ArrowLeftRight, BookCopy, Users } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader title="Admin Dashboard" description="Overview of library operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Books" value="TODO" icon={BookCopy} delay={0} />
        <StatCard title="Active Patrons" value="TODO" icon={Users} delay={0.05} />
        <StatCard title="Books Issued" value="TODO" icon={ArrowLeftRight} delay={0.1} />
        <StatCard title="Overdue" value="TODO" icon={AlertTriangle} delay={0.15} />
      </div>

      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          TODO: Port the full Library Hub admin dashboard (recent activity, quick actions) and wire stats to Supabase.
        </p>
      </div>
    </DashboardLayout>
  );
}

