import { BookOpen, LayoutDashboard, Users, Settings, BarChart3, BookmarkPlus } from "lucide-react";

interface SidebarProps {
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export function Sidebar({ activeNav = "dashboard", onNavClick }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: BookOpen },
    { id: "members", label: "Members", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "acquisitions", label: "Acquisitions", icon: BookmarkPlus },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1a2f4a] min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-[#2d4a6a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#14b8a6] rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">LibraryHub</h1>
            <p className="text-[#94a3b8] text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavClick?.(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#14b8a6] text-white"
                      : "text-[#e2e8f0] hover:bg-[#2d4a6a]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2d4a6a]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-[#64748b] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-[#94a3b8] text-xs">admin@library.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
