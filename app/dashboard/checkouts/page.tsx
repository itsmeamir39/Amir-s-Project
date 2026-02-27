 'use client';
 import * as React from 'react';
 import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 
 type LoanRow = {
   id: number;
   user_id: string;
   biblio_id: number;
   borrowed_at: string;
   due_date: string;
   renewals_used: number;
   status: string;
 };
 
 export default function CheckoutsPage() {
   const supabase = createClientComponentClient<any>();
   const [loans, setLoans] = React.useState<LoanRow[]>([]);
   const [books, setBooks] = React.useState<Record<number, { title: string; author: string | null }>>({});
   const [error, setError] = React.useState<string | null>(null);
   const [loading, setLoading] = React.useState(true);
   const [renewingId, setRenewingId] = React.useState<number | null>(null);
 
   const load = React.useCallback(async () => {
     try {
       const { data: auth } = await supabase.auth.getUser();
       const user = auth?.user;
       if (!user) throw new Error('You must be logged in to view checkouts.');
       const { data, error: loanError } = await supabase
         .from('loans')
         .select('id, user_id, biblio_id, borrowed_at, due_date, renewals_used, status')
         .eq('user_id', user.id)
         .eq('status', 'CheckedOut')
         .order('due_date', { ascending: true });
       if (loanError) throw loanError;
       const list = (data as LoanRow[]) ?? [];
       setLoans(list);
       const ids = Array.from(new Set(list.map((l) => l.biblio_id)));
       if (ids.length > 0) {
         const { data: bData, error: bError } = await supabase
           .from('biblios')
           .select('id, title, author')
           .in('id', ids);
         if (bError) throw bError;
         const map: Record<number, { title: string; author: string | null }> = {};
         (bData ?? []).forEach((b: any) => {
           map[b.id] = { title: b.title, author: b.author };
         });
         setBooks(map);
       }
     } catch (e: any) {
       setError(e?.message ?? 'Unable to load checkouts.');
     } finally {
       setLoading(false);
     }
   }, [supabase]);
 
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
       setRenewingId(loan.id);
       const { data: auth } = await supabase.auth.getUser();
       const user = auth?.user;
       if (!user) throw new Error('You must be logged in to renew.');
       const { data: userRecord, error: userRecordError } = await supabase
         .from('users')
         .select('role')
         .eq('id', user.id)
         .maybeSingle();
       if (userRecordError) throw userRecordError;
       const role = userRecord?.role as string | undefined;
       const { data: rule, error: ruleError } = await supabase
         .from('circulation_rules')
         .select('renewal_limit, loan_period_days')
         .eq('role', role)
         .maybeSingle();
       if (ruleError) throw ruleError;
       const renewalLimit = (rule as any)?.renewal_limit ?? 0;
       const loanPeriodDays = (rule as any)?.loan_period_days ?? 7;
       if (loan.renewals_used >= renewalLimit) {
         throw new Error('Renewal limit reached.');
       }
       const currentDue = new Date(loan.due_date);
       currentDue.setDate(currentDue.getDate() + loanPeriodDays);
       const { error: updError } = await supabase
         .from('loans')
         .update({ due_date: currentDue.toISOString(), renewals_used: loan.renewals_used + 1 })
         .eq('id', loan.id);
       if (updError) throw updError;
       await load();
     } catch (e: any) {
       setError(e?.message ?? 'Unable to renew this loan.');
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
