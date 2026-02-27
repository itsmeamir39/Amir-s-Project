'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  TrendingDown,
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
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock statistics - replace with real data
  const stats = [
    {
      title: 'Total Books',
      value: '2,847',
      change: '+12%',
      changeType: 'up',
      period: 'from last month',
      icon: BookOpen
    },
    {
      title: 'Active Members',
      value: '1,234',
      change: '+8%',
      changeType: 'up',
      period: 'from last month',
      icon: Users
    },
    {
      title: 'Books Checked Out',
      value: '456',
      change: '-3%',
      changeType: 'down',
      period: 'from last week',
      icon: BookOpen
    },
    {
      title: 'Overdue Books',
      value: '23',
      change: '-5%',
      changeType: 'down',
      period: 'from last week',
      icon: TrendingDown
    }
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

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
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
                      ? 'bg-teal-500 text-white'
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
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Library Dashboard</h2>
              <p className="text-slate-600">Welcome back! Here's an overview of your library system.</p>
            </div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Quick Add Book
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {stat.changeType === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'}>
                            {stat.change} {stat.period}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-slate-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Book Inventory Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Book Inventory</CardTitle>
                <p className="text-sm text-slate-500">Last updated: Today, 2:45 PM</p>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Books Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Author</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ISBN</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date Added</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{book.title}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{book.author}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{book.isbn}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{book.category}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              book.status === 'Available'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {book.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{book.dateAdded}</td>
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
      </div>
    </div>
  );
}
