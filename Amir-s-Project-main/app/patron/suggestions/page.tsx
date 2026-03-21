"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { patronNav } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SuggestionRow = {
  id: number;
  title: string;
  author: string | null;
  reason: string | null;
  status: string;
  created_at: string;
};

export default function PatronSuggestionsPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState<SuggestionRow[]>([]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("/api/patron/suggestions", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Failed to load suggestion history.");
      setHistory((payload.suggestions ?? []) as SuggestionRow[]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load suggestion history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/patron/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        title,
        author: author || null,
        reason: reason || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Failed to submit suggestion.");
      setTitle("");
      setAuthor("");
      setReason("");
      toast.success("Suggestion submitted.");
      await loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit suggestion.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Suggestions" description="Recommend books to add to the collection" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <form className="space-y-4" onSubmit={submit}>
            <Input placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input placeholder="Author (optional)" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <Textarea placeholder="Why should we add this?" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Button type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit suggestion"}
            </Button>
          </form>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Your Suggestions</h3>
          {loadingHistory ? (
            <p className="text-sm text-muted-foreground">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have not submitted any suggestions yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-sm">{item.title}</p>
                    <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.author ? `Author: ${item.author}` : "Author not specified"}
                  </p>
                  {item.reason && <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>}
                  <p className="text-[11px] text-muted-foreground mt-2">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

