"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { librarianNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { ArrowLeftRight, CalendarCheck, BookOpen } from "lucide-react";

export default function LibrarianDashboardPage() {
  const [stats, setStats] = useState({ catalog: 0, activeLoans: 0, pendingHolds: 0 });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const run = async () => {
      const [catalog, activeLoans, pendingHolds] = await Promise.all([
        supabase.from("biblios").select("id", { head: true, count: "exact" }),
        supabase.from("loans").select("id", { head: true, count: "exact" }).eq("status", "borrowed"),
        supabase.from("holds").select("id", { head: true, count: "exact" }).eq("status", "pending"),
      ]);
      setStats({
        catalog: catalog.count ?? 0,
        activeLoans: activeLoans.count ?? 0,
        pendingHolds: pendingHolds.count ?? 0,
      });
    };
    void run();
  }, []);

  return (
    <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
      <PageHeader title="Librarian Dashboard" description="Daily circulation overview" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Catalog Titles" value={stats.catalog} icon={BookOpen} delay={0} />
        <StatCard title="Active Loans" value={stats.activeLoans} icon={ArrowLeftRight} delay={0.05} />
        <StatCard title="Pending Holds" value={stats.pendingHolds} icon={CalendarCheck} delay={0.1} />
      </div>
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Librarian metrics are connected to live circulation and hold data.</p>
      </div>
    </DashboardLayout>
  );
}

