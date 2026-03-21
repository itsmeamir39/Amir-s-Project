 'use client';
 export const dynamic = "force-dynamic";
 import * as React from 'react';
 import { History as HistoryIcon } from 'lucide-react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { createSupabaseBrowserClient } from '@/lib/supabase';
 import { getCurrentUser } from '@/services/auth';
 import { getBibliosByIds } from '@/services/biblios';
 import { getReadingHistory } from '@/services/history';
 
 type HistoryRow = {
   id: number;
   user_id: string;
   biblio_id: number;
   borrowed_at: string;
   returned_at: string | null;
 };
 
 export default function ReadingHistoryPage() {
  const [supabase, setSupabase] = React.useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
   const [rows, setRows] = React.useState<HistoryRow[]>([]);
   const [books, setBooks] = React.useState<Record<number, { title: string; author: string | null }>>({});
   const [error, setError] = React.useState<string | null>(null);
   const [loading, setLoading] = React.useState(true);
 
  React.useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

   React.useEffect(() => {
    if (!supabase) return;
     const load = async () => {
       try {
        const user = await getCurrentUser(supabase);
        if (!user) throw new Error('You must be logged in to view history.');

        const history = await getReadingHistory(supabase, user.id, 50);
         setRows(history);
 
         const ids = Array.from(new Set(history.map((h) => h.biblio_id)));
         if (ids.length > 0) {
          setBooks(await getBibliosByIds(supabase, ids));
         }
       } catch (e) {
         setError(e instanceof Error ? e.message : 'Unable to load history.');
       } finally {
         setLoading(false);
       }
     };
     load();
   }, [supabase]);
 
   return (
     <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
       <div className="mx-auto max-w-3xl">
         <Card className="border border-slate-200 bg-white">
           <CardHeader>
             <div className="flex items-center gap-2">
               <HistoryIcon className="h-5 w-5 text-orange-600" />
               <CardTitle className="text-base">Reading History</CardTitle>
             </div>
             <p className="text-xs text-slate-600">
               Books you have borrowed, with borrow and return dates.
             </p>
           </CardHeader>
           <CardContent>
             {loading && <p className="text-xs text-slate-600">Loading…</p>}
             {error && <p className="text-xs text-rose-600">{error}</p>}
             {!loading && !error && (
               <div className="space-y-3">
                 {rows.length === 0 ? (
                   <p className="text-xs text-slate-600">No history available.</p>
                 ) : (
                   rows.map((row) => {
                     const book = books[row.biblio_id];
                     return (
                       <div
                         key={row.id}
                         className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                       >
                         <div>
                           <p className="text-sm font-medium">
                             {book?.title ?? `#${row.biblio_id}`}
                           </p>
                           <p className="text-xs text-slate-600">
                             {book?.author ?? 'Unknown author'}
                           </p>
                         </div>
                         <div className="text-right">
                           <p className="text-[11px] text-slate-700">
                             Borrowed: {new Date(row.borrowed_at).toLocaleDateString()}
                           </p>
                           <p className="text-[11px] text-slate-700">
                             Returned:{' '}
                             {row.returned_at
                               ? new Date(row.returned_at).toLocaleDateString()
                               : '—'}
                           </p>
                         </div>
                       </div>
                     );
                   })
                 )}
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </main>
   );
 }
