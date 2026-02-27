import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { AddMemberDialog } from "./AddMemberDialog";
import { AddLibrarianDialog } from "./AddLibrarianDialog";
import { Search, MoreVertical, Edit, Trash2, Eye, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  status: "active" | "inactive" | "suspended";
  booksCheckedOut: number;
  joinDate: string;
}

interface Librarian {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "on-leave" | "inactive";
  employeeId: string;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1 (555) 123-4567",
    membershipType: "Premium",
    status: "active",
    booksCheckedOut: 3,
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Bob Wilson",
    email: "bob.wilson@email.com",
    phone: "+1 (555) 234-5678",
    membershipType: "Standard",
    status: "active",
    booksCheckedOut: 1,
    joinDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@email.com",
    phone: "+1 (555) 345-6789",
    membershipType: "Student",
    status: "active",
    booksCheckedOut: 2,
    joinDate: "2023-09-05",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1 (555) 456-7890",
    membershipType: "Senior",
    status: "inactive",
    booksCheckedOut: 0,
    joinDate: "2023-11-20",
  },
  {
    id: "5",
    name: "Emma Martinez",
    email: "emma.martinez@email.com",
    phone: "+1 (555) 567-8901",
    membershipType: "Premium",
    status: "active",
    booksCheckedOut: 5,
    joinDate: "2024-01-08",
  },
];

const mockLibrarians: Librarian[] = [
  {
    id: "1",
    name: "Sarah Thompson",
    email: "sarah.thompson@library.com",
    phone: "+1 (555) 111-2222",
    role: "Head Librarian",
    department: "Administration",
    status: "active",
    employeeId: "EMP-001",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@library.com",
    phone: "+1 (555) 222-3333",
    role: "Librarian",
    department: "Reference",
    status: "active",
    employeeId: "EMP-002",
  },
  {
    id: "3",
    name: "Jessica Lee",
    email: "jessica.lee@library.com",
    phone: "+1 (555) 333-4444",
    role: "Library Assistant",
    department: "Circulation",
    status: "active",
    employeeId: "EMP-003",
  },
  {
    id: "4",
    name: "Robert Garcia",
    email: "robert.garcia@library.com",
    phone: "+1 (555) 444-5555",
    role: "Cataloger",
    department: "Technical Services",
    status: "on-leave",
    employeeId: "EMP-004",
  },
];

export function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members] = useState<Member[]>(mockMembers);
  const [librarians] = useState<Librarian[]>(mockLibrarians);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLibrarians = librarians.filter(
    (librarian) =>
      librarian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      librarian.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMemberStatusBadge = (status: Member["status"]) => {
    const variants = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
      suspended: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
    };

    return (
      <Badge className={`${variants[status]} border font-normal`} variant="outline">
        {labels[status]}
      </Badge>
    );
  };

  const getLibrarianStatusBadge = (status: Librarian["status"]) => {
    const variants = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      "on-leave": "bg-amber-100 text-amber-700 border-amber-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const labels = {
      active: "Active",
      "on-leave": "On Leave",
      inactive: "Inactive",
    };

    return (
      <Badge className={`${variants[status]} border font-normal`} variant="outline">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">
          Members & Staff
        </h1>
        <p className="text-muted-foreground">
          Manage library members and staff information
        </p>
      </div>

      {/* Tabs with Segmented Control */}
      <Tabs defaultValue="members" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted">
            <TabsTrigger value="members" className="px-6">
              Members
            </TabsTrigger>
            <TabsTrigger value="librarians" className="px-6">
              Librarians
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <AddMemberDialog />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-2xl font-semibold text-foreground">1,234</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-semibold text-emerald-600">1,156</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-semibold text-blue-600">47</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members Table */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">All Members</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Contact</TableHead>
                      <TableHead className="font-semibold text-foreground">Membership</TableHead>
                      <TableHead className="font-semibold text-foreground">Books Out</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Join Date</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {member.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.membershipType}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-medium">
                            {member.booksCheckedOut}
                          </span>
                        </TableCell>
                        <TableCell>{getMemberStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(member.joinDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-muted rounded-md transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Librarians Tab */}
        <TabsContent value="librarians" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search librarians by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <AddLibrarianDialog />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                    <p className="text-2xl font-semibold text-foreground">24</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Staff</p>
                    <p className="text-2xl font-semibold text-emerald-600">22</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">On Leave</p>
                    <p className="text-2xl font-semibold text-amber-600">2</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Librarians Table */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">All Librarians</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Contact</TableHead>
                      <TableHead className="font-semibold text-foreground">Employee ID</TableHead>
                      <TableHead className="font-semibold text-foreground">Role</TableHead>
                      <TableHead className="font-semibold text-foreground">Department</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLibrarians.map((librarian) => (
                      <TableRow key={librarian.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{librarian.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {librarian.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {librarian.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {librarian.employeeId}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{librarian.role}</TableCell>
                        <TableCell className="text-muted-foreground">{librarian.department}</TableCell>
                        <TableCell>{getLibrarianStatusBadge(librarian.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-muted rounded-md transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                Showing {filteredLibrarians.length} of {librarians.length} librarians
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
