import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { adminNav } from "@/lib/navigation";

const SystemSettings = () => (
  <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
    <PageHeader title="System Settings" description="Configure library rules and policies" />
    <div className="max-w-2xl space-y-6">
      {[
        { label: "Default Loan Duration (days)", defaultValue: "14" },
        { label: "Maximum Borrow Limit", defaultValue: "5" },
        { label: "Fine Per Day ($)", defaultValue: "0.50" },
        { label: "Reservation Hold Period (hours)", defaultValue: "48" },
      ].map((setting) => (
        <div key={setting.label} className="glass-card rounded-xl p-6">
          <Label className="text-foreground font-medium">{setting.label}</Label>
          <Input defaultValue={setting.defaultValue} className="mt-2 bg-background max-w-xs" />
        </div>
      ))}
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Save className="h-4 w-4 mr-2" /> Save Settings
      </Button>
    </div>
  </DashboardLayout>
);

export default SystemSettings;
