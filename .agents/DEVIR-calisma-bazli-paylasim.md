# Devir Teslim — Çalışma Bazlı Paylaşım (Saklama Bölünmesi)

**Tarih:** 2026-08-09 · **Bırakılan sürüm:** `0.8.17-5` · **Durum:** 3 adımın 2'si bitti, 3. adım hiç başlamadı.

Bu belge yarım kalmış tek bir işin devri içindir. Bittiğinde sil.

---

## 1. Hedef

Kullanıcının isteği aynen şu:

> "Çalışmalarım" ağacı üç katlı olsun (Klasör → Araç → Çalışma) ve her üç seviyenin
> yanında paylaş düğmesi bulunsun. Tek bir çalışmayı paylaştığımda karşı taraf o
> çalışmayı **kendi klasör yolunda** görsün (`Abdullah kılıçaslan Yavuz → Zihin
> Haritası → Klarsti`) ama o klasörde **sadece paylaşılan çalışmayı** görebilsin.

Bunun önündeki tek engel saklama biçimiydi: bir projenin 14 aracının verisi tek bir
Firestore kaydında duruyor. Veritabanı bir kaydı ya tamamen verir ya hiç vermez,
yarısını veremez. Bu yüzden "sadece şu zihin haritasını paylaş" imkânsızdı. Aynı
kayıt 1 MB sınırına doğru da şişiyordu.

Plan üç adım:

1. ✅ Menüye üçüncü kat (bitti, `0.8.17-1`)
2. ✅ Saklamayı çalışma bazına bölmek (bitti, `0.8.17-3` … `0.8.17-5`) — **ama sadece YAZMA tarafı**
3. ⬜ **Okumayı yeni kayıtlara çevirmek + üç seviyeli paylaşımı bağlamak** ← KALAN İŞ

---

## 2. Şu an ne çalışıyor

### Yazma: çift yazım (dual write)

Veri **hem eski yerine hem yeni yere** yazılıyor. **Okuma hâlâ eski yerden.**
Bu bilerek böyle: yeni yolda bir hata çıkarsa eski kopya güncel kalsın, geri
dönülecek bir nokta olsun diye.

- Eski yer: `projects/{projectId}.toolData.<araçAnahtarı>` (dizi)
- Yeni yer: `works/{projectId}__{workId}` (her çalışma ayrı doküman)

İlgili dosyalar:

| Dosya | Rolü |
|---|---|
| `src/store/calismaYazma.ts` | `works` kayıtlarını kuran/güncelleyen/silen tek yer |
| `src/config/toolWorks.ts` | Araç → çalışma listesi eşlemesi (ad alanı, seçim eylemi, yeniden adlandırma/silme eylemleri, "başlanmamış mı" ölçütü) |
| `src/components/SyncManager.tsx` | Ayna yazması, ilk doldurma, öksüz süpürmesi |
| `src/store/useRoadmapStore.ts` | `works` dinleyicisi (`fetchWorks`), `WorkRecord` tipi, `deleteProject`'te kayıt silme |
| `firestore.rules` | `works` koleksiyonunun kuralları |

### `works` doküman şeması

```
works/{projectId}__{workId}
  ownerId      klasörün sahibi (çalışmanın ayrı sahibi yok)
  projectId    hangi klasörde
  projectName  klasörün adının KOPYASI
  workId       çalışmanın kendi kimliği
  tool         ToolId ('wbs', 'mindmap', ...)
  name         çalışmanın adı
  data         çalışma nesnesinin tamamı (WbsTree / Mindmap / SwotAnalysis ...)
  readers      bu kaydı görebilenlerin TAMAMI
  sharedWith   bunlardan yalnızca bu çalışmaya tek tek davet edilenler
  members      { uid: { name, email, joinedAt } }
  isPublic     çalışmanın kendi linki açık mı
  updatedAt
```

**Neden `projectName` kopya duruyor:** Paylaşılan çalışma karşı tarafta kendi klasör
yolunda görünmeli. Adı burada tutmasak alıcıya klasör kaydını okutmak gerekirdi; o
zaman klasörün paylaşılmamış ayarları ve üye listesi de görünürdü. Klasör adı
değişince sahibi kendi çalışma kayıtlarını da güncellemeli — **bu henüz yazılmadı,
bkz. §4.**

**Neden `readers` tek dizi:** Firestore bir sorguda yalnızca tek bir
"dizide var mı" (`array-contains`) koşuluna izin veriyor. Tek tek davet edilenler ve
klasör paylaşımından gelenler ayrı dizilerde tutulsaydı kullanıcının görebildiği
çalışmalar tek sorguda çekilemezdi.

**Doküman kimliği neden önekli:** Eski verinin taşınmasında sabit kimlikler
üretilmiş (`migrated-wbs`, `migrated-mindmap`, `migrated-fta`, `migrated-vsm`,
`migrated-5whys`). Öneksiz yazılsaydı iki ayrı projedeki iki ayrı ağaç aynı
dokümanı paylaşır, biri diğerini ezerdi.

### Kurallar

`firestore.rules` içindeki `match /works/{workId}` bloğu hazır ve **yayında**.
Özet:

- **create:** yalnızca klasörün sahibi ya da klasöre davet edilmiş biri. `ownerId`
  klasörün sahibi olmak zorunda. `sharedWith` ve `members` boş doğmalı,
  `readers` klasörün paylaşım listesinin **aynısı** olmalı. Bu koşul iki işi
  birden yapıyor: başkasının ağacına çalışma sokulmasını engelliyor **ve** klasör
  paylaşımının sonradan eklenen çalışmaları da kapsamasını sağlıyor.
- **read:** sahibi, `readers` içindekiler, ya da `isPublic` ise linki bilen herkes.
- **update:** üç dal — sahip (her şey) / erişimi olan (içerik, paylaşıma dokunamaz,
  kendini çıkarabilir) / açık linkle katılma (yalnızca kendi kimliğini ekler).
- **delete:** yalnızca sahibi.

---

## 3. KALAN İŞ (3. adım)

### 3a. Okumayı `works` kayıtlarına çevirmek

Bugün arayüz `projects/{id}.toolData` üzerinden besleniyor. Çevrilmesi gerekenler:

1. `useRoadmapStore.fetchProjects` → `parseDoc` çıktısındaki `toolData` yerine, o
   projeye ait `works` kayıtlarından dizileri kurmak. `works` dinleyicisi
   (`fetchWorks`) zaten çalışıyor ve `state.works` dolu.
2. `SyncManager` yazma tarafı: bugün önce eski yere yazıp sonra aynalıyor. Çevrildikten
   sonra asıl yazma `works` olmalı, eski yer bir süre daha ayna olarak kalmalı.
3. **Ortak çalışanların yazması.** Bugün ayna yazması yalnızca klasörün sahibi için
   çalışıyor (`SyncManager.calismalariDaYaz` içinde `project.userId !== user.uid`
   kontrolü). Okuma çevrildiğinde ortakların düzenlemeleri de `works`'e gitmeli.
4. Çalışmaların **sırası**. Bugün sıra dizideki sıra. Kayıtlar ayrı dokümanlara
   bölününce sıra kaybolur; `createdAt`'e göre sıralamak muhtemelen yeterli ama
   kullanıcı sürükleyip sıralayabiliyorsa bir `order` alanı gerekir.
5. Hiç çalışması olmayan proje, geri alma/ileri alma (`zundo`) ve açık çalışma
   seçimi (`active*Id`) yollarının kontrolü.
6. Geriye dönük yol: `works` kaydı olmayan proje için eski `toolData`'dan okumaya
   devam edilmeli (herkesin verisi taşınana kadar).

### 3b. Üç seviyeli paylaşım düğmeleri

- **Klasör:** zaten var, çalışıyor (`SharePanel`, `projectId` prop'u alıyor).
- **Araç:** yok. Karar verildi (kullanıcı onayladı): *o anda o araçta olan
  çalışmalar paylaşılır, sonradan eklenenler otomatik dahil olmaz.* Paylaşırken
  ekranda net yazılmalı: "Bu araçtaki 3 çalışma paylaşılacak."
  Kural tarafı bir şey gerektirmiyor; paylaşım anında ilgili kayıtların `readers`
  dizisine toplu ekleme yapılıyor.
- **Çalışma:** yok. Tek kaydın `isPublic`/`readers` alanları üzerinden.

Alıcı tarafında ağaç, **yalnızca okuyabildiği `works` kayıtlarından** kurulmalı:
`projectId`'ye göre grupla, başlığı `projectName`'den al, ortaya `tool` katını koy.
Alıcı klasör kaydını hiç okumaz. Emülatör testlerinde bunun karşılığı geçiyor:
*"davet edilen KLASÖRÜN diger calismasini okuyamaz"*.

---

## 4. Bilinen açıklar / tuzaklar

Sırayla düşünülmesi gerekenler:

1. **Klasör adı değişince kopyalar eskiyor.** `works.projectName` bir kopya.
   `updateProjectName` şu an yalnızca proje kaydını güncelliyor; o projenin
   çalışma kayıtlarındaki `projectName` alanı eski kalıyor. Alıcının gördüğü klasör
   adı yanlış olur. **Yazılmadı.**
2. **Ortak çalışan ayrılınca `works` temizlenmiyor.** `deleteProject`'in
   sahip-olmayan dalı yalnızca proje kaydından çıkıyor; o kişinin o projedeki
   çalışma kayıtlarının `readers` dizisinden çıkarılması gerekiyor.
3. **Proje açılınca boş başlangıç çalışması kurulup KAYDEDİLİYOR.**
   `getInitialValue` beş araç için (wbs, 5whys, mindmap, fta, vsm) varsayılan bir
   çalışma üretiyor; `loadProject` bunu duruma yazıyor, `SyncManager` de sunucuya.
   Kullanıcı o araca hiç dokunmasa bile. `calismaDokunulmamis` (bkz.
   `toolWorks.ts`) bunların ayrı kayıt almasını engelliyor **ama eski yere hâlâ
   yazılıyorlar.** Asıl davranışın düzeltilmesi ayrı bir iş.
4. **Eski format dönüşümü tek yönlü ve tek şanslı.** `parseDoc` içindeki
   dönüşümler `if (!Array.isArray(toolData.X))` ile korunuyor. Dizi bir kez
   **boş** olarak yazıldığında dönüşüm bir daha çalışmaz ve eski alanlar
   erişilemez kalır. Kullanıcının hata ağacında tam bu oldu (bilerek sildiği için
   sorun olmadı). Yeni bir dönüşüm yazarken bu tuzağı tekrarlama.
5. **Değer Akışı menüde hiç yok.** `TopRightProjectsMenu.TOOL_OPTIONS` listesinde
   `vsm` yok, dolayısıyla o araçtaki çalışmalar "Çalışmalarım" ağacında hiç
   görünmüyor. Küçük ve bağımsız bir eksik.
6. **Menü ile saklama farklı ölçüt kullanıyor.** Menü `toolWorks.enAzKutu` ile
   (kutu sayısı) gizliyor, saklama `calismaDokunulmamis` ile (varsayılana
   dokunulmuş mu) eliyor. Bugün çakışmıyorlar ama aynı soruyu iki farklı şekilde
   cevaplıyorlar; okuma çevrildiğinde tek ölçüte indirmek gerekebilir.
7. **Bütün `works` kayıtları tek seferde çekiliyor.** Bugün için doğru tercih
   (basit, tutarlı) ama kullanıcı başına doküman okuması artıyor. Hacim
   büyüdüğünde proje kaydında hafif bir dizin (`{ workId: {tool, name} }`)
   tutup ağır `data` alanını yalnızca açık proje için çekmek gerekebilir.

---

## 5. Çalışma yöntemi (bunlar zaman kazandırır)

### Kuralları yerelde test et — canlıya dokunmadan

```bash
npm i --no-save @firebase/rules-unit-testing
npx firebase emulators:exec --only firestore --project klarsti-rules-test "node scratch/rulesTest.mjs"
```

Java 21 kurulu, emülatör çalışıyor. `scratch/` **gitignore'da**, yani test dosyası
depoda yok — yeniden yazman gerekir. 2026-08-09'da 42 senaryo geçiyordu; kapsam:
proje oluşturma/okuma/paylaşma, çalışma oluşturma/okuma/katılma/düzenleme/silme,
kişisel veri izolasyonu, ve uygulamanın gönderdiği gövdenin birebir aynısıyla
yapılan ilk/ikinci yazma.

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

Koleksiyonu **filtresiz** listelemek 403 verir; kurallar öyle bir sorguyu
doğrulayamıyor. `ownerId == uid` gibi bir koşulla `runQuery` kullan.

**Yazma/silme isteklerini bu yolla çalıştırmaya kalkma:** 2026-08-09'da denendi,
sistem engelledi. Silinecek bir şey varsa ya uygulamaya kod olarak yaz ya da
kullanıcıya Firebase konsolundan yaptır.

### Deploy'u doğrularken

Service worker eski derlemeyi gösteriyor. Doğrulamadan önce:

```js
(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); })()
```

Sonra adrese `?v=<bugün>` gibi bir ek koyarak git; Firebase her dosyayı 1 saat
önbelleğe veriyor, düz yenileme eski derlemeyi getirebiliyor.

CI push ile dağıtıyor. Dağıtımın geldiğini ana sayfanın `ETag` başlığının
değişmesinden anlarsın.

---

## 6. Kullanıcı hakkında

- Kod okumuyor, yazılım bilgisi yok. Teknik terim kullanma, kısa ve düz anlat.
- Türkçe yaz, çeviri kokan cümle kurma.
- İşe başlamadan önce onay iste; onay verdikten sonra push ve dağıtımı sormadan yap.
- Canlı sitede (klarsti.com) kendi verisiyle test ediyor. Localhost'a bakmıyor.
- Verisini kendiliğinden silme. Silinmesi gerekiyorsa önce sor.
- Sürüm kuralı: `Major.Minor.Patch-Mini`, her görevde mini artar, `-9`'dan sonra
  patch artıp ek düşer. Bırakılan sürüm `0.8.17-5`, sıradaki `0.8.17-6`.
