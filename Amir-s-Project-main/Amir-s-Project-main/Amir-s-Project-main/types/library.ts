export type UserRole = 'Admin' | 'Librarian' | 'Patron';

export type Biblio = {
  id: number;
  title: string;
  author: string | null;
  isbn: string | null;
  description: string | null;
  cover_url: string | null;
};

export type Item = {
  id: number;
  biblio_id: number;
  barcode: string | null;
  status: string | null;
};

export type Loan = {
  id: number;
  user_id: string;
  biblio_id: number;
  borrowed_at: string;
  due_date: string;
  renewals_used: number;
  status: string;
};

export type Fine = {
  id: number;
  amount: number;
  status: string;
  created_at: string;
};

export type ReadingHistory = {
  id: number;
  user_id: string;
  biblio_id: number;
  borrowed_at: string;
  returned_at: string | null;
};

