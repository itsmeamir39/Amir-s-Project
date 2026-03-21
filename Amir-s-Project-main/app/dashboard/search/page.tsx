'use client';
export const dynamic = 'force-dynamic';

import * as React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { getCurrentUser } from '@/services/auth';
import { placeHold, reserveIfAllowed, searchCatalog, type BiblioWithItems } from '@/services/catalog';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock } from 'lucide-react';

export default function PatronCatalogPage() {
  const [supabase, setSupabase] = React.useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<BiblioWithItems[]>([]);

  const [selected, setSelected] = React.useState<BiblioWithItems | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [reserveError, setReserveError] = React.useState<string | null>(null);
  const [reserveSuccess, setReserveSuccess] = React.useState<string | null>(null);
  const [isReserving, setIsReserving] = React.useState(false);

  React.useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!supabase) return;
    if (!searchTerm.trim()) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const data = await searchCatalog(supabase, searchTerm, 40);
        setResults(data);
      } catch (e) {
        console.error(e);
        setSearchError(
          e instanceof Error
            ? e.message
            : 'Something went wrong while searching the catalog.'
        );
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, supabase]);

  React.useEffect(() => {
    if (!isSearching) return;
    const t = setTimeout(() => {
      setIsSearching(false);
      setSearchError('Search is taking too long. Please try again.');
    }, 10000);
    return () => clearTimeout(t);
  }, [isSearching]);

  const isAvailable = (biblio: BiblioWithItems) =>
    biblio.items?.some((item) => item.status === 'Available');

  const handleCardClick = (biblio: BiblioWithItems) => {
    setSelected(biblio);
    setReserveError(null);
    setReserveSuccess(null);
    setIsDialogOpen(true);
  };

  const handleReserve = async () => {
    if (!selected) return;
    if (!supabase) return;

    setReserveError(null);
    setReserveSuccess(null);
    setIsReserving(true);

    try {
      const user = await getCurrentUser(supabase);
      if (!user) throw new Error('You must be logged in to reserve a book.');
      await reserveIfAllowed(supabase, user.id, selected.id);
      setReserveSuccess('Your reservation has been placed successfully.');
    } catch (e) {
      console.error(e);
      setReserveError(
        e instanceof Error
          ? e.message
          : 'Unable to place reservation at this time.'
      );
    } finally {
      setIsReserving(false);
    }
  };

  const handlePlaceHold = async () => {
    if (!selected) return;
    if (!supabase) return;
    setReserveError(null);
    setReserveSuccess(null);
    try {
      const user = await getCurrentUser(supabase);
      if (!user) throw new Error('You must be logged in to place a hold.');
      await placeHold(supabase, user.id, selected.id);
      setReserveSuccess('Hold placed successfully. We will notify you when ready.');
    } catch (e) {
      setReserveError(
        e instanceof Error ? e.message : 'Unable to place hold at this time.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-orange-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        {/* Header */}
        <section className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Patron Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Find your next book
          </h1>
          <p className="max-w-xl text-sm text-slate-500">
            Search by title, author, or ISBN. Real-time availability lets you
            know what&apos;s on the shelf right now.
          </p>
        </section>

        {/* Search bar */}
        <section className="w-full max-w-2xl">
          <div className="relative rounded-2xl bg-white/90 p-1 shadow-[0_22px_60px_rgba(15,23,42,0.14)] ring-1 ring-orange-200 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white">
                ⌕
              </span>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or ISBN"
                className="border-0 bg-transparent px-0 text-sm shadow-none outline-none ring-0 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {isSearching && (
                <span className="text-xs text-orange-600">Searching…</span>
              )}
            </div>
          </div>
          {searchError && (
            <p className="mt-2 text-center text-xs text-rose-500">
              {searchError}
            </p>
          )}
        </section>

        {/* Results grid */}
        <section className="w-full">
          {results.length === 0 && searchTerm.trim() ? (
            <p className="mt-10 text-center text-sm text-slate-400">
              No matches yet. Try a different title, author, or ISBN.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((biblio) => {
                const available = isAvailable(biblio);
                return (
                  <button
                    key={biblio.id}
                    type="button"
                    onClick={() => handleCardClick(biblio)}
                    className="group text-left"
                  >
                    <Card className="flex h-full flex-col overflow-hidden border border-orange-100 bg-white transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.18)]">
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            biblio.cover_url ??
                            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={biblio.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute left-3 top-3">
                          <Badge
                            className={
                              available
                                ? 'border-0 bg-emerald-100 text-[11px] font-medium text-emerald-700'
                                : 'border-0 bg-slate-200 text-[11px] font-medium text-slate-700'
                            }
                          >
                            {available ? 'Available' : 'Out of stock'}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="space-y-1 px-4 pb-3 pt-4">
                        <CardTitle className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {biblio.title}
                        </CardTitle>
                        <p className="text-xs font-medium text-slate-500">
                          {biblio.author || 'Unknown author'}
                        </p>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <p className="line-clamp-2 text-xs text-slate-400">
                          {biblio.description ||
                            'No description available for this title.'}
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg border border-orange-100 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
          {selected && (
            <>
              <DialogHeader className="border-b border-orange-100 px-6 py-4">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {selected.author || 'Unknown author'}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-5 px-6 py-5">
                <div className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      selected.cover_url ??
                      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={selected.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Badge
                    className={
                      isAvailable(selected)
                        ? 'border-0 bg-emerald-100 text-[11px] font-medium text-emerald-700'
                        : 'border-0 bg-slate-200 text-[11px] font-medium text-slate-700'
                    }
                  >
                    {isAvailable(selected) ? 'Available' : 'Out of stock'}
                  </Badge>
                  <p className="text-xs text-slate-400">
                    ISBN: {selected.isbn || '—'}
                  </p>
                  <p className="mt-2 max-h-40 overflow-y-auto text-xs leading-relaxed text-slate-600">
                    {selected.description ||
                      'No further description is available for this title.'}
                  </p>
                </div>
              </div>

              {reserveError && (
                <p className="px-6 text-xs text-rose-500">{reserveError}</p>
              )}
              {reserveSuccess && (
                <p className="px-6 text-xs text-emerald-600">
                  {reserveSuccess}
                </p>
              )}

              <DialogFooter className="mt-4 flex items-center justify-between gap-2 border-t border-orange-100 px-6 py-4">
                <p className="text-[11px] text-slate-400">
                  Reservations are held according to your library&apos;s
                  circulation rules.
                </p>
                <div className="flex gap-2">
                  {!isAvailable(selected) && (
                    <Button
                      type="button"
                      className="bg-slate-900 text-xs font-semibold text-slate-50 hover:bg-black inline-flex items-center gap-1"
                      onClick={handlePlaceHold}
                    >
                      <Clock className="h-3 w-3" />
                      Place Hold
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="border-orange-200 bg-white text-xs text-slate-700 hover:bg-orange-50"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    className="bg-orange-600 text-xs font-semibold text-white hover:bg-orange-700"
                    disabled={isReserving || !isAvailable(selected)}
                    onClick={handleReserve}
                  >
                    {isAvailable(selected)
                      ? isReserving
                        ? 'Reserving…'
                        : 'Reserve this book'
                      : 'Not available'}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
