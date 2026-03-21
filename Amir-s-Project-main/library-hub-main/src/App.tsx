import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import BookManagement from "./pages/admin/BookManagement";
import Transactions from "./pages/admin/Transactions";
import Reservations from "./pages/admin/Reservations";
import Reports from "./pages/admin/Reports";
import Notifications from "./pages/admin/Notifications";
import AdminSuggestionsPage from "./pages/admin/AdminSuggestionsPage";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";
// Librarian
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard";
import IssueBook from "./pages/librarian/IssueBook";
import ReturnBook from "./pages/librarian/ReturnBook";
import LibrarianReservations from "./pages/librarian/LibrarianReservations";
import BookCatalog from "./pages/librarian/BookCatalog";
import LibrarianReports from "./pages/librarian/LibrarianReports";
import LibrarianSuggestions from "./pages/librarian/LibrarianSuggestions";
// Patron
import PatronDashboard from "./pages/patron/PatronDashboard";
import SearchBooks from "./pages/patron/SearchBooks";
import MyBooks from "./pages/patron/MyBooks";
import PatronReservations from "./pages/patron/PatronReservations";
import BorrowingHistory from "./pages/patron/BorrowingHistory";
import Fines from "./pages/patron/Fines";
import PaymentHistory from "./pages/patron/PaymentHistory";
import Profile from "./pages/patron/Profile";
import PatronSuggestions from "./pages/patron/Suggestions";
import ProfilePage from "./pages/ProfilePage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/books" element={<BookManagement />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/reservations" element={<Reservations />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/suggestions" element={<AdminSuggestionsPage />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          <Route path="/admin/audit" element={<AuditLogs />} />
          <Route path="/admin/profile" element={<ProfilePage role="Admin" />} />

          {/* Librarian */}
          <Route path="/librarian" element={<LibrarianDashboard />} />
          <Route path="/librarian/issue" element={<IssueBook />} />
          <Route path="/librarian/return" element={<ReturnBook />} />
          <Route path="/librarian/reservations" element={<LibrarianReservations />} />
          <Route path="/librarian/catalog" element={<BookCatalog />} />
          <Route path="/librarian/suggestions" element={<LibrarianSuggestions />} />
          <Route path="/librarian/reports" element={<LibrarianReports />} />
          <Route path="/librarian/profile" element={<ProfilePage role="Librarian" />} />

          {/* Patron */}
          <Route path="/patron" element={<PatronDashboard />} />
          <Route path="/patron/search" element={<SearchBooks />} />
          <Route path="/patron/books" element={<MyBooks />} />
          <Route path="/patron/reservations" element={<PatronReservations />} />
          <Route path="/patron/history" element={<BorrowingHistory />} />
          <Route path="/patron/fines" element={<Fines />} />
          <Route path="/patron/payments" element={<PaymentHistory />} />
          <Route path="/patron/suggestions" element={<PatronSuggestions />} />
          <Route path="/patron/profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
