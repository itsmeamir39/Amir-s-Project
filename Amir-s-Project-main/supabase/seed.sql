-- SQL Seed File - Initial Data Population
-- This seed file populates the library management system with valid test data

-- Users (base requirement for all foreign keys)
INSERT INTO public.users (id, full_name, role, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin User', 'Admin', 'admin@library.com', '$2b$10$hashedpassword1'),
('550e8400-e29b-41d4-a716-446655440002', 'Librarian Jane', 'Librarian', 'librarian@library.com', '$2b$10$hashedpassword2'),
('550e8400-e29b-41d4-a716-446655440003', 'John Patron', 'Patron', 'john@patron.com', '$2b$10$hashedpassword3'),
('550e8400-e29b-41d4-a716-446655440004', 'Sarah Patron', 'Patron', 'sarah@patron.com', '$2b$10$hashedpassword4'),
('550e8400-e29b-41d4-a716-446655440005', 'Mike Patron', 'Patron', 'mike@patron.com', '$2b$10$hashedpassword5');

-- Biblios (books)
INSERT INTO public.biblios (id, isbn, title, author, publisher, cover_url, description) VALUES
(1, '9781234567890', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 'https://example.com/gatsby.jpg', 'A classic American novel set in the Jazz Age'),
(2, '9780451524935', 'To Kill a Mockingbird', 'Harper Lee', 'Lippincott', 'https://example.com/mockingbird.jpg', 'An American classic about racial injustice'),
(3, '9780451526342', '1984', 'George Orwell', 'Secker & Warburg', 'https://example.com/1984.jpg', 'Dystopian novel about totalitarianism'),
(4, '9780743273565', 'The Catcher in the Rye', 'J.D. Salinger', 'Little, Brown', 'https://example.com/catcher.jpg', 'Coming-of-age story set in 1950s New York'),
(5, '9780062073556', 'The Handmaid''s Tale', 'Margaret Atwood', 'Houghton Mifflin', 'https://example.com/handmaid.jpg', 'Dystopian novel about patriarchal society');

-- Items (physical book copies)
INSERT INTO public.items (id, biblio_id, barcode, status) VALUES
(1, 1, 'BOOK-001-001', 'Available'),
(2, 1, 'BOOK-001-002', 'Available'),
(3, 2, 'BOOK-002-001', 'Checked Out'),
(4, 2, 'BOOK-002-002', 'Available'),
(5, 3, 'BOOK-003-001', 'Available'),
(6, 3, 'BOOK-003-002', 'Damaged'),
(7, 4, 'BOOK-004-001', 'Available'),
(8, 5, 'BOOK-005-001', 'Checked Out'),
(9, 5, 'BOOK-005-002', 'Lost');

-- Circulation Rules
INSERT INTO public.circulation_rules (id, patron_role, max_borrow_limit, loan_period_days, renewal_limit, fine_per_day, max_fine_amount, grace_period_days) VALUES
(1, 'Patron', 5, 14, 2, 0.50, 20.00, 3),
(2, 'Librarian', 10, 21, 3, 0.25, 10.00, 5),
(3, 'Admin', 15, 30, 5, 0.00, 0.00, 7);

-- Loans
INSERT INTO public.loans (id, user_id, biblio_id, borrowed_at, due_date, renewals_used, status) VALUES
(1, '550e8400-e29b-41d4-a716-446655440003', 2, now() - interval '5 days', now() + interval '9 days', 0, 'CheckedOut'),
(2, '550e8400-e29b-41d4-a716-446655440004', 5, now() - interval '10 days', now() + interval '4 days', 1, 'CheckedOut'),
(3, '550e8400-e29b-41d4-a716-446655440003', 1, now() - interval '20 days', now() - interval '6 days', 0, 'Returned');

-- Fines
INSERT INTO public.fines (id, user_id, amount, status, created_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440004', 3.00, 'Unpaid', now() - interval '3 days'),
(2, '550e8400-e29b-41d4-a716-446655440003', 5.50, 'Paid', now() - interval '7 days'),
(3, '550e8400-e29b-41d4-a716-446655440005', 2.00, 'Waived', now() - interval '2 days');

-- Holds
INSERT INTO public.holds (id, user_id, biblio_id, status, created_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440005', 1, 'pending', now() - interval '2 days'),
(2, '550e8400-e29b-41d4-a716-446655440004', 3, 'ready', now() - interval '1 day'),
(3, '550e8400-e29b-41d4-a716-446655440003', 5, 'collected', now() - interval '5 days');

-- Reading History
INSERT INTO public.reading_history (id, user_id, biblio_id, borrowed_at, returned_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440003', 1, now() - interval '30 days', now() - interval '20 days'),
(2, '550e8400-e29b-41d4-a716-446655440004', 2, now() - interval '45 days', now() - interval '31 days'),
(3, '550e8400-e29b-41d4-a716-446655440005', 3, now() - interval '60 days', now() - interval '46 days');

-- Suggestions
INSERT INTO public.suggestions (id, user_id, title, author, reason, status, created_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440003', 'Atomic Habits', 'James Clear', 'Great for personal development', 'pending', now() - interval '5 days'),
(2, '550e8400-e29b-41d4-a716-446655440004', 'Dune', 'Frank Herbert', 'Classic sci-fi novel', 'reviewed', now() - interval '10 days'),
(3, '550e8400-e29b-41d4-a716-446655440005', 'Project Hail Mary', 'Andy Weir', 'Modern space adventure', 'accepted', now() - interval '15 days'),
(4, '550e8400-e29b-41d4-a716-446655440003', 'Some Obscure Book', 'Unknown Author', 'Out of scope', 'rejected', now() - interval '20 days');

-- Engagement (Reservations)
INSERT INTO public.engagement (id, user_id, biblio_id, type, created_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440003', 1, 'Reservation', now() - interval '3 days'),
(2, '550e8400-e29b-41d4-a716-446655440004', 2, 'Reservation', now() - interval '1 day'),
(3, '550e8400-e29b-41d4-a716-446655440005', 4, 'Reservation', now() - interval '7 days');

-- Audit Logs
INSERT INTO public.audit_logs (id, admin_id, action_type, details, created_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', 'USER_CREATED', 'Patron account created for john@patron.com', now() - interval '30 days'),
(2, '550e8400-e29b-41d4-a716-446655440001', 'FINE_WAIVED', 'Fine waived for user 550e8400-e29b-41d4-a716-446655440005', now() - interval '2 days'),
(3, '550e8400-e29b-41d4-a716-446655440002', 'LOAN_CREATED', 'Loan created for biblio_id 2', now() - interval '5 days');

-- Transactions
INSERT INTO public.transactions (id, item_id, patron_id, issue_date, due_date, return_date, fine_paid) VALUES
(1, 3, '550e8400-e29b-41d4-a716-446655440003', now() - interval '15 days', now() - interval '1 day', now(), 0.00),
(2, 8, '550e8400-e29b-41d4-a716-446655440004', now() - interval '8 days', now() + interval '6 days', NULL, 0.00),
(3, 7, '550e8400-e29b-41d4-a716-446655440005', now() - interval '3 days', now() + interval '11 days', NULL, 0.00);

-- Global Settings
INSERT INTO public.global_settings (id, maintenance_mode, allow_self_registration) VALUES
(1, FALSE, TRUE);

-- Reset sequences to appropriate values
SELECT setval('public.audit_logs_id_seq', (SELECT MAX(id) FROM public.audit_logs) + 1);
SELECT setval('public.biblios_id_seq', (SELECT MAX(id) FROM public.biblios) + 1);
SELECT setval('public.circulation_rules_id_seq', (SELECT MAX(id) FROM public.circulation_rules) + 1);
SELECT setval('public.engagement_id_seq', (SELECT MAX(id) FROM public.engagement) + 1);
SELECT setval('public.fines_id_seq', (SELECT MAX(id) FROM public.fines) + 1);
SELECT setval('public.holds_id_seq', (SELECT MAX(id) FROM public.holds) + 1);
SELECT setval('public.items_id_seq', (SELECT MAX(id) FROM public.items) + 1);
SELECT setval('public.loans_id_seq', (SELECT MAX(id) FROM public.loans) + 1);
SELECT setval('public.reading_history_id_seq', (SELECT MAX(id) FROM public.reading_history) + 1);
SELECT setval('public.suggestions_id_seq', (SELECT MAX(id) FROM public.suggestions) + 1);
SELECT setval('public.transactions_id_seq', (SELECT MAX(id) FROM public.transactions) + 1);
