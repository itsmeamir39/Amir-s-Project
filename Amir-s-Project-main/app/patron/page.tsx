"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { BookCopy, CalendarCheck, DollarSign } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";
import { getCurrentLoans } from "@/services/loans";

export default function PatronDashboardPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [activeLoans, setActiveLoans] = useState(0);
  const [unpaidFines, setUnpaidFines] = useState(0);
  const [reservations, setReservations] = useState(0);

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const run = async () => {
      try {
        const user = await getCurrentUser(supabase);
        const loans = await getCurrentLoans(supabase, user.id);
        setActiveLoans(loans.length);

        const { data: finesData, error: finesError } = await supabase
          .from("fines")
          .select("amount")
          .eq("user_id", user.id)
          .eq("status", "Unpaid");
        if (finesError) throw new Error(finesError.message);
        setUnpaidFines(
          (finesData ?? []).reduce((sum, f) => sum + (f.amount ?? 0), 0)
        );

        const { count, error: resError } = await supabase
          .from("holds")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "pending");
        if (resError) throw new Error(resError.message);
        setReservations(count ?? 0);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard.");
      }
    };
    void run();
  }, [supabase]);

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Patron Dashboard" description="Quick overview of your account" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Active Loans" value={activeLoans} icon={BookCopy} delay={0} />
        <StatCard title="Reservations" value={reservations} icon={CalendarCheck} delay={0.05} />
        <StatCard title="Unpaid Fines" value={`$${unpaidFines.toFixed(2)}`} icon={DollarSign} delay={0.1} />
      </div>

      <div className="mt-6 glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Your dashboard updates from live loans, holds, and fines data.</p>
      </div>
    </DashboardLayout>
  );
}

