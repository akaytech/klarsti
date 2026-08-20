import type { ToolGuideBundle } from './types';

const kilavuzlar: ToolGuideBundle = {
  mindmap: {
    title: 'Zihin haritası',
    summary:
      'Tek bir merkezden dallanan, serbest çağrışımla fikir toplama aracı. Kutuları sen taşımazsın; her ekleme sonrası harita kendini yeniden dizer, böylece düzenle uğraşmadan içeriğe odaklanırsın.',
    whenToUse: [
      'Beyin fırtınası: sıra ve hiyerarşi netleşmeden önce fikirleri hızlı dökmek için.',
      'Bir konuyu alt başlıklara ayırmak, kapsamı görmek için.',
      'Toplantı, ders ya da kitap notunu dağılmadan tutmak için.',
      'İş kırılımına geçmeden önce ham fikirleri toplamak için.'
    ],
    steps: [
      'Bir projede birden çok harita tutabilirsin. Sol üstteki harita menüsünden yeni harita açar, haritalar arasında geçersin.',
      'Ortadaki kök kutuyu seç, F2 ile adını değiştir; konunun adını buraya yaz.',
      'Seçili kutuya Tab basınca altına yeni bir dal açılır. Yeni kutu doğrudan yazmaya hazır gelir.',
      'Enter ise aynı seviyede kardeş dal açar. Yazarken de çalışır: yazmayı bitirip Enter\'a basınca kaydeder ve bir sonraki kutuyu açar.',
      'Bir kutuya sağ tıkla: açıklama ekleyebilir, dalı bitti olarak işaretleyebilir, altı kalabalıksa daraltabilirsin.',
      'Sağ alttaki mini harita büyük haritalarda nerede olduğunu gösterir; üstünden sürükleyerek gezinebilirsin.'
    ],
    shortcuts: [
      { keys: ['Tab'], desc: 'Seçili kutunun altına yeni dal' },
      { keys: ['Enter'], desc: 'Aynı seviyede kardeş dal' },
      { keys: ['F2'], desc: 'Seçili kutunun adını değiştir' },
      { keys: ['Delete'], desc: 'Seçili dalı sil (kök kutu silinmez)' },
      { keys: ['Shift', 'Enter'], desc: 'Yazarken alt satıra geç' },
      { keys: ['Esc'], desc: 'Yazma alanını kapat' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Kutular elle taşınmaz; dizilim otomatiktir. Bir dalı başka yere almak istersen sil ve doğru yerde yeniden aç.',
      'Dal renkleri kökten çıkan ana dala göre belirlenir; aynı renk aynı ana başlığın altı demektir.',
      'Bir yazı alanının içindeyken Delete ve F2 kısayolları çalışmaz; önce Enter ya da Esc ile yazmayı bitir.'
    ]
  },

  wbs: {
    title: 'İş kırılım yapısı',
    summary:
      'Bir işi üç seviyede bölen ağaç: en üstte PROJE, onun altında FAZLAR, fazların altında İŞ PAKETLERİ. Her kutu durum, bitiş tarihi, çalışma saati ve açıklama taşır. Zihin haritasından farkı, burada fikir değil iş yönetiyor olman.',
    whenToUse: [
      'Bir projeyi kimin ne yapacağı belli olacak kadar küçük parçalara ayırmak için.',
      'Kapsamı sabitlemek için: ağaçta olmayan iş projede de yoktur.',
      'İşleri takvime bağlamak ve ilerlemeyi durumlarla takip etmek için.'
    ],
    steps: [
      'Bir ağaçta tek proje kutusu olur. İkinci bir proje için soldaki "Ağaçlar" menüsünden yeni bir ağaç aç.',
      'Ekranın altındaki ekleme düğmesi hedefe göre değişir: proje seçiliyken "Faz Ekle", faz ya da iş paketi seçiliyken "İş Paketi Ekle" der. Hiçbir şey seçili değilse projenin altına faz ekler.',
      'Aynı işi kısayolla yapmak istersen kutuya Ctrl basılı tıkla: altına yenisini açar.',
      'Ctrl\'süz tıklamak kutuyu yalnızca seçer. Alt dalları açıp kapatmak için kutuya ÇİFT tıkla; kamera da o kutuya ortalanır. (İsmine çift tıklamak ismi düzenler.)',
      'Kutuya sağ tıkla: adı, bitiş tarihi, başlangıç–bitiş saati, açıklama ve durum (Yapılacak / Devam Ediyor / Tamamlandı / Başarısız) buradan ayarlanır.',
      'Aynı menüdeki "Ajandaya Planla" işi seçtiğin tarihle ajandana taşır. Geçmiş bir tarih seçilmişse uyarı verir.',
      'Bir işi Başarısız işaretlersen menüde "kök nedeni analiz et" çıkar; tek tıkla o iş 5 Neden aracına problem olarak taşınır.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Tık'], desc: 'Proje kutusunda: altına faz' },
      { keys: ['Mod', 'Tık'], desc: 'Faz ya da iş paketinde: altına iş paketi' },
      { keys: ['Shift', 'Sürükle'], desc: 'Kutuyu altındaki tüm dallarla birlikte taşı' },
      { keys: ['Delete'], desc: 'Seçili kutuyu sil' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'İş paketinin altındaki de iş paketidir; kırılım istediğin kadar derine inebilir.',
      'Shift\'e basmadan sürüklersen sadece tuttuğun kutu hareket eder, altındakiler yerinde kalır.',
      'Kırılımı, her iş paketi tek bir kişinin tek başına bitirebileceği büyüklüğe inene kadar sürdür.',
      'Tarihi silmek istersen sağ tık menüsündeki tarih alanının yanındaki çarpıya bas; saatler de birlikte temizlenir.'
    ]
  },

  '5whys': {
    title: '5 Neden analizi',
    summary:
      'Bir problemi "peki bu neden oldu?" diye üst üste sorarak yüzeydeki belirtiden kök nedene inme yöntemi. Beş sayısı kural değil, ölçüdür: kendini tekrar etmeye başladığında dibe inmişsindir.',
    whenToUse: [
      'Bir aksaklığın gerçek sebebini bulmak, belirtiyi tedavi etmekten kaçınmak için.',
      'Hata sonrası değerlendirmelerde, suçlu değil sebep aramak için.',
      'Bir WBS görevi başarısız olduğunda nedenini kayda geçirmek için.'
    ],
    steps: [
      'Sol üstteki menüden aynı projedeki analizler arasında geçer, yeni analiz açar, adını değiştirir ya da silersin.',
      'Boş ekranda "Problem Ekle" ile başla; ne olduğunu tek cümleyle yaz. Aracı tanımak istiyorsan hazır örneği de yükleyebilirsin.',
      'Bir kutuya Ctrl basılı tıkla: altına yeni bir "neden" kutusu açılır. Cevabı oraya yaz, sonra aynı şeyi o kutuya uygula.',
      'Daha fazla inemediğin noktada o kutuya Shift basılı tıkla: kök neden kutusu açılır. Kök neden kutusunun altına yeni dal eklenmez, zincir orada biter.',
      'Kutulara sağ tıklayarak metni düzenler ya da silersin.',
      'Boş alana Ctrl basılı tıklarsan aynı kanvasta ikinci bir bağımsız problem zinciri başlatabilirsin.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Tık'], desc: 'Kutu üzerinde: altına yeni neden' },
      { keys: ['Shift', 'Tık'], desc: 'Kutu üzerinde: kök neden kutusu' },
      { keys: ['Mod', 'Tık'], desc: 'Boş alanda: yeni problem' },
      { keys: ['Delete'], desc: 'Seçili kutuyu sil' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Kırılım ağacındaki bir işten kök neden analizi başlattığında, o iş için ayrı bir analiz açılır; açık analizin üstüne yazılmaz.',
      'Bir nedenin birden çok cevabı olabilir; aynı kutuya birkaç kez Ctrl+tık yaparak dallandırabilirsin.',
      'Her cevabı doğrulanabilir bir olguya dayandır. "Dikkatsizlik" bir kök neden değil, cevaplanmamış bir sorudur.',
      'WBS\'te başarısız işaretlediğin bir görev, sağ tık menüsünden buraya problem olarak gönderilebilir.'
    ]
  },

  flowchart: {
    title: 'Akış diyagramları',
    summary:
      'Bir sürecin adımlarını, karar noktalarını ve akış yönünü çizersin. Üç şema türü var: İş Akış Şeması, Süreç Akış Şeması ve Veri Akış Şeması. Seçtiğin türe göre kullanabileceğin kutu şekilleri değişir.',
    whenToUse: [
      'İş Akış Şeması: görevleri, kararları, onayları ve kimin yaptığını göstermek için.',
      'Süreç Akış Şeması: operasyon, taşıma, kontrol, bekleme ve depolama adımlarıyla üretim/hizmet sürecini çözümlemek için.',
      'Veri Akış Şeması: dış varlıklar, süreçler ve veri depoları arasındaki veri hareketini çizmek için.'
    ],
    steps: [
      'Araç ilk açıldığında tür seçim ekranı çıkar. Türü sonradan da değiştirebilirsin; kutular yeni türün en yakın karşılığına çevrilir.',
      'Sol üstteki şema menüsünden aynı proje içinde birden çok şema tutabilir, aralarında geçiş yapabilirsin.',
      'Bir kutuya sağ tıkla: altına yeni kutu eklerken şeklini de seçersin (başlangıç, işlem, karar, belge, bitiş...). Aynı menüden metni düzenler ya da kutuyu silersin.',
      'Kutuları serbestçe sürükleyerek yerleştirirsin; burada otomatik dizilim yok, düzen sana ait.',
      'Bağlantı çizmek için bir kutunun kenarındaki bağlantı noktasından diğer kutuya sürükle.',
      'Sol alttaki kontrol düğmeleriyle yakınlaştırır, sağ alttaki mini haritayla büyük şemalarda gezinirsin.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Seçili kutuyu ya da bağlantıyı sil' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Karar kutusundan çıkan her yolu etiketle; okuyan kişi hangi koşulda nereye gidildiğini görmeli.',
      'Bir şema tek sayfaya sığmıyorsa süreci parçala: kalabalık bir bölümü alt süreç kutusuna alıp ayrı şema olarak çiz.',
      'İş akış şemasındaki Rol kutusu, adımı kimin yaptığını göstermek içindir; süreci kişilerden bağımsız anlatmak istiyorsan kullanma.'
    ]
  },

  orgchart: {
    title: 'Organizasyon Şemaları',
    summary:
      'Kimin kime bağlı olduğunu, hangi birimin nerede durduğunu gösterir. Yedi şema türü var: hiyerarşik, fonksiyonel, bölümsel, matris, düz, takım bazlı ve ağ. Seçtiğin tür hem kutu çeşitlerini hem de bağlantıların çizim biçimini belirler.',
    whenToUse: [
      'Mevcut yapıyı kayda geçirmek, boş kadroları ve fazlalıkları görmek için.',
      'Yeniden yapılanmayı tartışmak: aynı ekibi farklı türlerde çizip karşılaştırmak için.',
      'Matris türünde çift raporlamayı, ağ türünde dış paydaşları açıkça göstermek için.'
    ],
    steps: [
      'Araç ilk açıldığında şema türünü seçersin. Tür sonradan değiştirilebilir; kutular yeni türün en yakın karşılığına çevrilir, dizilim korunur.',
      'Sol üstteki şema menüsünden aynı proje içinde birden çok şema tutabilirsin (örneğin mevcut yapı ve hedef yapı).',
      'Kutuya sağ tıkla: altına yeni pozisyon, birim, ekip ya da boş kadro eklersin. Aynı menüden adı ve altındaki unvanı düzenlersin.',
      'Kutuları sürükleyerek istediğin gibi yerleştirirsin.',
      'Normal bağlantı, kutunun alt ve üst noktalarından çekilir: bu asıl raporlama hattıdır.',
      'Kutuların yan noktalarından çektiğin çizgiler kesik çizgiyle çizilir; bu ikincil raporlamadır (matris, hiyerarşik ve ağ şemalarında geçerli).'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Seçili kutuyu ya da bağlantıyı sil' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Boş kadro kutusu, doldurulmamış pozisyonları şemada görünür tutar; işe alım planını buradan okuyabilirsin.',
      'Kutunun alt satırını unvan için kullan: üst satır kişi ya da birim adı, alt satır görev.',
      'Kesik çizgi ile düz çizgiyi karıştırma: düz çizgi kime bağlı olduğunu, kesik çizgi kiminle çalıştığını anlatır.'
    ]
  },

  swot: {
    title: 'SWOT analizi',
    summary:
      'Bir fikri, projeyi ya da kurumu dört pencereden okur: içeride ne iyi, ne kötü; dışarıda hangi fırsat, hangi tehdit var. Amaç dört liste çıkarmak değil, bu listeleri birbirine bağlayıp strateji üretmek.',
    whenToUse: [
      'Bir işe girişmeden önce durumu topluca görmek için.',
      'Yıllık plan ya da bütçe öncesi mevcut konumu tespit etmek için.',
      'Rakip karşısında nerede durduğunu değerlendirmek için.',
      'Ekipçe ortak bir resim çıkarmak için: herkes aynı dört kutuya bakar.'
    ],
    steps: [
      'Üstteki alana analizin adını yaz ve Oluştur\'a bas. Aynı projede birden çok SWOT tutabilirsin.',
      'Dört kutu açılır: Güçlü Yönler, Zayıf Yönler, Fırsatlar, Tehditler.',
      'Her kutunun altındaki alana maddeyi yaz ve Enter\'a bas ya da artı düğmesine tıkla.',
      'Yazdığın maddenin üstüne tıklayıp doğrudan düzenlersin; değişiklik kendiliğinden kaydedilir.',
      'Maddenin köşesindeki çöp kutusu o maddeyi, başlıktaki çöp kutusu analizin tamamını siler.',
      'Aracı tanımak istiyorsan hiç analiz yokken çıkan ekrandan hazır örneği yükle.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Yazdığın maddeyi kutuya ekle' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Güçlü ve zayıf yönler içeride, senin elinde olan şeylerdir; fırsat ve tehdit dışarıda, elinde olmayanlar. Bu ayrımı karıştıran bir SWOT işe yaramaz.',
      'Asıl iş kutuları eşleştirmekte: hangi güçlü yön hangi fırsatı yakalar, hangi zayıflık hangi tehdide açık bırakır.',
      'Bir kutuyu on maddeyle doldurup diğerini boş bırakmak analiz değil, taraf tutmaktır.'
    ]
  },

  ishikawa: {
    title: 'Balık kılçığı diyagramı',
    summary:
      'Bir problemin olası nedenlerini altı başlık altında toplar: İnsan, Makine, Malzeme, Metot, Ölçüm ve Çevre. Balığın başı problem, kılçıklar neden gruplarıdır. Amaç nedeni tek bir yerde aramak yerine bütün alanları taramak.',
    whenToUse: [
      'Nedenin nerede olduğu belli değilken, hiçbir alanı atlamadan tarama yapmak için.',
      'Ekiple beyin fırtınası yaparken herkesin kendi alanından katkı vermesi için.',
      '5 Neden\'e girmeden önce aday nedenleri toplamak için.'
    ],
    steps: [
      'Üstteki alana problemi tek cümleyle yaz ve Başla\'ya bas.',
      'Altı kategori kutusu açılır. Her kutunun altındaki alana o alandaki olası nedeni yaz, Enter\'a bas.',
      'Problem cümlesini başlıktan, maddeleri kendi kutularından tıklayarak düzenlersin.',
      'Aynı projede birden çok analiz tutabilirsin; her biri kendi problem cümlesiyle ayrı bir kart olur.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Yazdığın nedeni kategoriye ekle' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Her kategoriyi doldurmak zorunda değilsin; boş kalan bir kategori de bilgidir.',
      'Neden yazarken belirtiyi değil, olan biteni yaz: "geç kaldı" değil, "onay üç gün bekledi".',
      'Listeden en güçlü birkaç adayı seçip 5 Neden aracında derinleştir; Ishikawa genişlik, 5 Neden derinlik verir.'
    ]
  },

  pdca: {
    title: 'PUKÖ döngüsü',
    summary:
      'Planla, Uygula, Kontrol Et, Önlem Al. Bir iyileştirmeyi tek seferlik iş olarak değil, dönen bir çark olarak yürütür: her tur, bir öncekinin sonucuyla başlar.',
    whenToUse: [
      'Küçük bir değişikliği deneyip sonucunu ölçmek, sonra yaymak için.',
      'Alınan önlemin gerçekten işe yarayıp yaramadığını kayıt altına almak için.',
      'Sürekli iyileştirme yürüten ekiplerde turları takip etmek için.'
    ],
    steps: [
      'Üstteki alana döngünün hedefini yaz ve Başla\'ya bas.',
      'Dört faz kutusu açılır. Her fazın altındaki alana maddelerini ekle.',
      'Bir maddenin solundaki halkaya tıklayınca madde tamamlandı olarak işaretlenir ve üstü çizilir.',
      'Aynı projede birden çok döngü tutabilirsin; her hedef ayrı bir kart olur.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Yazdığın maddeyi faza ekle' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Kontrol fazına ölçülebilir bir şey yaz. "İyileşti mi?" sorusunun cevabı bir sayıya dayanmıyorsa döngü kapanmaz.',
      'Önlem Al fazında çıkan sonuç, bir sonraki döngünün Planla fazının girdisidir.',
      'Dört kutuyu aynı anda doldurmaya çalışma; sırayla ilerlemek yöntemin kendisi.'
    ]
  },

  waterfall: {
    title: 'Şelale modeli',
    summary:
      'Projeyi altı faza böler ve sırayla yürütür: Gereksinim Analizi, Üst Düzey Tasarım, Alt Düzey Tasarım, Uygulama, Test, Bakım. Bir faz kapanmadan sonraki açılmaz; kapanan faz da kilitlenir.',
    whenToUse: [
      'Gereksinimlerin baştan belli olduğu, yol boyunca değişmeyeceği işlerde.',
      'Onay ve belgelendirme gerektiren, fazların kayıt altına alınması gereken projelerde.',
      'Sıranın kendisinin önemli olduğu işlerde: tasarım bitmeden üretime geçilmemesi gerekiyorsa.'
    ],
    steps: [
      'Üstteki alana proje adını yaz ve Başla\'ya bas.',
      'Altı faz alt alta dizilir. Yalnızca açık olan faza madde eklenir; sonraki fazlar asma kilitle işaretlidir.',
      'Faz maddelerini yazıp bitirdiğinde kutunun altındaki "aşamayı tamamla" düğmesine bas.',
      'Onaydan sonra sonraki faz açılır; tamamlanan faz tikle işaretlenir ve maddeleri artık değiştirilemez.',
      'Aynı projede birden çok şelale projesi tutabilirsin.'
    ],
    shortcuts: [
      { keys: ['Enter'], desc: 'Yazdığın maddeyi faza ekle' },
      { keys: ['Mod', 'Z'], desc: 'Geri al (tamamlanan fazı da geri alır)' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Fazı geri açan bir düğme yok; yanlışlıkla tamamladıysan tek yol geri alma kısayolu.',
      'Bir fazı kapatmadan önce maddelerinin gerçekten tamam olduğundan emin ol — kapanınca metinler de kilitlenir.',
      'Gereksinimlerin yol boyunca değişeceği bir işte şelale seni sıkıştırır; orada WBS ya da PUKÖ daha rahat çalışır.'
    ]
  },

  fta: {
    title: 'Hata Ağacı Analizi (FTA)',
    summary:
      'Tepede istenmeyen bir olay, altında o olayın gerçekleşmesi için hangi koşulların bir araya gelmesi gerektiği durur. Ağaç mantık kapılarıyla kurulur; temel olaylara olasılık girersen tepe olayın olasılığı kendiliğinden hesaplanır.',
    whenToUse: [
      'Bir arızanın ya da kazanın hangi koşul birleşimlerinden çıkabileceğini görmek için.',
      'Riski sayıyla konuşmak için: hangi dalın toplam olasılığa ne kadar katkı verdiğini ölçmek.',
      'Bir güvenlik önleminin hangi dalı kestiğini göstermek için.'
    ],
    steps: [
      'Sol üstteki menüden aynı projedeki ağaçlar arasında geçer, yeni ağaç açar, adını değiştirir ya da silersin.',
      'Boş ekranda tepe olay kutusunu oluştur ya da hazır örneği yükle.',
      'Kutuya sağ tıkla, Düzenle ile adını, açıklamasını ve (temel olaylarda) olasılığını gir.',
      'Aynı menüden altına olay ekle: olay, temel olay, geliştirilmemiş olay ya da koşul olayı.',
      'Yine aynı menüden mantık kapısı ekle: VE, öncelikli VE, VEYA, özel VEYA ya da engelleyici kapı.',
      'Temel olaylara yüzde olarak olasılık gir; üstteki kapılar ve tepe olay bu değerlerden hesaplanır.',
      'Kutuları sürükleyerek yerleştirir, sağ alttaki mini haritayla büyük ağaçta gezinirsin.'
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Seçili kutuyu sil' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'VE kapısında alt olasılıklar çarpılır: hepsi birden gerçekleşmelidir, sonuç küçülür. VEYA kapısında biri bile yeterlidir, sonuç büyür.',
      'Olasılık girmediğin dallar hesaba katılmaz; tepe olaydaki sayı, girdiğin verinin kapsadığı kadarını anlatır.',
      'Temel olay yuvarlak, geliştirilmemiş olay baklava dilimi: daha aşağı inmediğin dalları geliştirilmemiş olarak işaretlersen ağaç dürüst kalır.'
    ]
  },

  vsm: {
    title: 'Değer akışı haritalama',
    summary:
      'Bir ürünün ya da işin baştan sona akışını, aradaki bekleme ve stoklarla birlikte çizer. Amaç toplam sürenin ne kadarının gerçekten değer kattığını görmek — genelde sanılandan çok daha azıdır.',
    whenToUse: [
      'Bir sürecin nerede beklediğini, işin nerede yığıldığını bulmak için.',
      'Hangi işlemin müşteri talebine yetişemediğini görmek için: takt zamanını aşan var mı?',
      'Mevcut durumu çizip yanına gelecek durumu koyarak ikisini kıyaslamak için.',
    ],
    steps: [
      'Sağ üstteki panele günlük talebi ve vardiya bilgisini gir. Takt zamanı buradan çıkar: bir parçanın kaç saniyede çıkması gerektiği.',
      'Boş kanvasta başlangıç iskeletini kur ya da boş sayfadan git. Kanvasa sağ tıklayarak istediğin kutuyu eklersin.',
      'İşlem kutusuna çevrim süresini birimiyle birlikte yaz. Süre takt zamanını aşarsa kutu kırmızıya döner: darboğaz orasıdır.',
      'Stok kutusuna bekleyen parça adedini yaz; bekleme süresi adet ÷ günlük talep olarak kendiliğinden çıkar. Sayım yoksa süreyi elle de girebilirsin.',
      'Kutuları bağla. Bağlantıya sağ tıklayıp itme, çekme, FIFO, elle bilgi ya da elektronik bilgi okuna çevir. Zaman hesabına yalnızca malzeme okları girer.',
      'Sol üstteki menüden mevcut durumun kopyasını gelecek durum olarak çıkar, üstünde oyna, alttaki sayıları kıyasla.',
    ],
    shortcuts: [
      { keys: ['Delete'], desc: 'Seçili kutuyu sil' },
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Alttaki akış verimliliği, katma değerli sürenin toplam teslim süresine oranı. Tek hanelerde çıkması normaldir; kısaltılacak yer bekleme, işlem değil.',
      'Stokları haritaya koymazsan toplam süre olduğundan iyi görünür; asıl bilgi orada saklı.',
      'Zincire bağlanmamış kutular toplamlara girmez, altta uyarı olarak sayılır. Akışı tek hat halinde bağla.',
      'Kaizen patlamasını iyileştirme yapacağın noktaya koy; gelecek durum haritası böyle okunur.',
    ]
  },

  pareto: {
    title: 'Pareto analizi',
    summary:
      'Sonuçların çoğu, nedenlerin azından çıkar. Kategorileri sıklığa göre büyükten küçüğe sıralar ve üstüne kümülatif yüzde eğrisi çizer; böylece işin çoğunu hangi birkaç kalemin oluşturduğu görünür.',
    whenToUse: [
      'Çok sayıda şikâyet, hata ya da gider kalemi arasından önce hangisine bakacağına karar vermek için.',
      'Bir iyileştirmenin en çok nerede karşılık vereceğini göstermek için.',
      'Kaynağı dağıtmak yerine birkaç noktaya yoğunlaştırmayı savunurken.'
    ],
    steps: [
      'İlk açılışta analizi oluştur. Üstteki listeden aynı projedeki analizler arasında geçer, kalem simgesiyle adını değiştirir, çöp kutusuyla silersin.',
      'Sol paneldeki tabloya kategori adını ve sıklığını gir.',
      'Yeni satır için tablonun altındaki ekle düğmesini kullan.',
      'Grafik anında güncellenir: çubuklar büyükten küçüğe sıralanır, eğri kümülatif yüzdeyi gösterir.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Sıklık yerine maliyet ya da kaybedilen süre de girebilirsin; yeter ki bütün satırlar aynı birimden olsun.',
      'Eğrinin dikliğini kaybettiği yerde dur: sağdaki uzun kuyruk, uğraşmaya değmeyen kısımdır.',
      'Kategorileri fazla ufalarsan hiçbiri öne çıkmaz ve grafik düzleşir; benzer kalemleri birleştir.'
    ]
  },

  histogram: {
    title: 'Histogram',
    summary:
      'Bir ölçümün dağılımını gösterir: değerler nerede toplanıyor, dağılım simetrik mi, kenarda kalan var mı. Ham ölçümleri verirsin, sınıflara kendisi böler; ortalama, standart sapma ve spesifikasyon sınırı verdiysen süreç yeterliliğini de hesaplar.',
    whenToUse: [
      'Ortalamanın gizlediğini görmek için: aynı ortalama, çok farklı dağılımlardan çıkabilir.',
      'Bir sürecin ne kadar tutarlı çalıştığını değerlendirmek için — dar dağılım tutarlı, geniş dağılım savruk demektir.',
      'Ölçümlerin spesifikasyon dışına ne sıklıkta çıktığını ve sürecin talebi karşılayıp karşılamadığını görmek için.',
    ],
    steps: [
      'Analizi oluştur; üstteki listeden aynı projedeki analizler arasında geçersin.',
      'Sol paneldeki kutuya ölçümleri yaz ya da listeyi olduğu gibi yapıştır. Her satıra bir değer; ondalık için virgül de nokta da olur.',
      'Sınıf sayısını araç kendisi seçer (Sturges kuralı). Beğenmezsen elle bir sayı yaz.',
      'Alt ve üst spesifikasyon sınırını gir. Grafikte kırmızı kesikli çizgiler olarak çıkar, dışarıda kalan sütunlar kırmızıya döner.',
      'Altta ölçüm sayısı, ortalama, standart sapma ve aralık durur; iki sınırı da girdiysen Cp ve Cpk de hesaplanır.',
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Gri eğri, aynı ortalama ve sapmaya sahip normal dağılım. Sütunlar bu eğriden belirgin sapıyorsa süreçte özel bir neden vardır.',
      'İki tepeli bir dağılım genelde iki farklı sürecin (iki vardiya, iki makine) aynı tabloya karıştığını gösterir.',
      'Cpk 1,33 ve üstü genelde yeterli sayılır; 1’in altı sürecin sınırları tutturamadığı anlamına gelir.',
      'Cp iyi ama Cpk kötüyse süreç yeterince dar ama ortalama kaymıştır — ayarla düzelir, dağılımı daraltmaya gerek yok.',
    ]
  },

  decision: {
    title: 'Karar Matrisi',
    summary:
      'Birden çok seçeneği aynı kriterlerle puanlayıp karşılaştırır. Her kriterin bir ağırlığı vardır; bir seçeneğin toplamı, puan × ağırlık çarpımlarının toplamıdır.',
    whenToUse: [
      'Birkaç alternatif arasında sıkıştığın, "hangisi daha iyi" tartışmasının dönüp durduğu durumlarda.',
      'Kararın gerekçesini yazılı bırakmak gerektiğinde.',
      'Ekipte herkesin farklı bir kritere baktığı hâlde bunu söylemediği durumlarda: matris kriterleri açığa çıkarır.'
    ],
    steps: [
      'Kriter ekle: karşılaştırmayı hangi başlıklar üzerinden yapacaksan (maliyet, süre, risk...).',
      'Her kritere 1–5 arasında bir ağırlık ver; ağırlık, o başlığın senin için ne kadar önemli olduğudur.',
      'Seçenek ekle: karşılaştıracağın alternatifler.',
      'Tabloda her seçeneğe her kriterden 0–10 arasında puan ver.',
      'Toplamlar kendiliğinden hesaplanır; en yüksek puanlı seçenek kupa simgesiyle işaretlenir.'
    ],
    shortcuts: [
      { keys: ['Mod', 'Z'], desc: 'Geri al' },
      { keys: ['Mod', 'Y'], desc: 'İleri al' }
    ],
    tips: [
      'Ağırlıkları puanlamaya başlamadan önce belirle. Sonradan oynamak, karar vermek değil istediğin sonucu üretmek olur.',
      'Matris kararı senin yerine vermez; neye göre karar verdiğini görünür kılar.',
      'İki toplam birbirine çok yakınsa cevap "eşit" değil, "bu kriterler ayırt etmiyor" demektir: eksik bir kriter ara.'
    ]
  },

  notepad: {
    title: 'Ajanda',
    summary:
      'Günlerini takvimden seçip planladığın kişisel alan. Diğer araçlardan farkı, ajandanın proje verisi olmaması: kayıtların sana ait, bir projeyi paylaştığında karşı tarafa gitmez.',
    whenToUse: [
      'Günlük planı çıkarmak, işleri saatlere yerleştirmek için.',
      'WBS\'teki bir görevi belirli bir güne çekmek için.',
      'Günü kapatırken ne olduğunu kendi cümlelerinle yazmak için.'
    ],
    steps: [
      'Takvimde kaydı olan günler işaretlidir; bir güne tıklayınca o günün akışı açılır.',
      'Yeni kayıt için başlığı ve metnini yaz. İstersen saat aralığı ver, istersen tüm gün olarak bırak.',
      'Saat aralığı verdiğinde o saatlerde başka bir kaydın varsa çakışma uyarısı çıkar.',
      'Hatırlatma seçebilirsin: tam zamanında, 5 / 15 / 30 dakika, 1 saat ya da 1 gün önce. Hatırlatmalar mobil uygulamada bildirim olarak gelir.',
      'Üstteki Gün Sonu Değerlendirmesi bölümüne günü kendi cümlelerinle yazarsın; ayrıca kaydetmen gerekmez.',
      'Geçmiş bir güne yeni kayıt eklenmez. Var olan kayıtları düzenleyebilir, "bugüne taşı" ile bugüne alabilirsin.'
    ],
    tips: [
      'WBS\'te bir göreve sağ tıklayıp "Ajandaya Planla" dersen görev kendi tarihiyle buraya düşer.',
      'Geri alma ve ileri alma düğmeleri ajandada çalışmaz; ajanda geçmiş kaydı tutmuyor.',
      'Takvimin altındaki liste yaklaşan kayıtlarını gösterir; hangi güne bakacağını bilmiyorsan oradan başla.'
    ]
  },
  gantt: {
    title: "Gantt Şeması",
    summary: "İşleri takvim üzerine yatay çubuklar halinde dizen plan aracı. Hangi iş ne zaman başlıyor, ne kadar sürüyor, hangisi hangisini bekliyor — hepsi tek ekranda görünür.",
    whenToUse: [
      "Bir işi tarihlere bağlamak, kimin ne zaman başlayacağını netleştirmek için.",
      "İşlerin sırasını ve birbirini bekleyen adımları göstermek için.",
      "Planın gerisinde kalan işleri erken görmek için."
    ],
    steps: [
      "Bir projede birden çok şema tutabilirsin. Sol üstteki menüden yeni şema açar, aralarında geçersin.",
      "\"Görev ekle\" ile satır açarsın. Satırın adına çift tıklayıp değiştirirsin.",
      "Bir satırı seçince altta ayrıntı şeridi çıkar: başlangıç, bitiş, ilerleme yüzdesi ve durum oradan verilir.",
      "Çubuğu sürükleyerek tarihi kaydırır, ucundan çekerek süresini uzatıp kısaltırsın.",
      "Girinti düğmesiyle bir satırı üsttekinin alt görevi yaparsın. Üst görevin çubuğu alt görevlerinden hesaplanır, elle değiştirilmez.",
      "Bağımlılık düğmesinden \"şu bitmeden başlamaz\" bağı kurarsın; şemada aralarına ok çizilir."
    ],
    tips: [
      "Süresi olmayan işaretler için kilometre taşı seç: çubuk yerine baklava şeklinde görünür.",
      "Bugünü gösteren kırmızı çizgi hep ekranda; bitiş tarihi geçmiş ve bitmemiş işlerin çubuğu kırmızı çerçeveli çıkar.",
      "Gün / hafta / ay düğmeleri şemayı sıkıştırıp açar. Uzun planlarda ay görünümü bütünü tek ekrana sığdırır."
    ]
  },

  roadmap: {
    title: "Yol Haritası",
    summary: "Bir konuyu baştan sona sıralı duraklara bölen, her durağın yanına konuların asıldığı harita. Kutuları sen taşımazsın; her eklemeden sonra harita kendini dizer. Kırılım ağacından farkı ilerleme tutması: her kutunun bir durumu var ve üstteki şerit haritanın yüzde kaçının bittiğini söyler.",
    whenToUse: [
      "Bir konuyu öğrenme sırasına dizmek ve nerede kaldığını takip etmek için.",
      "Yeni bir çalışanın ilk aylarını adım adım planlamak için.",
      "Bir işin hangi aşamalardan geçeceğini tek ekranda göstermek için.",
      "Bir eğitim programını konu konu çıkarıp kaynaklarını iliştirmek için."
    ],
    steps: [
      "Bir klasörde birden çok harita tutabilirsin. Sol üstteki menüden yeni harita açar, aralarında geçersin.",
      "Ana hat baştan sona akar. Bir durağı seçip Enter’a basınca ardına yeni durak eklenir.",
      "Seçili duraktayken Tab, o durağın yanına bir konu asar. Konudayken Tab alt konu, Enter kardeş konu açar.",
      "Kutunun başındaki daire durumu değiştirir: Başlamadım → Devam ediyor → Bitti → Atlandı. Kutunun rengi de buna göre değişir.",
      "Kutuya sağ tıklayıp \"Ayrıntılar\" dersen sağda panel açılır: not, süre tahmini ve bağlantı buradan eklenir.",
      "Uzun haritaları bölmek için sağ tık menüsünden bölüm başlığı ekle (Başlangıç / Orta / İleri gibi).",
      "Bir konuyu seçmeli yaparsan kesik çizgiyle bağlanır ve ilerleme yüzdesine katılmaz.",
      "Sol üstteki ilerleme şeridindeki döndürme düğmesi hattı dikeyden yataya çevirir; uzun haritalar geniş ekranda böyle okunur."
    ],
    shortcuts: [
      { keys: ["Enter"], desc: "Hatta yeni durak" },
      { keys: ["Tab"], desc: "Seçili kutuya yan konu" },
      { keys: ["F2"], desc: "Seçili kutunun adını değiştir" },
      { keys: ["Delete"], desc: "Seçili kutuyu sil" },
      { keys: ["Shift", "Enter"], desc: "Yazarken alt satıra geç" },
      { keys: ["Esc"], desc: "Yazma alanını kapat" },
      { keys: ["Mod", "Z"], desc: "Geri al" },
      { keys: ["Mod", "Y"], desc: "İleri al" }
    ],
    tips: [
      "Kutular elle taşınmaz, dizilim otomatiktir. Bir durağın sırasını değiştirmek istersen sağ tık menüsündeki taşıma düğmelerini kullan.",
      "Yan konular duraktan durağa yön değiştirir; böylece harita tek yana şişmez.",
      "Atlanan kutular ilerlemede bitmiş sayılır: \"yapmayacağım\" dediğin bir konu yüzdeyi sonsuza kadar eksik bırakmasın.",
      "Süre alanına yazdığın saatler toplanır; üstteki şerit bitmemiş kutuların toplamını gösterir.",
      "Bağlantı eklerken adres http ya da https ile başlamalı; başka bir şey yazarsan kabul edilmez."
    ]
  }
};

export default kilavuzlar;
