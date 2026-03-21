"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";
import { getBibliosByIds } from "@/services/biblios";
import { cancelPendingHold, getPendingHolds } from "@/services/catalog";

export default function PatronReservationsPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getPendingHolds>>>([]);
  const [titles, setTitles] = useState<Record<number, { title: string; author: string | null }>>({});

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const run = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser(supabase);
        const r = await getPendingHolds(supabase, user.id);

        setRows(r);
        setTitles(await getBibliosByIds(supabase, r.map((x) => x.biblio_id)));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load reservations.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [supabase]);

  const cancelHold = async (id: number) => {
    if (!supabase) return;
    try {
      const user = await getCurrentUser(supabase);
      await cancelPendingHold(supabase, user.id, id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation cancelled.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel reservation.");
    }
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Reservations" description="Your pending reservations" />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-muted-foreground">No reservations found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Book</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const b = titles[row.biblio_id];
                return (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{b?.title ?? `Biblio #${row.biblio_id}`}</div>
                      {b?.author && <div className="text-xs text-muted-foreground">{b.author}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-destructive hover:underline" onClick={() => void cancelHold(row.id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

