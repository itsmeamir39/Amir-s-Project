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
import { usePayFineMutation, useUserFines } from "@/hooks/useFines";
import type { Fine } from "@/types/library";

export default function PatronFinesPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [userId, setUserId] = useState("");
  const [payingFineId, setPayingFineId] = useState<number | null>(null);

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const run = async () => {
      try {
        const user = await getCurrentUser(supabase);
        setUserId(user.id);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load session.");
      }
    };
    void run();
  }, [supabase]);

  const {
    data: fines = [],
    isLoading: loading,
    error: finesError,
    refetch,
  } = useUserFines(supabase, userId, !!supabase && !!userId);

  const payMutation = usePayFineMutation(supabase, userId);

  useEffect(() => {
    if (!finesError) return;
    toast.error(finesError instanceof Error ? finesError.message : "Failed to load fines.");
  }, [finesError]);

  const onPay = async (fineId: number) => {
    setPayingFineId(fineId);
    try {
      const result = await payMutation.mutateAsync(fineId);
      if (result.status === "succeeded") {
        toast.success("Payment verified and recorded.");
      } else {
        toast.info("Payment initiated. Waiting for provider confirmation.");
      }
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setPayingFineId(null);
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
                      <Button
                        size="sm"
                        onClick={() => onPay(fine.id)}
                        disabled={payingFineId === fine.id || payMutation.isPending}
                      >
                        {payingFineId === fine.id ? "Processing..." : "Pay"}
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

