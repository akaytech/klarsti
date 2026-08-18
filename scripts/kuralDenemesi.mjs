// Firestore kurallarinin yerel emulator uzerinde dogrulanmasi.
//
//   npm run test:kurallar
//
// Java ve firebase CLI gerekiyor (ikisi de yerelde kurulu). Bu yuzden normal
// `npm test` icinde DEGIL: her derlemede emulator baslatmak pahali. Kurallar
// da nadiren degisiyor. CI'da yalnizca firestore.rules degistiginde kosuyor
// (bkz. .github/workflows/kurallar.yml).
//
// Buradaki her satir gercek bir kapiyi sinar: baskasinin adina proje acmak,
// kurbani zorla paylasim listesine sokmak, ortak calisanin sahipligi
// devralmasi, baskasinin ajandasini okumak. Kurala dokunmadan once bunu
// calistir; gectikten sonra tekrar calistir.
import fs from 'node:fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  arrayUnion, arrayRemove, deleteField
} from 'firebase/firestore';

const SAHIP = 'sahip-uid';
const ORTAK = 'ortak-uid';
const YABANCI = 'yabanci-uid';
const KURBAN = 'kurban-uid';

const env = await initializeTestEnvironment({
  projectId: 'klarsti-rules-test',
  firestore: { host: '127.0.0.1', port: 8080, rules: fs.readFileSync('firestore.rules', 'utf8') }
});

const sahip = env.authenticatedContext(SAHIP).firestore();
const ortak = env.authenticatedContext(ORTAK).firestore();
const yabanci = env.authenticatedContext(YABANCI).firestore();
const anonim = env.unauthenticatedContext().firestore();

let gecti = 0;
let kaldi = 0;

async function bekle(ad, beklenen, islem) {
  try {
    await (beklenen === 'izin' ? assertSucceeds(islem()) : assertFails(islem()));
    console.log(`  OK   ${ad}`);
    gecti++;
  } catch (e) {
    console.log(`  HATA ${ad}  -> ${e.message?.split('\n')[0]}`);
    kaldi++;
  }
}

async function kur(yol, veri) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), ...yol), veri);
  });
}

const temelProje = (ekstra = {}) => ({
  id: 'p', name: 'Test', toolData: {}, updatedAt: 1, userId: SAHIP, ...ekstra
});

const temelCalisma = (ekstra = {}) => ({
  ownerId: SAHIP, projectId: 'klasor', projectName: 'Abdullah',
  tool: 'mindmap', name: 'Klarsti', data: {}, updatedAt: 1, ...ekstra
});

console.log('\n--- PROJE: OLUSTURMA ---');
await bekle('sahibi normal proje olusturabilir', 'izin', () =>
  setDoc(doc(sahip, 'projects', 'yeni-1'), temelProje({ id: 'yeni-1' })));
await bekle('baskasinin adina proje olusturulamaz', 'ret', () =>
  setDoc(doc(sahip, 'projects', 'yeni-2'), temelProje({ id: 'yeni-2', userId: KURBAN })));
await bekle('kurbanin UID si sharedWith e sokulamaz', 'ret', () =>
  setDoc(doc(yabanci, 'projects', 'yeni-3'), { id: 'yeni-3', name: 'Reklam', toolData: {}, updatedAt: 1, userId: YABANCI, sharedWith: [KURBAN] }));
await bekle('katilanlar listesi dolu dogamaz', 'ret', () =>
  setDoc(doc(yabanci, 'projects', 'yeni-4'), { id: 'yeni-4', name: 'Reklam', toolData: {}, updatedAt: 1, userId: YABANCI, members: { [KURBAN]: { name: 'x', email: 'x', joinedAt: 1 } } }));

console.log('\n--- PROJE: OKUMA / PAYLASIM ---');
await kur(['projects', 'ozel'], temelProje({ id: 'ozel' }));
await kur(['projects', 'acik'], temelProje({ id: 'acik', isPublic: true }));
await kur(['projects', 'paylasik'], temelProje({ id: 'paylasik', isPublic: true, sharedWith: [ORTAK], members: { [ORTAK]: { name: 'Ortak', email: 'o@x.com', joinedAt: 1 } } }));

await bekle('sahibi kendi projesini okur', 'izin', () => getDoc(doc(sahip, 'projects', 'ozel')));
await bekle('yabanci ozel projeyi okuyamaz', 'ret', () => getDoc(doc(yabanci, 'projects', 'ozel')));
await bekle('giris yapmamis okuyamaz', 'ret', () => getDoc(doc(anonim, 'projects', 'acik')));
await bekle('acik projeye katilma', 'izin', () =>
  updateDoc(doc(yabanci, 'projects', 'acik'), { sharedWith: arrayUnion(YABANCI), [`members.${YABANCI}`]: { name: 'Y', email: 'y@x.com', joinedAt: 2 } }));
await bekle('ortak paylasimi kapatamaz', 'ret', () =>
  setDoc(doc(ortak, 'projects', 'paylasik'), { isPublic: false }, { merge: true }));
await bekle('sahip paylasimi durdurur', 'izin', () =>
  setDoc(doc(sahip, 'projects', 'paylasik'), { isPublic: false }, { merge: true }));
await bekle('sahip katilani cikarir', 'izin', () =>
  updateDoc(doc(sahip, 'projects', 'paylasik'), { sharedWith: arrayRemove(ORTAK), [`members.${ORTAK}`]: deleteField() }));

console.log('\n--- CALISMA: OLUSTURMA ---');
await kur(['projects', 'klasor'], temelProje({ id: 'klasor', name: 'Abdullah' }));
await kur(['projects', 'klasor-paylasik'], temelProje({ id: 'klasor-paylasik', name: 'Ekip', sharedWith: [ORTAK] }));

await bekle('sahip kendi klasorunde calisma acar', 'izin', () =>
  setDoc(doc(sahip, 'works', 'c1'), temelCalisma()));
await bekle('yabanci baskasinin klasorunde calisma acamaz', 'ret', () =>
  setDoc(doc(yabanci, 'works', 'c2'), temelCalisma({ ownerId: YABANCI })));
await bekle('calisma klasorun sahibine yazilir', 'ret', () =>
  setDoc(doc(sahip, 'works', 'c3'), temelCalisma({ ownerId: ORTAK })));
await bekle('kurban zorla okuyucu yapilamaz', 'ret', () =>
  setDoc(doc(sahip, 'works', 'c4'), temelCalisma({ readers: [KURBAN] })));
await bekle('klasore davetli de calisma acabilir', 'izin', () =>
  setDoc(doc(ortak, 'works', 'c5'), temelCalisma({ projectId: 'klasor-paylasik', projectName: 'Ekip', readers: [ORTAK] })));
await bekle('paylasik klasorde readers klasorden gelmeli', 'ret', () =>
  setDoc(doc(sahip, 'works', 'c6'), temelCalisma({ projectId: 'klasor-paylasik', projectName: 'Ekip', readers: [] })));

console.log('\n--- CALISMA: UYGULAMANIN GERCEK YAZMALARI ---');
// calismaYazma.ts'in urettigi govdenin birebir aynisi.
const kurulusGovdesi = (projectId, workId, readers) => ({
  ownerId: SAHIP, projectId, workId, readers, sharedWith: [], members: {},
  projectName: 'Abdullah', tool: 'mindmap', name: 'Klarsti',
  data: { id: workId, name: 'Klarsti', nodes: [], edges: [], createdAt: 1 }, updatedAt: 2
});
await bekle('ilk yazma (kurulus, merge)', 'izin', () =>
  setDoc(doc(sahip, 'works', 'klasor__w1'), kurulusGovdesi('klasor', 'w1', []), { merge: true }));
await bekle('ikinci yazma (sadece icerik, merge)', 'izin', () =>
  setDoc(doc(sahip, 'works', 'klasor__w1'), { name: 'Klarsti 2', data: { id: 'w1' }, updatedAt: 3 }, { merge: true }));
await bekle('paylasik klasorde kurulus readers ile gecer', 'izin', () =>
  setDoc(doc(sahip, 'works', 'klasor-paylasik__w2'), kurulusGovdesi('klasor-paylasik', 'w2', [ORTAK]), { merge: true }));
await bekle('icerik yazmasi davetliyi listeden dusurmez', 'izin', async () => {
  await setDoc(doc(sahip, 'works', 'klasor-paylasik__w2'), { name: 'Yeni', updatedAt: 4 }, { merge: true });
  const snap = await getDoc(doc(sahip, 'works', 'klasor-paylasik__w2'));
  if (!(snap.data().readers || []).includes(ORTAK)) throw new Error('readers silinmis');
});

console.log('\n--- CALISMA: OKUMA ---');
await kur(['works', 'gizli'], temelCalisma({ name: 'Gizli' }));
await kur(['works', 'davetli'], temelCalisma({ name: 'Davetli', readers: [ORTAK], sharedWith: [ORTAK] }));
await kur(['works', 'linkli'], temelCalisma({ name: 'Linkli', isPublic: true }));

await bekle('sahip kendi calismasini okur', 'izin', () => getDoc(doc(sahip, 'works', 'gizli')));
await bekle('yabanci gizli calismayi okuyamaz', 'ret', () => getDoc(doc(yabanci, 'works', 'gizli')));
await bekle('davet edilen okur', 'izin', () => getDoc(doc(ortak, 'works', 'davetli')));
await bekle('davet edilen KLASORUN diger calismasini okuyamaz', 'ret', () => getDoc(doc(ortak, 'works', 'gizli')));
await bekle('acik linkli calismayi linki bilen okur', 'izin', () => getDoc(doc(yabanci, 'works', 'linkli')));
await bekle('giris yapmamis acik calismayi bile okuyamaz', 'ret', () => getDoc(doc(anonim, 'works', 'linkli')));

console.log('\n--- CALISMA: KATILMA VE DUZENLEME ---');
await bekle('acik calismaya katilma', 'izin', () =>
  updateDoc(doc(yabanci, 'works', 'linkli'), {
    readers: arrayUnion(YABANCI), sharedWith: arrayUnion(YABANCI),
    [`members.${YABANCI}`]: { name: 'Y', email: 'y@x.com', joinedAt: 2 }
  }));
await kur(['works', 'linkli2'], temelCalisma({ isPublic: true }));
await bekle('katilirken baskasi listeye sokulamaz', 'ret', () =>
  updateDoc(doc(yabanci, 'works', 'linkli2'), { readers: arrayUnion(KURBAN), sharedWith: arrayUnion(KURBAN) }));
await bekle('katilirken icerik degistirilemez', 'ret', () =>
  updateDoc(doc(yabanci, 'works', 'linkli2'), { readers: arrayUnion(YABANCI), sharedWith: arrayUnion(YABANCI), data: { hack: 1 } }));
await bekle('kapali calismaya linkle katilinamaz', 'ret', () =>
  updateDoc(doc(yabanci, 'works', 'gizli'), { readers: arrayUnion(YABANCI) }));

await bekle('davet edilen icerigi duzenler', 'izin', () =>
  setDoc(doc(ortak, 'works', 'davetli'), { data: { x: 1 }, updatedAt: 2 }, { merge: true }));
await bekle('davet edilen calismayi herkese acamaz', 'ret', () =>
  setDoc(doc(ortak, 'works', 'davetli'), { isPublic: true }, { merge: true }));
await kur(['works', 'ikili'], temelCalisma({ readers: [ORTAK, KURBAN], sharedWith: [ORTAK, KURBAN] }));
await bekle('davet edilen baskasini atamaz', 'ret', () =>
  updateDoc(doc(ortak, 'works', 'ikili'), { readers: arrayRemove(KURBAN) }));
await bekle('davet edilen ayrilabilir', 'izin', () =>
  updateDoc(doc(ortak, 'works', 'ikili'), { readers: arrayRemove(ORTAK), sharedWith: arrayRemove(ORTAK) }));
await bekle('davet edilen sahipligi devralamaz', 'ret', () =>
  setDoc(doc(ortak, 'works', 'davetli'), { ownerId: ORTAK }, { merge: true }));
await bekle('calisma baska klasore tasinamaz', 'ret', () =>
  setDoc(doc(ortak, 'works', 'davetli'), { projectId: 'baska' }, { merge: true }));

console.log('\n--- CALISMA: SILME ---');
await bekle('davet edilen calismayi silemez', 'ret', () => deleteDoc(doc(ortak, 'works', 'davetli')));
await bekle('sahip calismayi siler', 'izin', () => deleteDoc(doc(sahip, 'works', 'gizli')));

console.log('\n--- KISISEL VERI ---');
await bekle('kullanici kendi belgesini yazar', 'izin', () =>
  setDoc(doc(sahip, 'users', SAHIP), { notepad: [] }, { merge: true }));
await bekle('baskasinin belgesi okunamaz', 'ret', () => getDoc(doc(ortak, 'users', SAHIP)));
await bekle('baskasinin gun sonu kaydi okunamaz', 'ret', () =>
  getDoc(doc(ortak, 'users', SAHIP, 'journal', '2026-08-09')));

await env.cleanup();
console.log(`\nSONUC: ${gecti} gecti, ${kaldi} kaldi\n`);
process.exit(kaldi === 0 ? 0 : 1);
