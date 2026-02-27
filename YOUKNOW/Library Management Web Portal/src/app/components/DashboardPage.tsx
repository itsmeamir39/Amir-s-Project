import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Users, TrendingUp, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

export function DashboardPage() {
  const recentActivities = [
    { id: 1, action: "New book added", book: "The Midnight Library", time: "2 hours ago" },
    { id: 2, action: "Book checked out", book: "Atomic Habits", time: "3 hours ago" },
    { id: 3, action: "Book returned", book: "The Great Gatsby", time: "5 hours ago" },
    { id: 4, action: "New member registered", book: "John Smith", time: "1 day ago" },
    { id: 5, action: "Book reserved", book: "1984", time: "1 day ago" },
  ];

  const upcomingReturns = [
    { id: 1, book: "To Kill a Mockingbird", member: "Alice Johnson", dueDate: "Feb 28, 2026" },
    { id: 2, book: "Pride and Prejudice", member: "Bob Wilson", dueDate: "Mar 1, 2026" },
    { id: 3, book: "The Hobbit", member: "Carol Davis", dueDate: "Mar 2, 2026" },
    { id: 4, book: "Brave New World", member: "David Brown", dueDate: "Mar 3, 2026" },
  ];

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
}
