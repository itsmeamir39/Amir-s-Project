 'use client';
 export const dynamic = "force-dynamic";
 import * as React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { createSupabaseBrowserClient } from '@/lib/supabase';
 import { getCurrentUser } from '@/services/auth';
 import { getBibliosByIds } from '@/services/biblios';
 import { getCurrentLoans, renewLoan } from '@/services/loans';
 import type { Loan } from '@/types/library';
 
 type LoanRow = Loan;
 
 export default function CheckoutsPage() {
  const [supabase, setSupabase] = React.useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
   const [loans, setLoans] = React.useState<LoanRow[]>([]);
   const [books, setBooks] = React.useState<Record<number, { title: string; author: string | null }>>({});
   const [error, setError] = React.useState<string | null>(null);
   const [loading, setLoading] = React.useState(true);
   const [renewingId, setRenewingId] = React.useState<number | null>(null);
 
   const load = React.useCallback(async () => {
    if (!supabase) return;
     try {
      const user = await getCurrentUser(supabase);
      if (!user) throw new Error('You must be logged in to view checkouts.');
      const list = await getCurrentLoans(supabase, user.id);
       setLoans(list);
       const ids = Array.from(new Set(list.map((l) => l.biblio_id)));
       if (ids.length > 0) {
        setBooks(await getBibliosByIds(supabase, ids));
       }
     } catch (e) {
       setError(e instanceof Error ? e.message : 'Unable to load checkouts.');
     } finally {
       setLoading(false);
     }
   }, [supabase]);
 
   React.useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  React.useEffect(() => {
     load();
   }, [load]);
 
   const daysRemaining = (due: string) => {
     const dueDate = new Date(due);
     const today = new Date();
     const msInDay = 1000 * 60 * 60 * 24;
     return Math.ceil((dueDate.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / msInDay);
   };
 
   const handleRenew = async (loan: LoanRow) => {
     try {
      if (!supabase) return;
       setRenewingId(loan.id);
      const user = await getCurrentUser(supabase);
      if (!user) throw new Error('You must be logged in to renew.');
      await renewLoan(supabase, user.id, loan);
       await load();
     } catch (e) {
       setError(e instanceof Error ? e.message : 'Unable to renew this loan.');
     } finally {
       setRenewingId(null);
     }
   };
 
   return (
     <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
       <div className="mx-auto max-w-3xl">
         <Card className="border border-slate-200 bg-white">
           <CardHeader>
             <CardTitle className="text-base">Current Checkouts</CardTitle>
           </CardHeader>
           <CardContent>
             {loading && <p className="text-xs text-slate-600">Loading…</p>}
             {error && <p className="text-xs text-rose-600">{error}</p>}
             {!loading && !error && (
               <div className="space-y-3">
                 {loans.length === 0 ? (
                   <p className="text-xs text-slate-600">No current checkouts.</p>
                 ) : (
                   loans.map((loan) => {
                     const book = books[loan.biblio_id];
                     const days = daysRemaining(loan.due_date);
                     const overdue = days < 0;
                     return (
                       <div
                         key={loan.id}
                         className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                       >
                         <div>
                           <p className="text-sm font-medium">{book?.title ?? `#${loan.biblio_id}`}</p>
                           <p className="text-xs text-slate-600">{book?.author ?? 'Unknown author'}</p>
                         </div>
                         <div className="text-right">
                           <p className={`text-[11px] ${overdue ? 'text-rose-600' : 'text-slate-700'}`}>
                             {overdue ? `Overdue by ${Math.abs(days)} day(s)` : `${days} day(s) remaining`}
                           </p>
                           <div className="mt-2">
                             <Button
                               className="h-8 bg-orange-600 text-xs text-white hover:bg-orange-700"
                               onClick={() => handleRenew(loan)}
                               disabled={renewingId === loan.id}
                             >
                               {renewingId === loan.id ? 'Renewing…' : 'Renew'}
                             </Button>
                           </div>
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
