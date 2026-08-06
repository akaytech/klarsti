// Ajanda düğmesi ana menüde ve ajandanın kendisinde görünür, başka bir araç
// açıkken görünmez. Sağ üstteki düğme sırası buna göre kaydığı için kural
// birden fazla bileşen tarafından okunuyor.
export function ajandaDugmesiGorunurMu(activeTool: string | null) {
  return !activeTool || activeTool === 'notepad';
}
