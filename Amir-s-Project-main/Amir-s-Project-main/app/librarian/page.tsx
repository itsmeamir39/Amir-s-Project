"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { librarianNav } from "@/lib/navigation";

export default function LibrarianDashboardPage() {
  return (
    <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
      <PageHeader title="Librarian Dashboard" description="Daily circulation overview" />
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          TODO: Port the full Library Hub librarian dashboard and wire it to Supabase (issue/return activity, reservations queue, etc.).
        </p>
      </div>
    </DashboardLayout>
  );
}

