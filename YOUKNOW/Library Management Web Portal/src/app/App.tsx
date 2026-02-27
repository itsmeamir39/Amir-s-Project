import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { InventoryPage } from "./components/InventoryPage";
import { MembersPage } from "./components/MembersPage";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Render different pages based on active navigation
  const renderPage = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardPage />;
      case "inventory":
        return <InventoryPage />;
      case "members":
        return <MembersPage />;
      case "reports":
        return <ReportsPage />;
      case "acquisitions":
        return (
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Acquisitions</h1>
            <p className="text-muted-foreground">Acquisitions tracking coming soon...</p>
          </div>
        );
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavClick={setActiveNav} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}