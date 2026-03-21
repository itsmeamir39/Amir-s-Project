"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";
import { useCatalogSearch, useReserveBookMutation, useUserHolds } from "@/hooks/useCatalog";

export default function PatronSearchBooksPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [userId, setUserId] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const loadUser = async () => {
      try {
        const user = await getCurrentUser(supabase);
        setUserId(user.id);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load session.");
      }
    };
    void loadUser();
  }, [supabase]);

  const debouncedQuery = query.trim();
  const {
    data: books = [],
    isLoading: loading,
    error: searchError,
  } = useCatalogSearch(supabase, debouncedQuery, !!supabase);

  const { data: holds = [] } = useUserHolds(supabase, userId, !!supabase && !!userId);
  const reserveMutation = useReserveBookMutation(supabase, userId);

  useEffect(() => {
    if (!searchError) return;
    toast.error(searchError instanceof Error ? searchError.message : "Search failed.");
  }, [searchError]);

  const heldByBiblio = useMemo(() => {
    const map = new Map<number, number>();
    for (const hold of holds) {
      map.set(hold.biblio_id, (map.get(hold.biblio_id) ?? 0) + 1);
    }
    return map;
  }, [holds]);

  const onReserve = async (biblioId: number) => {
    try {
      await reserveMutation.mutateAsync({ biblioId });
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
          const userHoldCount = heldByBiblio.get(book.id) ?? 0;
          const alreadyReserved = userHoldCount > 0;

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
                  <span>{alreadyReserved ? `Reserved x${userHoldCount}` : "General Stacks"}</span>
                </div>
                {available > 0 ? (
                  <span className="text-sm font-medium text-success">{available} available</span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => onReserve(book.id)}
                    disabled={alreadyReserved || reserveMutation.isPending}
                  >
                    {alreadyReserved ? "Reserved" : reserveMutation.isPending ? "Reserving..." : "Reserve"}
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

