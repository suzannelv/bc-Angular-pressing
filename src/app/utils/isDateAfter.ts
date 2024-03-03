export function isDateAfter(startDate: string, endDate: string): boolean {
  return new Date(endDate) >= new Date(startDate);
}
