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
        <p className="text-sm text-muted-foreground mb-3">
          This route is available under the librarian workspace. Use the implemented flows for day-to-day operations.
        </p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>`/librarian/add-book` for catalog intake and barcode generation</li>
          <li>`/librarian` for live dashboard metrics</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

