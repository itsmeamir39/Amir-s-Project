/**
 * Calculate the overdue fine for a loan.
 *
 * - If today is on/before the due date, returns 0.
 * - If late, multiplies full days late by `finePerDay`.
 * - Caps the result at `maxFineAmount` if provided.
 *
 * The caller is expected to pass the `finePerDay` and `maxFineAmount`
 * values looked up from the `circulation_rules` table for the patron's role.
 */
export function calculateFine(
  dueDate: Date,
  finePerDay: number,
  maxFineAmount?: number
): number {
  const today = new Date();

  // Strip the time part so we compare by calendar day.
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const msInDay = 1000 * 60 * 60 * 24;
  const diffMs = current.getTime() - due.getTime();
  const daysLate = Math.floor(diffMs / msInDay);

  if (daysLate <= 0 || finePerDay <= 0) {
    return 0;
  }

  const rawFine = daysLate * finePerDay;

  if (typeof maxFineAmount === 'number' && maxFineAmount >= 0) {
    return Math.min(rawFine, maxFineAmount);
  }

  return rawFine;
}

