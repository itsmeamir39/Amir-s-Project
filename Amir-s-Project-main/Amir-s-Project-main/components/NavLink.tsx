"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

type NavLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Omit<LinkProps, "href"> & {
    to: string;
    end?: boolean;
    className?: string;
    activeClassName?: string;
    pendingClassName?: string;
  };

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function NavLink({
  to,
  end = false,
  className,
  activeClassName,
  pendingClassName: _pendingClassName,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const current = normalizePath(pathname ?? "/");
  const target = normalizePath(to);

  const isActive = end ? current === target : current === target || current.startsWith(`${target}/`);

  return (
    <Link
      href={to}
      className={cn(className, isActive && activeClassName)}
      {...props}
    />
  );
}

