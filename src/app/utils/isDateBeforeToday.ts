export function isDateBeforeToday(date: string): boolean {
  const today = new Date();
  // ignorer la partie temps et de se concentrer uniquement sur la comparaison des dates
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
}
