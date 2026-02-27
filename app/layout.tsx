import React from 'react';
import './globals.css';

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
