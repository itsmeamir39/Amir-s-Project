import React from 'react';

export const metadata = {
  title: 'Library Management System',
  description: 'Manage your library books and members',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}