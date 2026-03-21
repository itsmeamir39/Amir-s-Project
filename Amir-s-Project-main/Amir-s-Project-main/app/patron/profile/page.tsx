"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser, getUserRole } from "@/services/auth";

export default function PatronProfilePage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const run = async () => {
      try {
        const user = await getCurrentUser(supabase);
        setEmail(user.email ?? null);
        setRole(await getUserRole(supabase, user.id));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load profile.");
      }
    };
    void run();
  }, [supabase]);

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Profile" description="Account details" />

      <div className="glass-card rounded-xl p-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Role</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{role ?? "—"}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-muted-foreground">
          TODO: Add editable profile fields and connect to your `users` table (name, phone, address, etc.).
        </p>
      </div>
    </DashboardLayout>
  );
}

