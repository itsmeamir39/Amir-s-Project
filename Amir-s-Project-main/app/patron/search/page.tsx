"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";
import { reserveIfAllowed, searchCatalog } from "@/services/catalog";

export default function PatronSearchBooksPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Awaited<ReturnType<typeof searchCatalog>>>([]);

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const t = query.trim();
    const handle = setTimeout(async () => {
      if (!t) {
        setBooks([]);
        return;
      }
      setLoading(true);
      try {
        const results = await searchCatalog(supabase, t, 40);
        setBooks(results);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Search failed.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query, supabase]);

  const onReserve = async (biblioId: number) => {
    try {
      if (!supabase) return;
      const user = await getCurrentUser(supabase);
      await reserveIfAllowed(supabase, user.id, biblioId);
      toast.success("Reservation placed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reserve.");
    }
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Search Books" description="Find books in our catalog" />

      <div className="relative max-w-lg mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card h-11"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground mb-4">Searching…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => {
          const available =
            (book.items ?? []).filter((i) => i?.status == null || i.status === "Available").length ?? 0;

          return (
            <div
              key={book.id}
              className="glass-card rounded-xl p-5 flex flex-col hover:border-accent/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground text-lg truncate">{book.title}</h3>
                  {book.author && <p className="text-sm text-muted-foreground mt-1 truncate">{book.author}</p>}
                  {book.isbn && <p className="text-xs font-mono text-muted-foreground mt-1">ISBN: {book.isbn}</p>}
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>General Stacks</span>
                </div>
                {available > 0 ? (
                  <span className="text-sm font-medium text-success">{available} available</span>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => onReserve(book.id)}>
                    Reserve
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

