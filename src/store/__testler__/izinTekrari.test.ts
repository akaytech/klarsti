import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { izinTekrariPlanla, izinTekrariSifirla, BEKLEMELER } from '../izinTekrari';

// Sert yenilemede Firestore'un kimlik jetonu geç bağlanıyor ve dinleyici
// "yetkin yok" alıyor. Buradaki kural: geçici olabilecek bu hatayı birkaç kez
// tekrar dene, tutmazsa gerçek kabul et.
//
// Zamanlama sahte saatle sınanıyor; gerçek beklemek testi 4,6 saniye uzatırdı.

beforeEach(() => {
  vi.useFakeTimers();
  for (const a of ['projeler', 'calismalar', 'kisisel', 'x']) izinTekrariSifirla(a);
});
afterEach(() => vi.useRealTimers());

describe('ne zaman tekrar denenir', () => {
  it('yetki hatasinda denenir', () => {
    expect(izinTekrariPlanla('permission-denied', true, 'x', () => {})).toBe(true);
  });

  it('baska bir hatada denenmez', () => {
    expect(izinTekrariPlanla('unavailable', true, 'x', () => {})).toBe(false);
  });

  it('kod hic yoksa denenmez', () => {
    expect(izinTekrariPlanla(undefined, true, 'x', () => {})).toBe(false);
  });

  it('kullanici degistiyse denenmez: yanlis hesabin verisi cekilirdi', () => {
    expect(izinTekrariPlanla('permission-denied', false, 'x', () => {})).toBe(false);
  });
});

describe('deneme haklari', () => {
  it('hak sayisi bekleme listesi kadar, sonrasi gercek hata sayilir', () => {
    for (let i = 0; i < BEKLEMELER.length; i++) {
      expect(izinTekrariPlanla('permission-denied', true, 'x', () => {}), `${i}. deneme`).toBe(true);
    }
    expect(izinTekrariPlanla('permission-denied', true, 'x', () => {})).toBe(false);
  });

  it('bekleme suresi her denemede uzuyor', () => {
    const gecikmeler: number[] = [];
    const zamanlayici = vi.spyOn(globalThis, 'setTimeout');
    for (let i = 0; i < BEKLEMELER.length; i++) {
      izinTekrariPlanla('permission-denied', true, 'x', () => {});
      gecikmeler.push(zamanlayici.mock.calls[i][1] as number);
    }
    expect(gecikmeler).toEqual(BEKLEMELER);
    expect([...gecikmeler].sort((a, b) => a - b)).toEqual(gecikmeler);
    zamanlayici.mockRestore();
  });

  it('tekrar kurma cagrisi ancak bekleme dolunca calisir', () => {
    const kur = vi.fn();
    izinTekrariPlanla('permission-denied', true, 'x', kur);
    vi.advanceTimersByTime(BEKLEMELER[0] - 1);
    expect(kur).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(kur).toHaveBeenCalledTimes(1);
  });

  it('her dinleyicinin hakki ayri', () => {
    for (let i = 0; i < BEKLEMELER.length; i++) izinTekrariPlanla('permission-denied', true, 'projeler', () => {});
    expect(izinTekrariPlanla('permission-denied', true, 'projeler', () => {})).toBe(false);
    expect(izinTekrariPlanla('permission-denied', true, 'calismalar', () => {})).toBe(true);
  });

  it('dinleyici acilinca haklar yenilenir', () => {
    for (let i = 0; i < BEKLEMELER.length; i++) izinTekrariPlanla('permission-denied', true, 'x', () => {});
    expect(izinTekrariPlanla('permission-denied', true, 'x', () => {})).toBe(false);
    izinTekrariSifirla('x');
    expect(izinTekrariPlanla('permission-denied', true, 'x', () => {})).toBe(true);
  });
});
