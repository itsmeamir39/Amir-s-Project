 'use client';
 export const dynamic = "force-dynamic";
 import * as React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { createSupabaseBrowserClient } from '@/lib/supabase';
 import { getCurrentUser } from '@/services/auth';
 import { getUserFines, payFine } from '@/services/fines';
 
 type FineRow = { id: number; amount: number; status: string; created_at: string };
 
 export default function FinesPage() {
  const [supabase, setSupabase] = React.useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
   const [rows, setRows] = React.useState<FineRow[]>([]);
   const [error, setError] = React.useState<string | null>(null);
   const [loading, setLoading] = React.useState(true);
   const [payingId, setPayingId] = React.useState<number | null>(null);
 
   const load = React.useCallback(async () => {
    if (!supabase) return;
     try {
      const user = await getCurrentUser(supabase);
      if (!user) throw new Error('You must be logged in to view fines.');
      setRows(await getUserFines(supabase, user.id));
     } catch (e) {
       setError(e instanceof Error ? e.message : 'Unable to load fines.');
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
 
   const totalUnpaid = rows.filter((r) => r.status === 'Unpaid').reduce((sum, r) => sum + r.amount, 0);
 
   const handlePay = async (row: FineRow) => {
     try {
      if (!supabase) return;
       setPayingId(row.id);
      await payFine(supabase, row.id);
       await load();
     } catch (e) {
       setError(e instanceof Error ? e.message : 'Unable to complete payment.');
     } finally {
       setPayingId(null);
     }
   };
 
   return (
     <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
       <div className="mx-auto max-w-3xl">
         <Card className="border border-slate-200 bg-white">
           <CardHeader>
             <CardTitle className="text-base">Your Fines</CardTitle>
           </CardHeader>
           <CardContent>
             {loading && <p className="text-xs text-slate-600">Loading…</p>}
             {error && <p className="text-xs text-rose-600">{error}</p>}
             {!loading && !error && (
               <>
                 <div className="mb-4 flex items-center justify-between">
                   <p className="text-sm">Total unpaid</p>
                   <p className="text-sm font-semibold">${totalUnpaid.toFixed(2)}</p>
                 </div>
                 <div className="space-y-3">
                   {rows.length === 0 ? (
                     <p className="text-xs text-slate-600">No fines.</p>
                   ) : (
                     rows.map((row) => (
                       <div key={row.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                         <div>
                           <p className="text-sm font-medium">${row.amount.toFixed(2)}</p>
                           <p className="text-[11px] text-slate-600">{new Date(row.created_at).toLocaleDateString()}</p>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={`text-[11px] ${row.status === 'Unpaid' ? 'text-rose-600' : 'text-emerald-700'}`}>{row.status}</span>
                           {row.status === 'Unpaid' && (
                             <Button
                               className="h-8 bg-orange-600 text-xs text-white hover:bg-orange-700"
                               onClick={() => handlePay(row)}
                               disabled={payingId === row.id}
                             >
                               {payingId === row.id ? 'Paying…' : 'Pay'}
                             </Button>
                           )}
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </>
             )}
           </CardContent>
         </Card>
       </div>
     </main>
   );
 }
