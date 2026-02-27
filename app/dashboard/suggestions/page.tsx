 'use client';
 import * as React from 'react';
 import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
 import { useForm } from 'react-hook-form';
 import { MessageSquare } from 'lucide-react';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Textarea } from '@/components/ui/textarea';
 
 type SuggestionValues = {
   title: string;
   author?: string;
   reason?: string;
 };
 
 export default function SuggestionsPage() {
   const supabase = createClientComponentClient<any>();
   const { register, handleSubmit, reset } = useForm<SuggestionValues>({
     defaultValues: { title: '', author: '', reason: '' },
   });
   const [error, setError] = React.useState<string | null>(null);
   const [success, setSuccess] = React.useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = React.useState(false);
 
   const onSubmit = async (values: SuggestionValues) => {
     setError(null);
     setSuccess(null);
     setIsSubmitting(true);
     try {
       const { data: auth } = await supabase.auth.getUser();
       const user = auth?.user;
       if (!user) throw new Error('You must be logged in to submit a suggestion.');
       const { error: insertError } = await supabase.from('suggestions').insert({
         user_id: user.id,
         title: values.title,
         author: values.author || null,
         reason: values.reason || null,
         status: 'pending',
       });
       if (insertError) throw insertError;
       setSuccess('Suggestion submitted. Thank you!');
       reset();
     } catch (e: any) {
       setError(e?.message ?? 'Unable to submit suggestion.');
     } finally {
       setIsSubmitting(false);
     }
   };
 
   return (
     <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
       <div className="mx-auto max-w-2xl">
         <Card className="border border-slate-200 bg-white">
           <CardHeader>
             <div className="flex items-center gap-2">
               <MessageSquare className="h-5 w-5 text-orange-600" />
               <CardTitle className="text-base">Purchase Suggestions</CardTitle>
             </div>
             <p className="text-xs text-slate-600">
               Request books for the library to consider purchasing.
             </p>
           </CardHeader>
           <CardContent>
             <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
               <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-700">Title</label>
                 <Input placeholder="Book title" className="h-10" {...register('title', { required: true })} />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-700">Author</label>
                 <Input placeholder="Author (optional)" className="h-10" {...register('author')} />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-700">Reason</label>
                 <Textarea placeholder="Tell us why this book should be added" className="min-h-24" {...register('reason')} />
               </div>
               {error && <p className="text-xs text-rose-600">{error}</p>}
               {success && <p className="text-xs text-emerald-700">{success}</p>}
               <Button
                 type="submit"
                 className="bg-orange-600 text-white hover:bg-orange-700"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? 'Submitting…' : 'Submit Suggestion'}
               </Button>
             </form>
           </CardContent>
         </Card>
       </div>
     </main>
   );
 }
