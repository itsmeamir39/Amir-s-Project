"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { adminNav } from "@/lib/navigation";
import { AlertTriangle, ArrowLeftRight, BookCopy, Users } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ books: 0, patrons: 0, loans: 0, overdue: 0 });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const run = async () => {
      const [books, patrons, loans, overdue] = await Promise.all([
        supabase.from("biblios").select("id", { head: true, count: "exact" }),
        supabase.from("users").select("id", { head: true, count: "exact" }).eq("role", "Patron"),
        supabase.from("loans").select("id", { head: true, count: "exact" }).eq("status", "borrowed"),
        supabase.from("loans").select("id", { head: true, count: "exact" }).lt("due_date", new Date().toISOString()),
      ]);
      setStats({
        books: books.count ?? 0,
        patrons: patrons.count ?? 0,
        loans: loans.count ?? 0,
        overdue: overdue.count ?? 0,
      });
    };
    void run();
  }, []);

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader title="Admin Dashboard" description="Overview of library operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Books" value={stats.books} icon={BookCopy} delay={0} />
        <StatCard title="Active Patrons" value={stats.patrons} icon={Users} delay={0.05} />
        <StatCard title="Books Issued" value={stats.loans} icon={ArrowLeftRight} delay={0.1} />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} delay={0.15} />
      </div>

      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Admin metrics are now live from Supabase and update on page load.</p>
      </div>
    </DashboardLayout>
  );
}

