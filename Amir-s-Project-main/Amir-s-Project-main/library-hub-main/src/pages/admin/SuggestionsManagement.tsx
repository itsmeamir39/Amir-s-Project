import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Eye } from "lucide-react";
import { adminNav } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";

const allSuggestions = [
  { id: 1, patron: "John Doe", category: "Book Request", subject: "Add more sci-fi titles", details: "I'd love to see more science fiction books, especially from authors like Liu Cixin and Becky Chambers.", date: "2026-03-08", status: "Under Review" },
  { id: 2, patron: "Sarah Connor", category: "Facility", subject: "More power outlets in reading area", details: "The reading area on the second floor has very few power outlets. Would be great to add more for laptop users.", date: "2026-03-06", status: "Acknowledged" },
  { id: 3, patron: "Mike Ross", category: "Service", subject: "Extend weekend hours", details: "It would be great if the library could stay open until 8 PM on Saturdays.", date: "2026-03-01", status: "Under Review" },
  { id: 4, patron: "Lisa Ray", category: "Digital", subject: "E-book lending system", details: "Would love to see an e-book lending feature integrated into the library system.", date: "2026-02-28", status: "Implemented" },
  { id: 5, patron: "Alex Kim", category: "Other", subject: "Quiet study rooms booking", details: "It would help to have an online booking system for quiet study rooms.", date: "2026-02-25", status: "Acknowledged" },
];

const SuggestionsManagement = ({ role = "Admin", navItems }: { role?: string; navItems: typeof adminNav }) => {
  const { toast } = useToast();
  const [viewSuggestion, setViewSuggestion] = useState<typeof allSuggestions[0] | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  const handleStatusUpdate = (id: number, newStatus: string) => {
    toast({ title: "Status Updated", description: `Suggestion #${id} marked as "${newStatus}".` });
  };

  return (
    <DashboardLayout items={navItems} title="LibraryMS" roleLabel={role}>
      <PageHeader title="Patron Suggestions" description="Review and manage suggestions from patrons" />
      <DataTable
        columns={[
          { header: "Patron", accessor: "patron" },
          {
            header: "Category",
            accessor: (row) => <Badge variant="secondary">{row.category}</Badge>,
          },
          { header: "Subject", accessor: "subject" },
          { header: "Date", accessor: "date", className: "font-mono text-sm" },
          {
            header: "Status",
            accessor: (row) => (
              <Select defaultValue={row.status} onValueChange={(val) => handleStatusUpdate(row.id, val)}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="Implemented">Implemented</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            ),
          },
          {
            header: "",
            accessor: (row) => (
              <Button size="sm" variant="outline" onClick={() => { setViewSuggestion(row); setAdminResponse(""); }}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View
              </Button>
            ),
          },
        ]}
        data={allSuggestions}
      />

      <Dialog open={!!viewSuggestion} onOpenChange={() => setViewSuggestion(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" />
              {viewSuggestion?.subject}
            </DialogTitle>
            <DialogDescription>
              From {viewSuggestion?.patron} · {viewSuggestion?.category} · {viewSuggestion?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground">
              {viewSuggestion?.details}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Response (optional)</Label>
              <Textarea
                placeholder="Write a response to the patron..."
                rows={3}
                className="bg-background"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
              />
            </div>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => {
                toast({ title: "Response Sent", description: `Response sent to ${viewSuggestion?.patron}.` });
                setViewSuggestion(null);
              }}
            >
              Send Response
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SuggestionsManagement;
