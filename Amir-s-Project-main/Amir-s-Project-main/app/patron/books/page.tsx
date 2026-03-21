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
import { getBibliosByIds } from "@/services/biblios";
import { getCurrentLoans, renewLoan } from "@/services/loans";
import type { Loan } from "@/types/library";

export default function PatronMyBooksPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [titles, setTitles] = useState<Record<number, { title: string; author: string | null }>>({});

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const user = await getCurrentUser(supabase);
      const l = await getCurrentLoans(supabase, user.id);
      setLoans(l);
      setTitles(await getBibliosByIds(supabase, l.map((x) => x.biblio_id)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load loans.");
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

  const onRenew = async (loan: Loan) => {
    try {
      if (!supabase) return;
      const user = await getCurrentUser(supabase);
      await renewLoan(supabase, user.id, loan);
      toast.success("Renewal requested.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not renew.");
    }
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="My Borrowed Books" description="Books currently checked out" />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : loans.length === 0 ? (
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-muted-foreground">You have no active loans.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Book</th>
                <th className="text-left px-4 py-3 font-medium">Due</th>
                <th className="text-left px-4 py-3 font-medium">Renewals</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const b = titles[loan.biblio_id];
                return (
                  <tr key={loan.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{b?.title ?? `Biblio #${loan.biblio_id}`}</div>
                      {b?.author && <div className="text-xs text-muted-foreground">{b.author}</div>}
                    </td>
                    <td className="px-4 py-3">{new Date(loan.due_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{loan.renewals_used ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => onRenew(loan)}>
                        Request renewal
                      </Button>
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

