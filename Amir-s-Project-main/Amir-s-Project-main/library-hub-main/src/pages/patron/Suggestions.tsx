import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MessageSquare } from "lucide-react";
import { patronNav } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";

const mySuggestions = [
  { id: 1, category: "Book Request", subject: "Add more sci-fi titles", date: "2026-03-08", status: "Under Review" },
  { id: 2, category: "Facility", subject: "More power outlets in reading area", date: "2026-03-01", status: "Acknowledged" },
  { id: 3, category: "Service", subject: "Extend weekend hours", date: "2026-02-20", status: "Implemented" },
];

const Suggestions = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (!category || !subject.trim() || !details.trim()) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Suggestion Submitted", description: "Thank you for your feedback!" });
    setCategory("");
    setSubject("");
    setDetails("");
  };

  return (
    <DashboardLayout items={patronNav} title="LibraryMS" roleLabel="Patron">
      <PageHeader title="Suggestion Box" description="Share your ideas and feedback with the library" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-accent" />
            <h3 className="font-display font-semibold text-foreground">Submit a Suggestion</h3>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Book Request">Book Request</SelectItem>
                <SelectItem value="Service">Service Improvement</SelectItem>
                <SelectItem value="Facility">Facility</SelectItem>
                <SelectItem value="Digital">Digital Services</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Subject</Label>
            <Input placeholder="Brief subject..." className="bg-background" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Details</Label>
            <Textarea placeholder="Describe your suggestion in detail..." rows={5} className="bg-background" value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-4 w-4 mr-2" /> Submit Suggestion
          </Button>
        </div>

        <div>
          <h3 className="font-display font-semibold text-foreground mb-4">My Suggestions</h3>
          <DataTable
            columns={[
              {
                header: "Category",
                accessor: (row) => <Badge variant="secondary">{row.category}</Badge>,
              },
              { header: "Subject", accessor: "subject" },
              { header: "Date", accessor: "date", className: "font-mono text-sm" },
              {
                header: "Status",
                accessor: (row) => (
                  <Badge variant={row.status === "Implemented" ? "default" : row.status === "Under Review" ? "secondary" : "outline"}>
                    {row.status}
                  </Badge>
                ),
              },
            ]}
            data={mySuggestions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Suggestions;
