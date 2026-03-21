"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";

type PaymentLog = {
  id: number;
  details: string | null;
  created_at: string;
};

export default function PatronPaymentsPage() {
  const [rows, setRows] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const run = async () => {
      try {
        const user = await getCurrentUser(supabase);
        const { data, error } = await supabase
          .from("audit_logs")
          .select("id, details, created_at")
          .eq("action", "PAYMENT_EVENT")
          .eq("admin_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);

        const filtered = (data ?? []).filter((row) => (row.details ?? "").length > 0);
        setRows(filtered);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Payment History" description="Your fine payment history" />
      {loading ? (
        <div className="glass-card rounded-xl p-6 text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="glass-card rounded-xl p-6 text-sm text-muted-foreground">No payment records found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.details ?? "Payment event recorded"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

