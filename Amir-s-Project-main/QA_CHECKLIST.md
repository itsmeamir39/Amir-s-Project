# Integration Checklist

Run this checklist before release:

1. Authentication and roles
   - Sign in as `Admin`, `Librarian`, and `Patron`.
   - Confirm each role lands on the correct dashboard.
   - Confirm protected routes redirect to `/login` when signed out.

2. Admin workflows
   - Open `/admin/users`, create a user-role record, then edit role.
   - Open `/admin/settings`, update rules and global settings, then refresh and confirm persistence.

3. Librarian workflows
   - Open `/librarian/add-book`, submit a book, and verify `biblios` + `items` records.
   - Print barcode label from success dialog.

4. Patron workflows
   - Search books and reserve unavailable titles.
   - Open `/patron/reservations` and cancel a hold.
   - Open `/patron/fines` and complete payment action.
   - Open `/patron/payments` and verify payment event visibility.
   - Submit a suggestion from `/patron/suggestions`.

5. Regression checks
   - Run `npm run build`.
   - Run `npm run lint`.
