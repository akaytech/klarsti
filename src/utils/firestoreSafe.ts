// Firestore, değeri undefined olan alanları reddeder: setDoc daha söz (promise)
// dönmeden senkron olarak hata fırlatır, bu yüzden .catch() ile yakalanamaz.
// Uygulamadaki nesnelerde doğal olarak undefined alanlar oluşabiliyor
// (örn. ajanda kaydında WBS'ten gelmeyen işlerin linkedWbsNodeId'si),
// bu yüzden buluta yazmadan önce her nesne buradan geçirilir.
export function stripUndefined<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(stripUndefined) as unknown as T;
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in value as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const inner = (value as Record<string, unknown>)[key];
        if (inner !== undefined) {
          result[key] = stripUndefined(inner);
        }
      }
    }
    return result as unknown as T;
  }
  return value;
}
