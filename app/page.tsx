'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

type LoginValues = z.infer<typeof loginSchema>;

type UserRole = 'Admin' | 'Librarian' | 'Patron';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<any>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [formError, setFormError] = React.useState<string | null>(null);

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

    if (authError || !authData.user) {
      setFormError(authError?.message ?? 'Invalid email or password.');
      return;
    }

    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userRecord?.role) {
      setFormError('Your account is missing a role. Please contact support.');
      return;
    }

    const role = userRecord.role as UserRole;

    if (role === 'Admin') {
      router.push('/admin');
    } else if (role === 'Librarian') {
      router.push('/librarian');
    } else if (role === 'Patron') {
      router.push('/dashboard');
    } else {
      setFormError('Unknown role assigned to your account.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-50">
      {/* Image side */}
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80"
          alt="Cozy library with bookshelves"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-emerald-700/60" />

        <div className="relative z-10 flex h-full items-center px-16 py-10">
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/40">
              Modern Library Management
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-50 lg:text-5xl">
              Welcome back to your
              <span className="block bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">
                digital library desk
              </span>
            </h1>
            <p className="text-base text-slate-200/80">
              Manage collections, track loans, and serve patrons from a single,
              intuitive workspace designed for modern libraries.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-200/80">
              <div className="flex flex-col">
                <span className="font-medium text-emerald-200">
                  Role-aware access
                </span>
                <span>Tailored dashboards for Admins, Librarians, and Patrons.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col gap-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-50">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-400">
              Access your personalized library workspace in a few seconds.
            </p>
          </div>

          <Card className="border border-slate-200/10 bg-slate-900/40 text-slate-50 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your credentials to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="bg-slate-900/60 border-slate-700/60 text-slate-50 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/reset-password"
                      className="text-xs font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
                    >
                      Reset password
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="bg-slate-900/60 border-slate-700/60 text-slate-50 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-xs text-rose-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="text-sm text-rose-400">{formError}</p>
                )}

                <Button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing you in...' : 'Sign in'}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Having trouble accessing your account? Contact your system
                administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
