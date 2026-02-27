'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { StatsCard } from '@/components/StatsCard';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock,
  Calendar,
  ArrowUpRight,
  Search,
  Plus,
  Home,
  Package,
  UserCheck,
  FileText,
  ShoppingCart,
  Settings
} from 'lucide-react';

export default function AdminPage() {
  const supabase = createClientComponentClient<any>();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Patron',
    memberSince: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  // Recent activities data
  const recentActivities = [
    { id: 1, action: "New book added", book: "The Midnight Library", time: "2 hours ago" },
    { id: 2, action: "Book checked out", book: "Atomic Habits", time: "3 hours ago" },
    { id: 3, action: "Book returned", book: "The Great Gatsby", time: "5 hours ago" },
    { id: 4, action: "New member registered", book: "John Smith", time: "1 day ago" },
    { id: 5, action: "Book reserved", book: "1984", time: "1 day ago" },
  ];

  // Upcoming returns data
  const upcomingReturns = [
    { id: 1, book: "To Kill a Mockingbird", member: "Alice Johnson", dueDate: "Feb 28, 2026" },
    { id: 2, book: "Pride and Prejudice", member: "Bob Wilson", dueDate: "Mar 1, 2026" },
    { id: 3, book: "The Hobbit", member: "Carol Davis", dueDate: "Mar 2, 2026" },
    { id: 4, book: "Brave New World", member: "David Brown", dueDate: "Mar 3, 2026" },
  ];

  // Mock books data - replace with real Supabase data
  const mockBooks = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      category: 'Classic Literature',
      status: 'Available',
      dateAdded: 'Jan 15, 2024'
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      category: 'Classic Literature',
      status: 'Checked Out',
      dateAdded: 'Jan 10, 2024'
    }
  ];

  const memberData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Patron", memberSince: "Jan 15, 2024", status: "Active", booksBorrowed: 3 },
    { id: 2, name: "Bob Wilson", email: "bob@example.com", role: "Patron", memberSince: "Jan 10, 2024", status: "Active", booksBorrowed: 1 },
    { id: 3, name: "Carol Davis", email: "carol@example.com", role: "Librarian", memberSince: "Dec 20, 2023", status: "Active", booksBorrowed: 0 },
    { id: 4, name: "David Brown", email: "david@example.com", role: "Patron", memberSince: "Feb 01, 2024", status: "Inactive", booksBorrowed: 2 },
    { id: 5, name: "Emma Martinez", email: "emma@example.com", role: "Patron", memberSince: "Feb 10, 2024", status: "Active", booksBorrowed: 4 },
  ];

  const filteredMembers = memberData.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    // Add new member to the array (in real app, this would save to Supabase)
    const newMemberData = {
      id: memberData.length + 1,
      ...newMember,
      booksBorrowed: 0
    };
    memberData.push(newMemberData);
    
    // Reset form and close dialog
    setNewMember({
      name: '',
      email: '',
      role: 'Patron',
      memberSince: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setShowAddMemberDialog(false);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'members', label: 'Members', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'acquisitions', label: 'Acquisitions', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredBooks = mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-1">
                Library Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your library system.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Books"
                value="2,847"
                icon={BookOpen}
                trend={{ value: "12% from last month", isPositive: true }}
                iconBgColor="bg-accent"
              />
              <StatsCard
                title="Active Members"
                value="1,234"
                icon={Users}
                trend={{ value: "8% from last month", isPositive: true }}
                iconBgColor="bg-[#64748b]"
              />
              <StatsCard
                title="Books Checked Out"
                value="456"
                icon={TrendingUp}
                trend={{ value: "3% from last week", isPositive: false }}
                iconBgColor="bg-[#f59e0b]"
              />
              <StatsCard
                title="Overdue Books"
                value="23"
                icon={Clock}
                trend={{ value: "5% from last week", isPositive: false }}
                iconBgColor="bg-[#ef4444]"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="border-border">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Recent Activities</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="w-2 h-2 mt-2 rounded-full bg-accent"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.book}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Returns */}
              <Card className="border-border">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Upcoming Returns
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {upcomingReturns.map((item) => (
                      <div key={item.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.book}</p>
                          <p className="text-sm text-muted-foreground">{item.member}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{item.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                    <BookOpen className="w-6 h-6 text-accent" />
                    <span>Check Out Book</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Users className="w-6 h-6 text-accent" />
                    <span>Add New Member</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                    <TrendingUp className="w-6 h-6 text-accent" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-semibold text-foreground">Book Inventory</h1>
              <Button className="bg-accent hover:bg-accent/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, author, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Title</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Author</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ISBN</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date Added</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book) => (
                        <tr key={book.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{book.title}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{book.author}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{book.isbn}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{book.category}</td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                book.status === 'Available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {book.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{book.dateAdded}</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" className="text-xs">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-semibold text-foreground">Members</h1>
              <Button 
                onClick={() => setShowAddMemberDialog(true)}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Member Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-2xl font-semibold text-foreground">1,234</p>
                    </div>
                    <div className="w-12 h-12 bg-accent p-3 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active This Month</p>
                      <p className="text-2xl font-semibold text-foreground">89</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New This Week</p>
                      <p className="text-2xl font-semibold text-foreground">12</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Members Table */}
            <Card className="border-border">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">All Members</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Member Since</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Books Borrowed</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {member.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{member.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{member.email}</td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                member.role === 'Librarian'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {member.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{member.memberSince}</td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                member.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{member.booksBorrowed}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-xs">
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Reports</h1>
            <p className="text-muted-foreground">Reports and analytics coming soon...</p>
          </div>
        );
      case "acquisitions":
        return (
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Acquisitions</h1>
            <p className="text-muted-foreground">Acquisitions tracking coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Settings</h1>
            <p className="text-muted-foreground">System settings coming soon...</p>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Library Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your library system.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">LibraryHub</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-accent text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>

      {/* Add Member Dialog */}
      {showAddMemberDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Enter member name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Patron">Patron</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddMemberDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddMember}
                  className="flex-1 bg-accent hover:bg-accent/90 text-white"
                >
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
