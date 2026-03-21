"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";
import { getUserFines } from "@/services/fines";
import type { Fine } from "@/types/library";

export default function PatronFinesPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [fines, setFines] = useState<Fine[]>([]);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const user = await getCurrentUser(supabase);
      setFines(await getUserFines(supabase, user.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load fines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const onPay = async (fineId: number) => {
    try {
      const response = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fineId, status: "succeeded", providerRef: `manual-${Date.now()}` }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Payment failed.");
      toast.success("Payment recorded successfully.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed.");
    }
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Fines" description="Outstanding and paid fines" />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : fines.length === 0 ? (
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-muted-foreground">No fines found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.id} className="border-t border-border">
                  <td className="px-4 py-3">{new Date(fine.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">${Number(fine.amount ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        fine.status === "Unpaid"
                          ? "inline-flex rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                          : "inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
                      }
                    >
                      {fine.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fine.status === "Unpaid" ? (
                      <Button size="sm" onClick={() => onPay(fine.id)}>
                        Pay
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

