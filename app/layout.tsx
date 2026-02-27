import React from 'react';

export const metadata = {
  title: 'Library Management System',
  description: 'Manage your library books and members',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <a href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-orange-600">BookHub</span>
              </a>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="/dashboard/search" className="hover:text-orange-600">Shop</a>
                <a href="#" className="hover:text-orange-600">Categories</a>
                <a href="#" className="hover:text-orange-600">Offers</a>
              </nav>
              <div className="flex items-center gap-3">
                <a href="/dashboard/search" className="rounded-md bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700">Search Books</a>
                <a href="/admin" className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-200">Admin</a>
                <a href="/librarian/add-book" className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-200">Add Book</a>
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-20 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} BookHub. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
