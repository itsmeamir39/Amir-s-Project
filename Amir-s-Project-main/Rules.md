Architectural Constraints (The "No-Bloat" Rules)
Minimalist Dependency Rule: "Do not add any third-party libraries unless explicitly requested. Use native Web APIs or existing project dependencies (Radix UI/Tailwind) first."
DRY but not Over-Abstracted: "Prioritize readable code over complex abstractions. Do not create a 'Generic Component Factory' if a simple functional component will suffice."
Server-First Logic: "Since we are using Next.js 14+, always default to Server Components and Server Actions. Only use 'use client' when interactivity (hooks, event listeners) is strictly required."
2. Logic & Bug Prevention
Zod-Strict Validation: "Every API route and Server Action must have a Zod schema validation for input. Never trust client-side data."
Type-Safety First: "No any types. Every function must have defined return types. If a type is used in more than two files, move it to a global types/ directory."
Error Handling Template: "Do not use empty catch blocks. All errors must be handled with a specific error code (from the PRD's error list) and returned to the UI via a 'toast' notification or error state."
3. UI/UX "Guardrails"
Atomic Design: "Follow an Atomic Design pattern. Create small, reusable components (Button, Input, Badge) before building large features. Do not hardcode styles inside large pages."
Tailwind Consistency: "Do not use arbitrary values in Tailwind (e.g., h-[432px]). Only use the standard tailwind spacing scale to maintain the Apple-style clean layout."
State Management: "Use URL state (Search Params) for filtering and searching books instead of useState. This ensures the 'Back' button works as expected."
4. Specific "Invisible" Rules for your LMS
Since your project has specific hardware and payment needs, add these:
Hardware Fallbacks: "When writing barcode scanning logic, always provide a manual 'Input ISBN' fallback in case the camera fails or permission is denied."
Idempotency: "For Stripe payments and Book Issuing, ensure the logic is idempotent. Checking if a fine is already 'Paid' must happen before initiating a new transaction."
5. Sample "Rule Prompt" to give the AI
You can copy and paste this directly before starting a coding session:
"We are building a Library Management System. Follow these strict rules:
Tech Stack: Next.js 14 (App Router), Supabase, Tailwind, Radix UI.
Coding Style: No 'try/catch' bloat in Server Actions; use a centralized error handler.
UI Style: Apple-inspired. Use generous white space, Inter font, and subtle borders (#DBDBDB).
Constraint: Do not add 'features' not in the PRD (e.g., do not add a 'Chat with Librarian' feature unless I ask).
Verification: Before providing code, double-check that it aligns with the Supabase Row Level Security (RLS) policies."
