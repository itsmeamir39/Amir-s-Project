import {
  LayoutDashboard,
  Users,
  BookOpen,
  ArrowLeftRight,
  CalendarCheck,
  BarChart3,
  Bell,
  Settings,
  ClipboardList,
  CheckCircle,
  DollarSign,
  Search,
  BookCopy,
  History,
  User,
  MessageSquare,
} from "lucide-react";

export const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Book Management", url: "/admin/books", icon: BookOpen },
  { title: "Issue & Return", url: "/admin/transactions", icon: ArrowLeftRight },
  { title: "Reservations", url: "/admin/reservations", icon: CalendarCheck },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Suggestions", url: "/admin/suggestions", icon: MessageSquare },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Audit Logs", url: "/admin/audit", icon: ClipboardList },
];

export const librarianNav = [
  { title: "Dashboard", url: "/librarian", icon: LayoutDashboard },
  { title: "Add Book", url: "/librarian/add-book", icon: BookOpen },
  { title: "Issue Book", url: "/librarian/issue", icon: ArrowLeftRight },
  { title: "Return Book", url: "/librarian/return", icon: CheckCircle },
  { title: "Reservations", url: "/librarian/reservations", icon: CalendarCheck },
  { title: "Book Catalog", url: "/librarian/catalog", icon: BookOpen },
  { title: "Suggestions", url: "/librarian/suggestions", icon: MessageSquare },
  { title: "Reports", url: "/librarian/reports", icon: BarChart3 },
];

export const patronNav = [
  { title: "Dashboard", url: "/patron", icon: LayoutDashboard },
  { title: "Search Books", url: "/patron/search", icon: Search },
  { title: "My Books", url: "/patron/books", icon: BookCopy },
  { title: "Reservations", url: "/patron/reservations", icon: CalendarCheck },
  { title: "History", url: "/patron/history", icon: History },
  { title: "Fines", url: "/patron/fines", icon: DollarSign },
  { title: "Payment History", url: "/patron/payments", icon: History },
  { title: "Suggestions", url: "/patron/suggestions", icon: MessageSquare },
  { title: "Profile", url: "/patron/profile", icon: User },
];

