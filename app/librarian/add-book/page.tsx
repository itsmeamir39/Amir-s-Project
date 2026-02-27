'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import JsBarcode from 'jsbarcode';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

import { getBookByISBN } from '@/lib/google-books';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const bookSchema = z.object({
  isbn: z.string().min(10, 'ISBN should be at least 10 characters long'),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  description: z.string().optional(),
  cover: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

type Step = 1 | 2 | 3;

export default function AddBookPage() {
  const supabase = createClientComponentClient<any>();

  const [step, setStep] = React.useState<Step>(1);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [barcodeValue, setBarcodeValue] = React.useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);

  const barcodeRef = React.useRef<SVGSVGElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      description: '',
      cover: '',
    },
  });

  const isbnWatch = watch('isbn');

  // Debounced ISBN search
  React.useEffect(() => {
    if (!isbnWatch || isbnWatch.replace(/[-\s]/g, '').length < 10) {
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const cleanIsbn = isbnWatch.replace(/[-\s]/g, '');
        const book = await getBookByISBN(cleanIsbn);

        if (!book) {
          setSearchError('No book found for this ISBN.');
          return;
        }

        setValue('title', book.title ?? '');
        setValue('author', book.author ?? '');
        setValue('publisher', book.publisher ?? '');
        setValue('description', book.description ?? '');
        setValue('cover', book.cover ?? '');

        setStep(2);
      } catch (error) {
        console.error(error);
        setSearchError('Something went wrong while searching for the book.');
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [isbnWatch, setValue]);

  // Render barcode when value changes
  React.useEffect(() => {
    if (barcodeValue && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcodeValue, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 16,
          lineColor: '#020617',
        });
      } catch (e) {
        console.error('Error rendering barcode', e);
      }
    }
  }, [barcodeValue]);

  const generateBarcode = () => {
    const randomId = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `LIB-${randomId}`;
  };

  const onSubmit = async (values: BookFormValues) => {
    setSaveError(null);
    setIsSaving(true);

    const barcode = generateBarcode();

    try {
      // Create record in biblios table
      const { data: biblioData, error: biblioError } = await supabase
        .from('biblios')
        .insert({
          isbn: values.isbn,
          title: values.title,
          author: values.author,
          publisher: values.publisher,
          description: values.description,
          cover_url: values.cover,
        })
        .select('id')
        .single();

      if (biblioError || !biblioData?.id) {
        throw new Error(biblioError?.message ?? 'Failed to create biblio record.');
      }

      // Create record in items table
      const { error: itemError } = await supabase.from('items').insert({
        biblio_id: biblioData.id,
        barcode,
      });

      if (itemError) {
        throw new Error(itemError.message ?? 'Failed to create item record.');
      }

      setBarcodeValue(barcode);
      setStep(3);
      setIsSuccessDialogOpen(true);
      reset();
    } catch (error: any) {
      console.error(error);
      setSaveError(
        error?.message ??
          'Something went wrong while saving the book. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintLabel = () => {
    const printArea = document.getElementById('barcode-print-area');
    if (!printArea) return;

    const win = window.open('', '', 'height=400,width=600');
    if (!win) return;

    win.document.write('<html><head><title>Print Label</title>');
    win.document.write(
      '<style>body{font-family:system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;display:flex;align-items:center;justify-content:center;height:100%;margin:0;}</style>'
    );
    win.document.write('</head><body>');
    win.document.write(printArea.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const stepLabelClass = (current: Step) =>
    `flex items-center gap-3 rounded-full px-4 py-2 text-sm ${
      step === current
        ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/50'
        : 'bg-slate-900/70 text-slate-400 ring-1 ring-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Add a new book
          </h1>
          <p className="text-sm text-slate-400">
            Use the ISBN scanner to quickly pull in book details, verify them,
            and generate a ready-to-print shelf label.
          </p>
        </header>

        {/* Stepper */}
        <div className="flex flex-wrap gap-3 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
          <div className={stepLabelClass(1)}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-xs font-semibold text-slate-900">
              1
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide">
                Scan
              </p>
              <p className="text-xs text-slate-400">Search by ISBN</p>
            </div>
          </div>

          <div className={stepLabelClass(2)}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-xs font-semibold text-slate-900">
              2
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide">
                Verify
              </p>
              <p className="text-xs text-slate-400">Confirm book details</p>
            </div>
          </div>

          <div className={stepLabelClass(3)}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-xs font-semibold text-slate-900">
              3
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide">
                Print label
              </p>
              <p className="text-xs text-slate-400">Generate barcode</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          {/* Form column */}
          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">Book details</CardTitle>
              <CardDescription className="text-slate-400">
                Start with an ISBN scan, then adjust any fields before saving.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: ISBN */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    {isSearching && (
                      <span className="text-xs text-emerald-300">
                        Searching Google Books...
                      </span>
                    )}
                  </div>
                  <Input
                    id="isbn"
                    placeholder="Scan or type ISBN"
                    autoFocus
                    className="bg-slate-950/60 border-slate-700/70 text-sm placeholder:text-slate-500"
                    {...register('isbn')}
                  />
                  <p className="text-xs text-slate-500">
                    The search runs automatically once the ISBN looks complete.
                  </p>
                  {errors.isbn && (
                    <p className="text-xs text-rose-400">
                      {errors.isbn.message}
                    </p>
                  )}
                  {searchError && (
                    <p className="text-xs text-amber-300">{searchError}</p>
                  )}
                </div>

                {/* Step 2: Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Book title"
                      className="bg-slate-950/60 border-slate-700/70 text-sm placeholder:text-slate-500"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-xs text-rose-400">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name(s)"
                      className="bg-slate-950/60 border-slate-700/70 text-sm placeholder:text-slate-500"
                      {...register('author')}
                    />
                    {errors.author && (
                      <p className="text-xs text-rose-400">
                        {errors.author.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      placeholder="Publisher"
                      className="bg-slate-950/60 border-slate-700/70 text-sm placeholder:text-slate-500"
                      {...register('publisher')}
                    />
                    {errors.publisher && (
                      <p className="text-xs text-rose-400">
                        {errors.publisher.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description / notes</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Short description or classification notes"
                      className="bg-slate-950/60 border-slate-700/70 text-sm placeholder:text-slate-500"
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-xs text-rose-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {saveError && (
                  <p className="text-sm text-rose-400">{saveError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-700/80 bg-transparent text-slate-200 hover:bg-slate-800/70"
                    onClick={() => {
                      reset();
                      setStep(1);
                      setSearchError(null);
                      setSaveError(null);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save & generate barcode'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview / Step 2–3 column */}
          <div className="space-y-4">
            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader>
                <CardTitle className="text-sm">Book preview</CardTitle>
                <CardDescription className="text-slate-400">
                  Confirm that the cover and metadata look correct before
                  saving.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative h-40 w-28 overflow-hidden rounded-md bg-slate-800">
                    {watch('cover') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={watch('cover') ?? ''}
                        alt={watch('title') ?? 'Book cover'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                        No cover
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {watch('title') || 'Title will appear here'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {watch('author') || 'Author'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {watch('publisher') || 'Publisher'}
                    </p>
                    <p className="mt-2 line-clamp-4 text-xs text-slate-500">
                      {watch('description') ||
                        'Description or notes will appear here once filled.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader>
                <CardTitle className="text-sm">Label preview</CardTitle>
                <CardDescription className="text-slate-400">
                  After saving, the generated barcode will appear here and in
                  the print dialog.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {barcodeValue ? (
                  <div
                    id="barcode-print-area"
                    className="flex flex-col items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 text-slate-900"
                  >
                    <svg ref={barcodeRef} className="h-20 w-full" />
                    <p className="text-xs font-medium tracking-wide">
                      {watch('title') || 'Title'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Save the book to generate a barcode label.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success dialog */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="max-w-sm border-slate-800 bg-slate-900 text-slate-50">
            <DialogHeader>
              <DialogTitle>Book saved</DialogTitle>
              <DialogDescription className="text-slate-400">
                A new item has been created and a barcode label is ready to
                print.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {barcodeValue && (
                <div
                  id="barcode-print-area"
                  className="flex flex-col items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 text-slate-900"
                >
                  <svg ref={barcodeRef} className="h-20 w-full" />
                  <p className="text-xs font-medium tracking-wide">
                    {barcodeValue}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-slate-700/80 bg-transparent text-slate-200 hover:bg-slate-800/70"
                onClick={() => setIsSuccessDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                onClick={handlePrintLabel}
              >
                Print label
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
