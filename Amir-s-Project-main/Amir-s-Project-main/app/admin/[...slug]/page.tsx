"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { adminNav } from "@/lib/navigation";
import { useParams } from "next/navigation";

export default function AdminSubPage() {
  const params = useParams<{ slug?: string[] }>();
  const slug = params?.slug ?? [];
  const path = `/admin/${Array.isArray(slug) ? slug.join("/") : slug}`;

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader title="Admin" description={path} />
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          TODO: Port the Library Hub page for <span className="font-medium">{path}</span> and wire to Supabase tables.
        </p>
      </div>
    </DashboardLayout>
  );
}

