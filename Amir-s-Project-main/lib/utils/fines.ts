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
  maxFineAmount?: number,
  gracePeriodDays?: number,
  bookPriceCap?: number
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

  const grace = typeof gracePeriodDays === 'number' && gracePeriodDays > 0 ? gracePeriodDays : 0;
  const effectiveDaysLate = Math.max(0, daysLate - grace);
  const rawFine = effectiveDaysLate * finePerDay;

  const caps: number[] = [];
  if (typeof maxFineAmount === 'number' && maxFineAmount >= 0) caps.push(maxFineAmount);
  if (typeof bookPriceCap === 'number' && bookPriceCap >= 0) caps.push(bookPriceCap);
  if (caps.length > 0) return Math.min(rawFine, Math.min(...caps));

  return rawFine;
}
