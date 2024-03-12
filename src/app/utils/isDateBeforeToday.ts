export function isDateBeforeToday(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
}
