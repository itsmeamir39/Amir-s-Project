import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Download, TrendingUp, DollarSign, Users, BookOpen, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

export function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("this-month");

  const popularBooks = [
    { id: 1, title: "The Midnight Library", author: "Matt Haig", checkouts: 47, category: "Fiction" },
    { id: 2, title: "Atomic Habits", author: "James Clear", checkouts: 43, category: "Self-Help" },
    { id: 3, title: "Where the Crawdads Sing", author: "Delia Owens", checkouts: 39, category: "Fiction" },
    { id: 4, title: "Educated", author: "Tara Westover", checkouts: 35, category: "Biography" },
    { id: 5, title: "The Silent Patient", author: "Alex Michaelides", checkouts: 32, category: "Thriller" },
    { id: 6, title: "Becoming", author: "Michelle Obama", checkouts: 28, category: "Biography" },
    { id: 7, title: "The Vanishing Half", author: "Brit Bennett", checkouts: 26, category: "Fiction" },
    { id: 8, title: "Project Hail Mary", author: "Andy Weir", checkouts: 24, category: "Sci-Fi" },
  ];

  const fineReports = [
    { id: 1, member: "Alice Johnson", book: "The Great Gatsby", daysOverdue: 5, fineAmount: "$5.00", status: "paid" },
    { id: 2, member: "Bob Wilson", book: "1984", daysOverdue: 3, fineAmount: "$3.00", status: "pending" },
    { id: 3, member: "Carol Davis", book: "Pride and Prejudice", daysOverdue: 7, fineAmount: "$7.00", status: "paid" },
    { id: 4, member: "David Brown", book: "The Hobbit", daysOverdue: 2, fineAmount: "$2.00", status: "pending" },
    { id: 5, member: "Emma Martinez", book: "Brave New World", daysOverdue: 10, fineAmount: "$10.00", status: "overdue" },
    { id: 6, member: "Frank Anderson", book: "To Kill a Mockingbird", daysOverdue: 4, fineAmount: "$4.00", status: "paid" },
  ];

  const memberActivity = [
    { id: 1, member: "Alice Johnson", booksRead: 23, favoriteGenre: "Fiction", lastVisit: "2 days ago", activeMonths: 12 },
    { id: 2, member: "Emma Martinez", booksRead: 19, favoriteGenre: "Romance", lastVisit: "1 day ago", activeMonths: 8 },
    { id: 3, member: "Carol Davis", booksRead: 17, favoriteGenre: "Mystery", lastVisit: "5 days ago", activeMonths: 15 },
    { id: 4, member: "Bob Wilson", booksRead: 15, favoriteGenre: "Sci-Fi", lastVisit: "3 days ago", activeMonths: 6 },
    { id: 5, member: "Michael Lee", booksRead: 14, favoriteGenre: "Biography", lastVisit: "1 week ago", activeMonths: 10 },
  ];

  const categoryStats = [
    { category: "Fiction", checkouts: 342, percentage: 28 },
    { category: "Non-Fiction", checkouts: 287, percentage: 24 },
    { category: "Science Fiction", checkouts: 198, percentage: 16 },
    { category: "Biography", checkouts: 156, percentage: 13 },
    { category: "Mystery", checkouts: 134, percentage: 11 },
    { category: "Other", checkouts: 98, percentage: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Track library performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Total Checkouts</p>
                <h3 className="text-3xl font-semibold text-foreground">1,215</h3>
                <p className="text-sm mt-2 text-emerald-600">↑ 12.5% from last month</p>
              </div>
              <div className="bg-accent p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Active Members</p>
                <h3 className="text-3xl font-semibold text-foreground">892</h3>
                <p className="text-sm mt-2 text-emerald-600">↑ 8.3% from last month</p>
              </div>
              <div className="bg-[#64748b] p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Fines Collected</p>
                <h3 className="text-3xl font-semibold text-foreground">$324</h3>
                <p className="text-sm mt-2 text-red-600">↓ 5.2% from last month</p>
              </div>
              <div className="bg-[#f59e0b] p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Avg. Circulation</p>
                <h3 className="text-3xl font-semibold text-foreground">3.2</h3>
                <p className="text-sm mt-2 text-emerald-600">↑ 0.3 from last month</p>
              </div>
              <div className="bg-accent p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="circulation" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="circulation">Circulation</TabsTrigger>
          <TabsTrigger value="fines">Fines</TabsTrigger>
          <TabsTrigger value="members">Member Activity</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Circulation Report */}
        <TabsContent value="circulation" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Most Popular Books</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Rank</TableHead>
                      <TableHead className="font-semibold text-foreground">Title</TableHead>
                      <TableHead className="font-semibold text-foreground">Author</TableHead>
                      <TableHead className="font-semibold text-foreground">Category</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">Checkouts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularBooks.map((book, index) => (
                      <TableRow key={book.id} className="hover:bg-muted/30">
                        <TableCell>
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-semibold">
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell className="text-muted-foreground">{book.author}</TableCell>
                        <TableCell className="text-muted-foreground">{book.category}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold">{book.checkouts}</span>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fines Report */}
        <TabsContent value="fines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Fines (This Month)</p>
                <p className="text-2xl font-semibold text-foreground">$324.00</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Pending Fines</p>
                <p className="text-2xl font-semibold text-amber-600">$125.00</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Paid Fines</p>
                <p className="text-2xl font-semibold text-emerald-600">$199.00</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Fine Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Member</TableHead>
                      <TableHead className="font-semibold text-foreground">Book</TableHead>
                      <TableHead className="font-semibold text-foreground">Days Overdue</TableHead>
                      <TableHead className="font-semibold text-foreground">Fine Amount</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fineReports.map((fine) => (
                      <TableRow key={fine.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{fine.member}</TableCell>
                        <TableCell className="text-muted-foreground">{fine.book}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {fine.daysOverdue} days
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">{fine.fineAmount}</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            fine.status === "paid" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : fine.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Member Activity Report */}
        <TabsContent value="members" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Top Active Members</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Member</TableHead>
                      <TableHead className="font-semibold text-foreground">Books Read</TableHead>
                      <TableHead className="font-semibold text-foreground">Favorite Genre</TableHead>
                      <TableHead className="font-semibold text-foreground">Last Visit</TableHead>
                      <TableHead className="font-semibold text-foreground">Active Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberActivity.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{member.member}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-semibold">
                            {member.booksRead}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.favoriteGenre}</TableCell>
                        <TableCell className="text-muted-foreground">{member.lastVisit}</TableCell>
                        <TableCell className="text-muted-foreground">{member.activeMonths} months</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Stats */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Checkouts by Category</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{stat.category}</span>
                      <span className="text-sm text-muted-foreground">{stat.checkouts} checkouts ({stat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-accent h-3 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
