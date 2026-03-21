"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";

type FineRow = {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function PatronPaymentsPage() {
  const [rows, setRows] = useState<FineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const run = async () => {
      try {
        const user = await getCurrentUser(supabase);
        const { data, error } = await supabase
          .from("fines")
          .select("id, amount, status, created_at, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });
        if (error) throw new Error(error.message);
        setRows((data ?? []) as FineRow[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payment records.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const paidRows = rows.filter((r) => r.status.toLowerCase() === "paid");
  const paidTotal = paidRows.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const unpaidTotal = rows
    .filter((r) => r.status.toLowerCase() === "unpaid")
    .reduce((sum, r) => sum + (r.amount ?? 0), 0);

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Payment History" description="Your fine payment history" />
      {loading ? (
        <div className="glass-card rounded-xl p-6 text-sm text-muted-foreground">Loading…</div>
      ) : error ? (
        <div className="glass-card rounded-xl p-6 text-sm text-destructive">{error}</div>
      ) : rows.length === 0 ? (
        <div className="glass-card rounded-xl p-6 text-sm text-muted-foreground">No fine records found.</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-semibold">${paidTotal.toFixed(2)}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Outstanding Balance</p>
              <p className="text-2xl font-semibold">${unpaidTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-4 py-3 capitalize">{row.status}</td>
                    <td className="px-4 py-3">${Number(row.amount ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(row.updated_at ?? row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

