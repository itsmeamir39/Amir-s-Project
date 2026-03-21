"use client";

import { ReactNode, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, type SidebarNavItem } from "@/components/AppSidebar";
import { Bell, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface DashboardLayoutProps {
  children: ReactNode;
  items: SidebarNavItem[];
  title: string;
  roleLabel: string;
}

const DashboardLayout = ({ children, items, title, roleLabel }: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const getProfilePath = () => {
    if (pathname.startsWith("/admin")) return "/admin/profile";
    if (pathname.startsWith("/librarian")) return "/librarian/profile";
    return "/patron/profile";
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/login");
      router.refresh();
      setLoggingOut(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar items={items} title={title} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent capitalize">
                {roleLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => router.push(getProfilePath())}>
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
