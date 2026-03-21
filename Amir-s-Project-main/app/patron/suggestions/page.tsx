"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";

export default function PatronSuggestionsPage() {
  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Suggestions" description="Recommend books to add to the collection" />
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          TODO: Wire this page to a `suggestions` table and allow patrons to submit requests.
        </p>
      </div>
    </DashboardLayout>
  );
}

