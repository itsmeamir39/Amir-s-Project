"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { librarianNav } from "@/lib/navigation";
import { useParams } from "next/navigation";

type TableRow = Record<string, string | number | null>;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const message = (err as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) return message;
  }
  return "Failed to load module data.";
}

const sectionTitles: Record<string, string> = {
  issue: "Issue Book",
  return: "Return Book",
  reservations: "Reservations",
  catalog: "Book Catalog",
  suggestions: "Suggestions",
  reports: "Reports",
};

export default function LibrarianSubPage() {
  const params = useParams<{ slug?: string[] }>();
  const slug = params?.slug ?? [];
  const section = Array.isArray(slug) ? slug[0] : slug;
  const path = `/librarian/${Array.isArray(slug) ? slug.join("/") : slug}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [summary, setSummary] = useState<TableRow[]>([]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    const run = async () => {
      if (!section || !sectionTitles[section]) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setRows([]);
      setSummary([]);

      try {
        if (section === "issue") {
          const { data, error: qError } = await supabase
            .from("loans")
            .select("id, user_id, biblio_id, status, borrowed_at, due_date")
            .eq("status", "CheckedOut")
            .order("borrowed_at", { ascending: false })
            .limit(30);
          if (qError) throw qError;
          if (!cancelled) setRows((data ?? []) as unknown as TableRow[]);
        } else if (section === "return") {
          const { data, error: qError } = await supabase
            .from("loans")
            .select("id, user_id, biblio_id, status, due_date, updated_at")
            .in("status", ["CheckedOut", "Overdue"])
            .order("due_date", { ascending: true })
            .limit(30);
          if (qError) throw qError;
          if (!cancelled) setRows((data ?? []) as unknown as TableRow[]);
        } else if (section === "reservations") {
          const { data, error: qError } = await supabase
            .from("holds")
            .select("id, user_id, biblio_id, status, created_at")
            .order("created_at", { ascending: false })
            .limit(30);
          if (qError) throw qError;
          if (!cancelled) setRows((data ?? []) as unknown as TableRow[]);
        } else if (section === "catalog") {
          const { data, error: qError } = await supabase
            .from("biblios")
            .select("id, title, author, isbn, updated_at")
            .order("updated_at", { ascending: false })
            .limit(40);
          if (qError) throw qError;
          if (!cancelled) setRows((data ?? []) as unknown as TableRow[]);
        } else if (section === "suggestions") {
          const { data, error: qError } = await supabase
            .from("suggestions")
            .select("id, user_id, title, author, status, created_at")
            .order("created_at", { ascending: false })
            .limit(30);
          if (qError) throw qError;
          if (!cancelled) setRows((data ?? []) as unknown as TableRow[]);
        } else if (section === "reports") {
          const [catalog, activeLoans, pendingHolds, overdueLoans] = await Promise.all([
            supabase.from("biblios").select("id", { head: true, count: "exact" }),
            supabase.from("loans").select("id", { head: true, count: "exact" }).eq("status", "CheckedOut"),
            supabase.from("holds").select("id", { head: true, count: "exact" }).eq("status", "pending"),
            supabase
              .from("loans")
              .select("id", { head: true, count: "exact" })
              .lt("due_date", new Date().toISOString())
              .eq("status", "CheckedOut"),
          ]);

          const reportError = catalog.error ?? activeLoans.error ?? pendingHolds.error ?? overdueLoans.error;
          if (reportError) throw reportError;

          if (!cancelled) {
            setSummary([
              { metric: "Catalog Titles", value: catalog.count ?? 0 },
              { metric: "Active Loans", value: activeLoans.count ?? 0 },
              { metric: "Pending Holds", value: pendingHolds.count ?? 0 },
              { metric: "Potential Overdues", value: overdueLoans.count ?? 0 },
            ]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
          setRows([]);
          setSummary([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [section]);

  const headers = useMemo(() => {
    const source = rows[0] ?? summary[0];
    return source ? Object.keys(source) : [];
  }, [rows, summary]);

  const dataRows = summary.length > 0 ? summary : rows;

  return (
    <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
      <PageHeader title={sectionTitles[section] ?? "Librarian"} description={path} />
      <div className="glass-card rounded-xl p-6">
        {!sectionTitles[section] ? (
          <p className="text-sm text-muted-foreground">Unknown librarian route.</p>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading module data...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : dataRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No records found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-b border-border">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="text-left py-2 pr-4 font-medium capitalize">
                      {header.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, index) => (
                  <tr key={index} className="border-b border-border/50">
                    {headers.map((header) => (
                      <td key={`${index}-${header}`} className="py-2 pr-4 align-top text-muted-foreground">
                        {String(row[header] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

