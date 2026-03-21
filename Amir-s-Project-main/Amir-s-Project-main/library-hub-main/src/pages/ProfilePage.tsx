import { useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Printer, Download } from "lucide-react";
import Barcode from "react-barcode";
import { generateBarcode } from "@/components/UserFormDialog";
import { toast } from "@/hooks/use-toast";
import { adminNav, librarianNav, patronNav } from "@/lib/navigation";
import type { SidebarNavItem } from "@/components/AppSidebar";

interface ProfilePageProps {
  role: "Admin" | "Librarian" | "Patron";
}

const roleConfig: Record<string, { nav: SidebarNavItem[]; userId: number; name: string; email: string }> = {
  Admin: { nav: adminNav, userId: 99, name: "Admin User", email: "admin@library.com" },
  Librarian: { nav: librarianNav, userId: 50, name: "Librarian Staff", email: "librarian@library.com" },
  Patron: { nav: patronNav, userId: 1, name: "John Doe", email: "john@library.com" },
};

const ProfilePage = ({ role }: ProfilePageProps) => {
  const config = roleConfig[role];
  const userBarcode = generateBarcode(config.userId);
  const barcodeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const el = barcodeRef.current;
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Library Member Card</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}
      h2{margin-bottom:8px;} p{color:#666;font-size:12px;margin-top:4px;}</style></head>
      <body><h2>Library Member Card</h2>${el.innerHTML}<p>${config.name} — ${role}</p>
      <script>window.print();window.close();</script></body></html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const svg = barcodeRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.download = `member-barcode-${userBarcode}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast({ title: "Downloaded", description: "Barcode image saved." });
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
  };

  return (
    <DashboardLayout items={config.nav} title="LibraryMS" roleLabel={role}>
      <PageHeader title="My Profile" description="Manage your account settings" />
      <div className="max-w-xl space-y-6">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-3">
          <h3 className="font-display font-semibold text-foreground">Library Member Card</h3>
          <div ref={barcodeRef}>
            <Barcode value={userBarcode} width={2} height={70} fontSize={14} background="transparent" lineColor="currentColor" />
          </div>
          <p className="text-xs text-muted-foreground">{config.name} — {role}</p>
          <div className="flex gap-2 mt-1">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-foreground">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">First Name</Label>
              <Input defaultValue={config.name.split(" ")[0]} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Last Name</Label>
              <Input defaultValue={config.name.split(" ").slice(1).join(" ")} className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Email</Label>
            <Input defaultValue={config.email} className="bg-background" disabled />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Phone</Label>
            <Input defaultValue="+1 (555) 123-4567" className="bg-background" />
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-foreground">Change Password</h3>
          <div className="space-y-2">
            <Label className="text-foreground">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">New Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Confirm New Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background" />
          </div>
          <Button variant="outline">Update Password</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
