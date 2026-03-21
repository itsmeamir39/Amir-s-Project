import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Eye } from "lucide-react";
import { adminNav } from "@/lib/navigation";
import UserFormDialog, { type UserFormData, generateBarcode } from "@/components/UserFormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";
import Barcode from "react-barcode";

const initialUsers: UserFormData[] = [
  { id: 1, name: "John Doe", email: "john@library.com", role: "Patron", status: "Active", barcode: generateBarcode(1) },
  { id: 2, name: "Jane Smith", email: "jane@library.com", role: "Librarian", status: "Active", barcode: generateBarcode(2) },
  { id: 3, name: "Mike Ross", email: "mike@library.com", role: "Patron", status: "Inactive", barcode: generateBarcode(3) },
  { id: 4, name: "Sarah Connor", email: "sarah@library.com", role: "Patron", status: "Active", barcode: generateBarcode(4) },
  { id: 5, name: "Tom Hardy", email: "tom@library.com", role: "Admin", status: "Active", barcode: generateBarcode(5) },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserFormData | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserFormData | null>(null);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<UserFormData | null>(null);

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (data: UserFormData) => {
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === data.id ? data : u));
    } else {
      setUsers(prev => [...prev, data]);
    }
  };

  const handleDeactivate = (user: UserFormData) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
    toast({ title: "Status Updated", description: `${user.name} is now ${user.status === "Active" ? "Inactive" : "Active"}.` });
  };

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader
        title="User Management"
        description="Manage library users and their roles"
        actions={
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditUser(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10 bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <DataTable
        columns={[
          { header: "Name", accessor: "name" as any },
          { header: "Email", accessor: "email" as any },
          { header: "Barcode", accessor: (row: any) => (
            <span className="font-mono text-xs text-muted-foreground">{row.barcode}</span>
          )},
          {
            header: "Role",
            accessor: (row: any) => (
              <Badge variant={row.role === "Admin" ? "default" : "secondary"} className="capitalize">{row.role}</Badge>
            ),
          },
          {
            header: "Status",
            accessor: (row: any) => (
              <span className={`text-sm font-medium ${row.status === "Active" ? "text-success" : "text-muted-foreground"}`}>{row.status}</span>
            ),
          },
          {
            header: "Actions",
            accessor: (row: any) => (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setViewUser(row)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => { setEditUser(row); setFormOpen(true); }}>Edit</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleDeactivate(row)}>
                  {row.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            ),
          },
        ]}
        data={filtered as any}
      />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editUser} onSubmit={handleSubmit} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteTarget) setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
        }}
      />

      {/* User Detail Dialog with Barcode */}
      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{viewUser.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{viewUser.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <Badge variant={viewUser.role === "Admin" ? "default" : "secondary"}>{viewUser.role}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className={`text-sm font-medium ${viewUser.status === "Active" ? "text-success" : "text-muted-foreground"}`}>{viewUser.status}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Member Barcode</p>
                <Barcode value={viewUser.barcode} width={2} height={60} fontSize={14} background="transparent" lineColor="currentColor" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
