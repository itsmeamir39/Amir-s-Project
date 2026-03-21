"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps {
  to: string;
  end?: boolean;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, end, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(className, isActive && activeClassName, pendingClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
