export function addOneHour(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const newH = Math.min(h + 1, 23);
  return `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// İki ['HH:mm', 'HH:mm'] aralığının kesişip kesişmediğini kontrol eder.
export function timeRangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}
