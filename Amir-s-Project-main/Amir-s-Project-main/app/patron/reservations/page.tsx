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

type ReservationRow = {
  id: number;
  biblio_id: number;
  type?: string | null;
  created_at?: string | null;
};

export default function PatronReservationsPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ReservationRow[]>([]);
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

        // TODO: unify reservations/holds: this app currently uses both `holds` and `engagement` (type=Reservation).
        const { data, error } = await supabase
          .from("engagement")
          .select("id, biblio_id, type, created_at")
          .eq("user_id", user.id)
          .eq("type", "Reservation")
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);

        const r: ReservationRow[] = (data ?? []).map((d) => ({
          id: d.id,
          biblio_id: d.biblio_id,
          type: d.type,
          created_at: d.created_at,
        }));

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
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-muted-foreground">
            TODO: Add cancel/fulfillment actions, and reconcile `holds` vs `engagement` reservation storage.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

