import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Send, Mail, Bell, Clock, BookOpen } from "lucide-react";
import { adminNav } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";

const overdueBooks = [
  { id: 1, patron: "John Doe", email: "john@example.com", book: "Clean Code", dueDate: "2026-03-01", daysOverdue: 10 },
  { id: 2, patron: "Sarah Connor", email: "sarah@example.com", book: "Design Patterns", dueDate: "2026-03-05", daysOverdue: 6 },
  { id: 3, patron: "Mike Ross", email: "mike@example.com", book: "Refactoring", dueDate: "2026-03-08", daysOverdue: 3 },
];

const reservationAlerts = [
  { id: 1, patron: "Lisa Ray", email: "lisa@example.com", book: "Atomic Habits", availableSince: "2026-03-10", status: "Pending Pickup" },
  { id: 2, patron: "Alex Kim", email: "alex@example.com", book: "The Pragmatic Programmer", availableSince: "2026-03-09", status: "Notified" },
];

const sentNotifications = [
  { id: 1, type: "Overdue", recipient: "john@example.com", subject: "Overdue: Clean Code", sentAt: "2026-03-10 09:00" },
  { id: 2, type: "Reservation", recipient: "lisa@example.com", subject: "Book Available: Atomic Habits", sentAt: "2026-03-10 08:30" },
  { id: 3, type: "Announcement", recipient: "All Patrons", subject: "Library Hours Update", sentAt: "2026-03-09 14:00" },
];

const Notifications = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendAnnouncement = () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Validation Error", description: "Subject and message are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Announcement Sent", description: `"${subject}" sent to all patrons.` });
    setSubject("");
    setMessage("");
  };

  const handleSendOverdueReminders = () => {
    toast({ title: "Overdue Reminders Sent", description: `${overdueBooks.length} email reminders sent to patrons with overdue books.` });
  };

  const handleSendReservationAlerts = () => {
    toast({ title: "Reservation Alerts Sent", description: `${reservationAlerts.length} email alerts sent for available reservations.` });
  };

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader title="Notifications" description="Send announcements, overdue reminders, and reservation alerts" />
      <Tabs defaultValue="overdue" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="overdue"><Clock className="h-4 w-4 mr-1.5" />Overdue Reminders</TabsTrigger>
          <TabsTrigger value="reservation"><BookOpen className="h-4 w-4 mr-1.5" />Reservation Alerts</TabsTrigger>
          <TabsTrigger value="announcement"><Bell className="h-4 w-4 mr-1.5" />Announcement</TabsTrigger>
          <TabsTrigger value="history"><Mail className="h-4 w-4 mr-1.5" />Sent History</TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="space-y-4">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-foreground">Overdue Book Reminders</h3>
                <p className="text-sm text-muted-foreground">Send email reminders to patrons with overdue books</p>
              </div>
              <Button onClick={handleSendOverdueReminders} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="h-4 w-4 mr-2" /> Send All Reminders
              </Button>
            </div>
            <DataTable
              columns={[
                { header: "Patron", accessor: "patron" },
                { header: "Email", accessor: "email", className: "text-muted-foreground" },
                { header: "Book", accessor: "book" },
                { header: "Due Date", accessor: "dueDate", className: "font-mono text-sm" },
                {
                  header: "Days Overdue",
                  accessor: (row) => (
                    <Badge variant="destructive">{row.daysOverdue} days</Badge>
                  ),
                },
                {
                  header: "",
                  accessor: (row) => (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({ title: "Reminder Sent", description: `Email sent to ${row.email}` })}
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" /> Send
                    </Button>
                  ),
                },
              ]}
              data={overdueBooks}
            />
          </div>
        </TabsContent>

        <TabsContent value="reservation" className="space-y-4">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-foreground">Reservation Availability Alerts</h3>
                <p className="text-sm text-muted-foreground">Notify patrons when their reserved books are available for pickup</p>
              </div>
              <Button onClick={handleSendReservationAlerts} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="h-4 w-4 mr-2" /> Notify All
              </Button>
            </div>
            <DataTable
              columns={[
                { header: "Patron", accessor: "patron" },
                { header: "Email", accessor: "email", className: "text-muted-foreground" },
                { header: "Book", accessor: "book" },
                { header: "Available Since", accessor: "availableSince", className: "font-mono text-sm" },
                {
                  header: "Status",
                  accessor: (row) => (
                    <Badge variant={row.status === "Notified" ? "secondary" : "default"}>{row.status}</Badge>
                  ),
                },
                {
                  header: "",
                  accessor: (row) => (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({ title: "Alert Sent", description: `Availability alert sent to ${row.email}` })}
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" /> Notify
                    </Button>
                  ),
                },
              ]}
              data={reservationAlerts}
            />
          </div>
        </TabsContent>

        <TabsContent value="announcement" className="mt-4">
          <div className="glass-card rounded-xl p-6 space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label className="text-foreground">Subject</Label>
              <Input placeholder="Announcement subject..." className="bg-background" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Message</Label>
              <Textarea placeholder="Write your announcement..." rows={5} className="bg-background" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <Button onClick={handleSendAnnouncement} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Send className="h-4 w-4 mr-2" /> Send Announcement
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Recently Sent Notifications</h3>
            <DataTable
              columns={[
                {
                  header: "Type",
                  accessor: (row) => (
                    <Badge variant={row.type === "Overdue" ? "destructive" : row.type === "Reservation" ? "default" : "secondary"}>
                      {row.type}
                    </Badge>
                  ),
                },
                { header: "Recipient", accessor: "recipient", className: "text-muted-foreground" },
                { header: "Subject", accessor: "subject" },
                { header: "Sent At", accessor: "sentAt", className: "font-mono text-sm" },
              ]}
              data={sentNotifications}
            />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Notifications;
