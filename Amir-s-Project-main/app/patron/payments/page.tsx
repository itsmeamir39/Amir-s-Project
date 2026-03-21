"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";

export default function PatronPaymentsPage() {
  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Payment History" description="Your fine payment history" />
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          TODO: Implement a `payments` table (or an external payment provider webhook log) and show payment records here.
        </p>
      </div>
    </DashboardLayout>
  );
}

