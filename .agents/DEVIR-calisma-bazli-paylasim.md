# Çalışma Bazlı Paylaşım — Nasıl Çalışıyor, Ne Kaldı

**Son güncelleme:** 2026-08-10 · **Sürüm:** `0.8.17-9` · **Durum:** Üç adım da bitti.

Bu belge bitmiş bir işin özeti ve kalan tuzakların listesi. Devir teslim değil.

---

## 1. Kısaca ne oldu

Bir projenin 14 aracındaki bütün veri tek bir Firestore kaydında duruyordu.
Veritabanı bir kaydı ya tamamen verir ya hiç vermez; bu yüzden "sadece şu zihin
haritasını paylaş" imkânsızdı. Artık her çalışma kendi kaydında:

- **Menü üç katlı:** Klasör → Araç → Çalışma. Üçünün de yanında paylaş düğmesi var.
- **Tek bir çalışma paylaşıldığında** karşı taraf onu kendi klasör yolunda görüyor
  ama o klasörden başka hiçbir şey göremiyor.

---

## 2. Veri nerede duruyor

| Yer | Ne | Kim yazıyor |
|---|---|---|
| `works/{projectId}__{workId}` | Çalışmanın içeriği. **Doğrusu burası.** | Sahip ve klasöre davet edilen ortaklar |
| `projects/{projectId}.toolData` | Aynı verinin yedeği. Sıra ve hiç başlanmamış çalışmalar buradan okunuyor. | Aynı kişiler |

Yedek bilerek duruyor: yeni yolda bir terslik çıkarsa geri dönülecek bir nokta olsun diye.

### `works` doküman şeması

```
ownerId      klasörün sahibi (çalışmanın ayrı sahibi yok)
projectId    hangi klasörde
projectName  klasörün adının KOPYASI
workId       çalışmanın kendi kimliği
tool         ToolId ('wbs', 'mindmap', ...)
name         çalışmanın adı
data         çalışma nesnesinin tamamı
readers      bu kaydı görebilenlerin TAMAMI (klasör ortakları + tek tek davet edilenler)
sharedWith   bunlardan yalnızca bu çalışmaya tek tek davet edilenler
members      { uid: { name, email, joinedAt } }
isPublic     çalışmanın kendi linki açık mı
updatedAt
```

**Neden `projectName` kopya:** Paylaşılan çalışma karşı tarafta kendi klasör
yolunda görünmeli. Adı burada tutmasak alıcıya klasör kaydını okutmak gerekirdi;
o zaman klasörün paylaşılmamış ayarları ve üye listesi de görünürdü.
`updateProjectName` kopyaları da tazeliyor.

**Neden `readers` tek dizi:** Firestore bir sorguda yalnızca tek bir
"dizide var mı" koşuluna izin veriyor.

**Neden doküman kimliği önekli:** Eski verinin taşınmasında sabit kimlikler
üretilmişti (`migrated-wbs`, `migrated-mindmap`...). Öneksiz yazılsaydı iki ayrı
projedeki iki ağaç aynı dokümanı paylaşırdı.

### Adres biçimi

```
/project/{klasorId}/{arac}[/{calismaId}]   kendi klasörün
/work/{klasorId}/{arac}[/{calismaId}]      paylaşılan çalışma linki
```

`calismaId` 0.8.21-5'te eklendi. Öncesinde açık çalışma yalnızca hafızadaydı;
sayfa yenilenince listenin ilkine dönülüyordu, ve klasörü zaten açan birinde
paylaşım linki hedefini ıskalıyordu. Kimlik listede yoksa yok sayılıyor.
Seçimi olan yedi araçta geçerli (`toolWorks.ts` → `aktifAlan`).

### İlgili dosyalar

| Dosya | Rolü |
|---|---|
| `src/store/calismaOkuma.ts` | Proje ile çalışma kayıtlarını birleştiren tek yer |
| `src/store/calismaYazma.ts` | `works` kayıtlarını kuran/güncelleyen/silen tek yer |
| `src/config/toolWorks.ts` | Araç → çalışma listesi eşlemesi |
| `src/components/SyncManager.tsx` | Yazma, ilk doldurma, erişim tazeleme, öksüz süpürme |
| `src/components/SharePanel.tsx` | Üç seviyenin paylaşım penceresi |
| `src/store/useRoadmapStore.ts` | Dinleyiciler, `projeleriTazele`, paylaşım eylemleri |
| `firestore.rules` | `works` koleksiyonunun kuralları |

---

## 3. Dikkat edilmesi gereken kararlar

1. **Hangi çalışmaların OLDUĞUNA `toolData` karar veriyor**, kayıtlar yalnızca
   içeriği veriyor — klasörün kaydını okuyabildiğimiz sürece. Sebebi silme:
   çalışmayı silen ortak çalışan kaydı silemiyor (kurallar yalnızca sahibe izin
   veriyor), kayda bakılsaydı sildiği çalışma ekranına geri gelirdi.
   Klasör bize kapalıysa (`Project.klasorYok`) böyle bir toolData yok, ağaç
   tamamen kayıtlardan doğuyor.
2. **Erişim listesi iki yerden tazeleniyor.** Sahip her yazmada yeniden
   hesaplıyor: `readers = sharedWith ∪ klasörün sharedWith'i`. Klasöre davet
   edilen kişi de açılışta kendini ekliyor (kuralın 4. dalı, klasörün paylaşım
   listesine bakıyor). İkincisi olmadan, sahip çevrimdışıyken katılan biri o
   gelene kadar hiçbir çalışmayı okuyamıyor ve düzenlemesi kayboluyordu.
   Kişinin kendini eklemesi yalnızca `readers`'a; `sharedWith` "bu çalışmaya
   tek tek davet edilenler" demek, oraya yazılsaydı klasörden çıkarılan kişi
   çalışmada kalırdı.
3. **Araç paylaşımı o anki listeye veriliyor**, klasöre değil. Sonradan eklenen
   çalışma kendiliğinden dahil olmuyor (kullanıcının kararı).
4. **`worksLoaded` false ise** uygulama eskisi gibi `toolData`'dan çalışıyor.
   Bir erişim hatası yüzünden kayıtlar hiç gelmezse ekran boşalmasın diye.

---

## 4. Bilinen açıklar

1. **Proje açılınca boş başlangıç çalışması kurulup KAYDEDİLİYOR.**
   `getInitialValue` beş araç için (wbs, 5whys, mindmap, fta, vsm) varsayılan bir
   çalışma üretiyor; kullanıcı o araca hiç dokunmasa bile eski yere yazılıyor.
   `calismaDokunulmamis` bunların ayrı kayıt almasını engelliyor ama asıl
   davranışın düzeltilmesi ayrı bir iş.
2. **Eski format dönüşümü tek yönlü ve tek şanslı.** `parseDoc` içindeki
   dönüşümler `if (!Array.isArray(toolData.X))` ile korunuyor. Dizi bir kez
   **boş** olarak yazıldığında dönüşüm bir daha çalışmaz ve eski alanlar
   erişilemez kalır. Yeni bir dönüşüm yazarken bu tuzağı tekrarlama.
3. **Menü ile saklama farklı ölçüt kullanıyor.** Menü `toolWorks.enAzKutu` ile
   (kutu sayısı) gizliyor, saklama `calismaDokunulmamis` ile (varsayılana
   dokunulmuş mu) eliyor. İkisi aynı soruyu iki farklı şekilde cevaplıyor.
4. **Bütün `works` kayıtları tek seferde çekiliyor.** Hacim büyüdüğünde proje
   kaydında hafif bir dizin (`{ workId: {tool, name} }`) tutup ağır `data`
   alanını yalnızca açık proje için çekmek gerekebilir.
5. **Alıcı tarafı ikinci bir hesapla uçtan uca denenmedi.** Kural senaryoları
   emülatörde geçiyor, gönderen taraf canlıda çalışıyor; alıcının ağacında
   klasör başlığının nasıl göründüğü yalnızca kodla doğrulandı.

---

## 5. Çalışma yöntemi

### Kuralları yerelde test et — canlıya dokunmadan

```bash
npm i --no-save @firebase/rules-unit-testing
npx firebase emulators:exec --only firestore --project klarsti-rules-test "node scratch/calismaPaylasimTest.mjs"
```

Java 21 kurulu, emülatör çalışıyor. `scratch/` **gitignore'da**, yani test
dosyası depoda yok — yeniden yazman gerekir. 2026-08-10'da 33 senaryo geçiyordu:
kuruluş, tek çalışma paylaşımı, katılma, ayrılma, çıkarma, araç sorgusu,
klasör ortağının yetkileri, ve ortağın erişimini kendisi alması.

**Tuzak:** `arrayRemove`, dizide olmayan bir kimlik için hiçbir şey yapmaz. Bu
yüzden "ortak başkasını listeden atamaz" testi, kurbanı önce diziye koymadan
yazılırsa yanlışlıkla geçer.

Kural değişikliği CI ile gitmiyor, elle dağıtılmalı:

```bash
npx firebase deploy --only firestore:rules --project klarsti
```

### Canlıda kullanıcının verisini oku (yalnızca okuma)

Kullanıcı Claude tarayıcısında kendi hesabına giriş yapmış durumda ve kullanmana
izin verdi. Sayfa içinden kendi jetonuyla Firestore REST'e sorgu atılabiliyor:

```js
const idb = await new Promise(r => { const q = indexedDB.open('firebaseLocalStorageDb'); q.onsuccess = () => r(q.result); });
const items = await new Promise(r => { const q = idb.transaction('firebaseLocalStorage','readonly').objectStore('firebaseLocalStorage').getAll(); q.onsuccess = () => r(q.result); });
const u = items.map(i => i.value).find(v => v && v.stsTokenManager);
// u.uid, u.stsTokenManager.accessToken  ->  Authorization: Bearer <token>
// POST https://firestore.googleapis.com/v1/projects/klarsti/databases/(default)/documents:runQuery
```

Koleksiyonu **filtresiz** listelemek 403 verir. Jeton bir saatte bir eskiyor;
401 alırsan yukarıdaki bloğu tekrar çalıştır (boş sonucu "veri silinmiş"
sanma).

**Yazma/silme isteklerini bu yolla çalıştırmaya kalkma:** denendi, sistem
engelledi. Silinecek bir şey varsa ya uygulamaya kod olarak yaz ya da
kullanıcıya Firebase konsolundan yaptır.

### Deploy'u doğrularken

Service worker eski derlemeyi gösteriyor. Doğrulamadan önce:

```js
(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); })()
```

Sonra adrese `?v=<bugün>` gibi bir ek koyarak git.

**Dağıtımın geldiğini `dist/assets/...` dosyasını HEAD'leyerek anlamaya
çalışma:** hosting'de `**` yeniden yazması var, olmayan her adres 200 ve HTML
döndürüyor. Doğrusu, sayfayı yenileyip alt menüdeki sürüm yazısına bakmak.

---

## 6. Kullanıcı hakkında

- Kod okumuyor, yazılım bilgisi yok. Teknik terim kullanma, kısa ve düz anlat.
- Türkçe yaz, çeviri kokan cümle kurma.
- İşe başlamadan önce onay iste; onay verdikten sonra push ve dağıtımı sormadan yap.
- Canlı sitede (klarsti.com) kendi verisiyle test ediyor. Localhost'a bakmıyor.
- Verisini kendiliğinden silme. Silinmesi gerekiyorsa önce sor.
- Sürüm kuralı: `Major.Minor.Patch-Mini`, her görevde mini artar, `-9`'dan sonra
  patch artıp ek düşer.
