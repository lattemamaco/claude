export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function keyOf(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dow);
  x.setHours(12, 0, 0, 0);
  return x;
}

export function todayKey(): string {
  return keyOf(new Date());
}

export function uid(): string {
  return 'p' + Math.random().toString(36).slice(2, 9);
}

export function isOverdue(date: string | null, status: string): boolean {
  return !!date && date < todayKey() && status !== 'posted';
}
