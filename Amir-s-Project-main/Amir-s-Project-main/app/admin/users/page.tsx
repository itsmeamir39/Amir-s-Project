"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { adminNav } from "@/lib/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser, getUserRole } from "@/services/auth";
import type { BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserRow = {
  id: string;
  role: string;
};

function RoleBadge({ role }: { role: string }) {
  const variant: BadgeProps["variant"] = role === "Admin" ? "default" : "secondary";
  return (
    <Badge variant={variant} className="capitalize">
      {role}
    </Badge>
  );
}

export default function AdminUsersPage() {
  const [supabase, setSupabase] = React.useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [search, setSearch] = React.useState("");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [newUserId, setNewUserId] = React.useState("");
  const [newUserRole, setNewUserRole] = React.useState("Patron");

  const [editOpen, setEditOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState<UserRow | null>(null);
  const [editRole, setEditRole] = React.useState("");

  const load = React.useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const current = await getCurrentUser(supabase);
      const role = await getUserRole(supabase, current.id);
      if (role !== "Admin") {
        toast.error("Admin access required.");
        return;
      }

      const { data, error } = await supabase.from("users").select("id, role").order("role", { ascending: true });
      if (error) throw new Error(error.message);
      setUsers((data ?? []).map((u) => ({ id: u.id, role: u.role })));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.id.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [search, users]);

  const openEdit = (u: UserRow) => {
    setEditUser(u);
    setEditRole(u.role);
    setEditOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const id = newUserId.trim();
    const role = newUserRole.trim();
    if (!id || !role) {
      toast.error("User id and role are required.");
      return;
    }

    try {
      const { error } = await supabase.from("users").insert({ id, role });
      if (error) throw new Error(error.message);
      toast.success("User record created.");
      setCreateOpen(false);
      setNewUserId("");
      setNewUserRole("Patron");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user.");
    }
  };

  const handleSaveRole = async () => {
    if (!supabase || !editUser) return;
    const nextRole = editRole.trim();
    if (!nextRole) {
      toast.error("Role is required.");
      return;
    }

    try {
      const { error } = await supabase.from("users").update({ role: nextRole }).eq("id", editUser.id);
      if (error) throw new Error(error.message);
      toast.success("Role updated.");
      setEditOpen(false);
      setEditUser(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role.");
    }
  };

  return (
    <DashboardLayout items={adminNav} title="LibraryMS" roleLabel="Admin">
      <PageHeader
        title="User Management"
        description="Manage application roles stored in Supabase `public.users`."
        actions={
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user id or role…"
            className="pl-10 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          TODO: Emails and full user lifecycle require an admin server route (Supabase Auth admin API) or storing email/name/status in `public.users`.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-sm text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell>
                    <RoleBadge role={u.role} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add User Record</DialogTitle>
            <DialogDescription>
              This inserts into <span className="font-mono">public.users</span>. You must create the Auth user separately in Supabase Auth.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newUserId">Auth User ID (UUID)</Label>
              <Input
                id="newUserId"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="e.g. 3b0a4c5e-..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserRole">Role</Label>
              <Input
                id="newUserRole"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                placeholder="Admin | Librarian | Patron"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the role stored in <span className="font-mono">public.users</span>.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input value={editUser?.id ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Input
                id="editRole"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                placeholder="Admin | Librarian | Patron"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditOpen(false);
                setEditUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveRole}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

