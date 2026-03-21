import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export interface UserFormData {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  barcode: string;
}

export const generateBarcode = (id?: number): string => {
  const num = id || Date.now();
  return `LIB${String(num).padStart(8, "0")}`;
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
}

const emptyUser: UserFormData = { name: "", email: "", role: "Patron", status: "Active", barcode: "" };

const UserFormDialog = ({ open, onOpenChange, user, onSubmit }: UserFormDialogProps) => {
  const [form, setForm] = useState<UserFormData>(emptyUser);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!user?.id;

  useEffect(() => {
    if (open) {
      setForm(user ? { ...user } : { ...emptyUser });
      setErrors({});
    }
  }, [open, user]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.name.trim().length > 100) e.name = "Name must be under 100 characters";
    if (!form.email.trim()) e.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Invalid email format";
    if (!form.role) e.role = "Role is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const id = user?.id || Date.now();
    onSubmit({ ...form, id, barcode: form.barcode || generateBarcode(id) });
    toast({ title: isEdit ? "User Updated" : "User Created", description: `${form.name} has been ${isEdit ? "updated" : "created"} successfully.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="John Doe" maxLength={100} />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="john@library.com" maxLength={255} />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm(prev => ({ ...prev, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Librarian">Librarian</SelectItem>
                <SelectItem value="Patron">Patron</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isEdit ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
