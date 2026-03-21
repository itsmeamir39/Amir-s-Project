"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser, getUserRole, signInWithPassword } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setResetMode(true);
      setInfo("Reset link detected. Enter a new password.");
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setResetMode(true);
        setInfo("Password recovery started. Enter your new password.");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await signInWithPassword(supabase, email, password);
      if (signInError) throw new Error(signInError.message);

      const user = await getCurrentUser(supabase);
      const role = await getUserRole(supabase, user.id);

      if (role === "Admin") router.replace("/admin");
      else if (role === "Librarian") router.replace("/librarian");
      else router.replace("/patron");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError("Enter your email first to receive a reset link.");
      return;
    }
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw new Error(resetError.message);
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email.");
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw new Error(updateError.message);

      await supabase.auth.signOut();
      setResetMode(false);
      setNewPassword("");
      setConfirmPassword("");
      setInfo("Password updated. You can now sign in with your new password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20" />
        <div className="relative z-10 px-16 text-primary-foreground">
          <BookOpen className="h-16 w-16 mb-8 text-accent" />
          <h1 className="text-5xl font-display font-bold mb-4 leading-tight">
            Library
            <br />
            Management
            <br />
            System
          </h1>
          <p className="text-lg opacity-80 max-w-md font-body">
            Streamline your library operations with a unified dashboard for admins, librarians, and patrons.
          </p>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/10 -mr-32 -mb-32" />
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent/5" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-2xl font-display font-bold text-foreground">LibraryMS</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">
              {info}
            </div>
          )}

          {resetMode ? (
            <form onSubmit={handleCompleteReset} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                  New password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-card border-border"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-card border-border"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11 text-base font-semibold"
              >
                {loading ? "Updating password..." : "Set new password"}
              </Button>

              <Button type="button" variant="ghost" className="w-full" onClick={() => setResetMode(false)}>
                Back to sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@library.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-card border-border"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <button type="button" className="text-xs text-accent hover:underline" onClick={handleResetPassword}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-card border-border"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11 text-base font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground">Role assignment comes from `public.users.role`.</p>
        </div>
      </div>
    </div>
  );
}

