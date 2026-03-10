Library Management System
Application Flow Diagram
1. High-Level System Flow
This shows the overall user journey through the application.
Copy code

Start
  │
  ▼
Open Web Application
  │
  ▼
Login Page
  │
  ▼
Enter Email + Password
  │
  ▼
Authentication (Supabase)
  │
  ├── Invalid Credentials
  │       │
  │       ▼
  │   Show Error Message
  │       │
  │       └── Retry Login
  │
  └── Valid Credentials
          │
          ▼
     Fetch User Role
          │
          ▼
  Redirect to Dashboard
          │
          ├── Admin Dashboard
          ├── Librarian Dashboard
          └── Patron Dashboard
2. Admin Application Flow
Copy code

Admin Login
     │
     ▼
Admin Dashboard
     │
     ├── User Management
     │       ├── Add User
     │       ├── Edit User
     │       ├── Deactivate User
     │       └── Reset Password
     │
     ├── Book Management
     │       ├── Add Book
     │       ├── Update Book
     │       ├── Delete Book
     │       └── Generate Barcodes
     │
     ├── Issue & Return
     │       ├── Issue Book
     │       └── Record Return
     │
     ├── Reservations
     │       ├── View Reservations
     │       ├── Approve Reservation
     │       └── Cancel Reservation
     │
     ├── Reports & Analytics
     │       ├── Issued Books Report
     │       ├── Overdue Books
     │       ├── Inventory Report
     │       └── Most Borrowed Books
     │
     ├── Notifications
     │       ├── Send Announcement
     │       └── Send Reminders
     │
     ├── System Settings
     │       ├── Loan Duration
     │       ├── Fine Rules
     │       └── Borrow Limits
     │
     └── Audit Logs
             └── View System Activity
3. Librarian Application Flow
Copy code

Librarian Login
       │
       ▼
Librarian Dashboard
       │
       ├── Issue Book
       │       │
       │       ├── Scan Barcode
       │       ├── Identify Book Copy
       │       ├── Select User
       │       ├── Check Borrow Limit
       │       ├── Check Unpaid Fines
       │       └── Issue Book
       │
       ├── Return Book
       │       │
       │       ├── Scan Barcode
       │       ├── Find Transaction
       │       ├── Mark Returned
       │       ├── Check Condition
       │       └── Calculate Fine
       │
       ├── Manage Reservations
       │       ├── View Queue
       │       ├── Approve Reservation
       │       └── Cancel Reservation
       │
       ├── Book Catalog
       │       ├── Update Book Info
       │       ├── Update Shelf Location
       │       └── Mark Damaged/Lost
       │
       ├── Inventory
       │       ├── Check Missing Books
       │       └── Verify Shelf Inventory
       │
       └── Reports
               ├── Daily Transactions
               ├── Overdue Books
               └── Fine Collection
4. Patron Application Flow
Copy code

Patron Login
      │
      ▼
Patron Dashboard
      │
      ├── Search Books
      │       ├── Search by Title
      │       ├── Search by Author
      │       ├── Search by ISBN
      │       └── Search by Category
      │
      ├── View Book Details
      │       ├── Availability
      │       ├── Copies
      │       └── Shelf Location
      │
      ├── Reserve Book
      │       ├── Place Reservation
      │       └── Cancel Reservation
      │
      ├── My Borrowed Books
      │       ├── View Issue Date
      │       ├── View Due Date
      │       └── Request Renewal
      │
      ├── Return Requests
      │       └── Confirm Return
      │
      ├── Borrowing History
      │       ├── Previous Books
      │       └── Reservation History
      │
      ├── Fines
      │       ├── View Fine
      │       └── Pay Fine (Stripe)
      │
      └── Profile
              ├── Update Profile
              └── Change Password
5. Book Issue Workflow (Detailed)
Copy code

Librarian Opens Issue Page
        │
        ▼
Scan Book Barcode
        │
        ▼
Identify Book Copy
        │
        ├── Book Not Found
        │       └── Show Error
        │
        ├── Book Damaged
        │       └── Cannot Issue
        │
        └── Book Available
                │
                ▼
        Select Patron
                │
                ▼
        Check Borrow Limit
                │
                ├── Limit Exceeded
                │       └── Reject Issue
                │
                └── Allowed
                        │
                        ▼
                Create Transaction
                        │
                        ▼
                Set Due Date
                        │
                        ▼
                Book Issued
6. Book Return Workflow
Copy code

Librarian Scans Barcode
        │
        ▼
Find Transaction
        │
        ▼
Mark Book Returned
        │
        ▼
Update Book Status
        │
        ▼
Check Overdue
        │
        ├── No Overdue
        │       └── Complete
        │
        └── Overdue
                │
                ▼
        Calculate Fine
                │
                ▼
        Record Fine
7. Reservation Queue Flow
Copy code

User Searches Book
        │
        ▼
Book Not Available
        │
        ▼
User Places Reservation
        │
        ▼
Add User to Reservation Queue
        │
        ▼
Book Returned
        │
        ▼
Notify First User in Queue
        │
        ▼
Hold Book (48 Hours)
        │
        ├── User Collects Book
        │       └── Reservation Completed
        │
        └── User Does Not Collect
                │
                ▼
        Notify Next User
8. Fine Payment Flow
Copy code

Fine Generated
      │
      ▼
User Views Fine
      │
      ▼
Select Payment Option
      │
      ├── Online Payment
      │       │
      │       ▼
      │   Stripe Payment Gateway
      │       │
      │       ▼
      │   Payment Successful
      │       │
      │       ▼
      │   Fine Marked Paid
      │
      └── Pay Librarian
              │
              ▼
        Librarian Marks Paid
9. Notification System Flow
Copy code

System Event Occurs
       │
       ├── Due Date Approaching
       ├── Overdue Book
       ├── Reservation Available
       └── Library Announcement
       │
       ▼
Create Notification
       │
       ▼
Send Alert
       │
       ├── In-App Notification
       └── Email Notification
10. Logout Flow
Copy code

User Clicks Logout
       │
       ▼
Invalidate Session
       │
       ▼
Redirect to Login Page
