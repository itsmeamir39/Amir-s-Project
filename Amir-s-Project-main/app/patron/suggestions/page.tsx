"use client";

import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PatronSuggestionsPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const user = await getCurrentUser(supabase);
      const { error } = await supabase.from("suggestions").insert({
        user_id: user.id,
        title,
        author: author || null,
        reason: reason || null,
        status: "pending",
      });
      if (error) throw new Error(error.message);
      setTitle("");
      setAuthor("");
      setReason("");
      toast.success("Suggestion submitted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit suggestion.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Suggestions" description="Recommend books to add to the collection" />
      <div className="glass-card rounded-xl p-6 max-w-2xl">
        <form className="space-y-4" onSubmit={submit}>
          <Input placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input placeholder="Author (optional)" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <Textarea placeholder="Why should we add this?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <Button type="submit" disabled={saving}>
            {saving ? "Submitting..." : "Submit suggestion"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}

