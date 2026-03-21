"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { librarianNav } from "@/lib/navigation";
import { useParams } from "next/navigation";

export default function LibrarianSubPage() {
  const params = useParams<{ slug?: string[] }>();
  const slug = params?.slug ?? [];
  const path = `/librarian/${Array.isArray(slug) ? slug.join("/") : slug}`;

  return (
    <DashboardLayout items={librarianNav} title="LibraryMS" roleLabel="Librarian">
      <PageHeader title="Librarian" description={path} />
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          TODO: Port the Library Hub page for <span className="font-medium">{path}</span> and wire to Supabase.
        </p>
      </div>
    </DashboardLayout>
  );
}

