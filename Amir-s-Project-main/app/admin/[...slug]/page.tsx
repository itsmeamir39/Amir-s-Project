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
        <p className="text-sm text-muted-foreground mb-3">
          This route is active and uses shared admin shell. Select one of the implemented modules from the sidebar.
        </p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>`/admin/users` for user role management</li>
          <li>`/admin/settings` for circulation and global settings</li>
          <li>`/admin` for live operational metrics</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

