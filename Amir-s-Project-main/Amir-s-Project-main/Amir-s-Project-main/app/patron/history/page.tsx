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
import { getReadingHistory } from "@/services/history";
import type { ReadingHistory } from "@/types/library";

export default function PatronHistoryPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
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
        const h = await getReadingHistory(supabase, user.id, 50);
        setHistory(h);
        setTitles(await getBibliosByIds(supabase, h.map((x) => x.biblio_id)));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [supabase]);

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Borrowing History" description="Your past loans and returns" />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : history.length === 0 ? (
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-muted-foreground">No history yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Book</th>
                <th className="text-left px-4 py-3 font-medium">Borrowed</th>
                <th className="text-left px-4 py-3 font-medium">Returned</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => {
                const b = titles[row.biblio_id];
                return (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{b?.title ?? `Biblio #${row.biblio_id}`}</div>
                      {b?.author && <div className="text-xs text-muted-foreground">{b.author}</div>}
                    </td>
                    <td className="px-4 py-3">{new Date(row.borrowed_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {row.returned_at ? new Date(row.returned_at).toLocaleDateString() : "—"}
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

