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
    ],
    example: {
      title: 'Örnek: Şirket içi eğitim programı kurmak',
      intro:
        'İK ekibi yeni çalışanlar için bir eğitim programı kuracak. Nereden başlayacağı belli değil, o yüzden önce aklındaki her şeyi tek bir haritaya döküyor. Sıra ve öncelik sonraki iş.',
      blocks: [
        {
          heading: 'Kimler katılacak',
          items: [
            'Yeni işe girenler',
            'Takım liderleri',
            'Uzaktan çalışanlar',
            'Saha ekibi',
          ]
        },
        {
          heading: 'Ne öğretilecek',
          items: [
            'Ürün bilgisi',
            'Kullandığımız sistemler',
            'Müşteriyle konuşma',
            'Güvenlik kuralları',
          ]
        },
        {
          heading: 'Nasıl verilecek',
          items: [
            'Yüz yüze atölye',
            'Kayıtlı video',
            'Haftada bir kısa oturum',
            'Kıdemli biriyle eşleştirme',
          ]
        },
        {
          heading: 'Nasıl ölçeceğiz',
          items: [
            'Eğitim sonunda kısa sınav',
            'Üç ay sonra yönetici görüşü',
            'İşe alışma süresi',
            'Katılım oranı',
          ]
        },
      ],
      outcome:
        'Dört dal çıkınca eksik kendini gösteriyor: ölçme dalı diğerlerinin yanında zayıf kalmış. Ekip programı yazmaya başlamadan önce oraya dönüyor. Zihin haritasının işi zaten bu; hangi tarafın boş kaldığını göstermek.'
    },
    faq: [
      {
        q: 'Zihin haritası nedir?',
        a:
          'Tek bir konuyu merkeze koyup ondan dallanarak fikir toplama yöntemi. Sıralı liste tutmaya göre farkı şu: liste seni baştan sona düşünmeye zorlar, harita ise aklına ne geldiyse ilgili dala eklemene izin verir. Dağınık düşünceyi toparlamak için bu yüzden daha rahat.'
      },
      {
        q: 'Zihin haritası ile iş kırılım yapısı arasındaki fark ne?',
        a:
          'Zihin haritasında fikir toplarsın; sıra, tarih ve sorumlu yoktur. İş kırılım yapısında iş yönetirsin; her kutunun durumu, bitiş tarihi ve süresi vardır. Sıralama genelde şöyle işler: önce zihin haritasıyla dökersin, kapsam netleşince iş kırılımına geçersin.'
      },
      {
        q: 'Kutuları elle taşıyabilir miyim?',
        a:
          'Hayır, dizilimi program yapıyor. Bir dalı başka yere almak istersen sil ve doğru yerde yeniden aç. Bu bilerek böyle: kutu hizalamakla uğraşmak, düşünmekten çalınan zaman.'
      },
      {
        q: 'Bir haritada kaç dal olmalı?',
        a:
          'Sınır yok ama aynı seviyede yedi sekiz daldan fazlası okunmaz hale gelir. O noktaya geldiysen benzer dalları bir üst başlık altında toplamak haritayı yeniden okunur yapar.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Zihin haritasını denemek için hesap açman da gerekmiyor; doğrudan deneme ekranından çizmeye başlayabilirsin.'
      },
    ],
    seo: {
      name: 'Zihin haritası',
      title: 'Zihin haritası oluşturma — ücretsiz mind map | Klarsti',
      description:
        'Bir konuyu merkeze koy, dallandır ve dizilimi programa bırak. Fikir toplamak için ücretsiz zihin haritası aracı, örnekli anlatımla.',
      keywords: 'zihin haritası, zihin haritası oluşturma, mind map, akıl haritası, zihin haritası örneği'
    }
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
    ],
    example: {
      title: 'Örnek: Yeni bir kahve dükkânı açmak',
      intro:
        'Açılışa altı ay var. İş büyük görünüyor ve nereden tutulacağı belli değil. Üç faza bölünce her fazın altında somut, birinin sorumluluğuna verilebilecek iş paketleri çıkıyor.',
      blocks: [
        {
          heading: '1. Yer ve izinler',
          items: [
            'Üç semtte kira araştırması',
            'Kira sözleşmesi',
            'İşyeri açma ruhsatı',
            'Gıda üretim izni',
          ]
        },
        {
          heading: '2. Kurulum',
          items: [
            'Tadilat projesi',
            'Tadilat işi',
            'Kahve makinesi ve değirmen alımı',
            'Masa, sandalye, tezgâh',
          ]
        },
        {
          heading: '3. Açılış',
          items: [
            'İki barista işe alımı',
            'Menü ve fiyatlama',
            'Tedarikçi anlaşmaları',
            'Açılış duyurusu',
          ]
        },
      ],
      outcome:
        'On iki iş paketi çıktı. Kapsam artık sabit: bu ağaçta yazmayan iş projede de yok. Ruhsat ile tadilatın sırası da görünür oldu; ruhsat gecikirse tadilat da gecikir, o yüzden ilk faz kritik.'
    },
    faq: [
      {
        q: 'İş kırılım yapısı (WBS) nedir?',
        a:
          'Bir projeyi, her parçası tek bir kişiye verilebilecek kadar küçülene dek bölen ağaç. En üstte proje, altında fazlar, onların altında iş paketleri durur. Amacı işi küçültmek değil, kapsamı görünür kılmak: ağaçta olmayan iş projede de yoktur.'
      },
      {
        q: 'Kaç seviye olmalı?',
        a:
          'Üç seviye çoğu iş için yeter: proje, faz, iş paketi. Kural şudur — bir kutuya bakıp "bunu kim, ne kadar sürede yapar" sorusuna cevap verebiliyorsan bölmeyi bırakabilirsin. Veremiyorsan bir seviye daha in.'
      },
      {
        q: 'İş kırılım yapısı ile Gantt şeması arasındaki fark ne?',
        a:
          'İş kırılımı "ne yapılacak" sorusunu, Gantt "ne zaman yapılacak" sorusunu cevaplar. Doğru sıra önce kırılım, sonra takvim. Kırılım yapmadan çizilen Gantt şemasında yarısı unutulmuş bir iş listesi olur.'
      },
      {
        q: 'Bir iş paketi ne kadar büyük olmalı?',
        a:
          'Yaygın ölçü, tek bir kişinin bir ila iki haftada bitirebileceği büyüklük. Daha büyükse ilerlemesini takip edemezsin, daha küçükse ağaç gereksiz kalabalıklaşır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. İş kırılım ağacı çizmek için hesap açman gerekmiyor, deneme ekranından hemen başlayabilirsin.'
      },
    ],
    seo: {
      name: 'İş kırılım yapısı (WBS)',
      title: 'İş kırılım yapısı (WBS) oluşturma aracı | Klarsti',
      description:
        'Projeni fazlara ve iş paketlerine böl, her kutuya durum, tarih ve süre ver. Örnekli anlatım ve ücretsiz WBS aracı.',
      keywords: 'iş kırılım yapısı, wbs, iş kırılım yapısı örneği, iş kırılım yapısı nasıl yapılır, proje kırılım ağacı'
    }
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
    ],
    example: {
      title: 'Örnek: Sipariş e-postaları müşteriye gitmiyor',
      intro:
        'Destek ekibine üç gündür aynı şikâyet geliyor. İlk akla gelen çözüm "e-posta servisini değiştirelim" oluyor. Beş kez neden diye sorunca sorunun orada olmadığı çıkıyor.',
      blocks: [
        {
          heading: 'Problem',
          items: [
            'Müşteriler sipariş onay e-postasını almıyor.',
          ]
        },
        {
          heading: 'Neden zinciri',
          items: [
            '1. Neden? E-postalar spam klasörüne düşüyor.',
            '2. Neden? Gönderen alan adımız doğrulanmamış görünüyor.',
            '3. Neden? Alan adı kaydındaki doğrulama satırı eksik.',
            '4. Neden? Sunucu taşınırken o satır kopyalanmamış.',
            '5. Neden? Taşıma işinin kontrol listesinde böyle bir madde yok.',
          ]
        },
        {
          heading: 'Kök neden',
          items: [
            'Sunucu taşıma kontrol listesi eksik.',
          ]
        },
        {
          heading: 'Alınan önlem',
          items: [
            'Eksik satır eklendi (bugünkü sorun çözüldü).',
            'Taşıma kontrol listesine alan adı doğrulaması eklendi.',
            'Liste, taşımayı yapan kişiden bağımsız hale getirildi.',
          ]
        },
      ],
      outcome:
        'İlk akla gelen çözüm e-posta servisini değiştirmekti; para harcanacak, sorun yine çıkacaktı. Gerçek kök neden bir kontrol listesindeki eksik satırmış. Beş neden analizinin işi tam olarak bu farkı görünür kılmak.'
    },
    faq: [
      {
        q: '5 Neden analizi nedir?',
        a:
          'Bir problemin görünen yüzünden başlayıp arka arkaya "neden" diye sorarak asıl sebebe inme yöntemi. Toyota\'da geliştirildi. Amacı belirtiyi değil, belirtiyi üreten şeyi bulmak; böylece aynı sorun tekrar etmez.'
      },
      {
        q: 'Neden tam beş?',
        a:
          'Beş bir kural değil, bir alışkanlık. Pratikte çoğu problemde dördüncü ile altıncı soru arasında asıl sebebe iniliyor. Üçüncüde bulduysan durabilirsin; yedincide hâlâ bulamadıysan problemi yanlış tanımlamış olabilirsin.'
      },
      {
        q: 'Kök nedeni bulduğumu nasıl anlarım?',
        a:
          'İki işaret var. Birincisi, bir sonraki "neden" sorusunun cevabı artık senin kontrolünde olmayan bir şey oluyor. İkincisi, bulduğun sebebi ortadan kaldırdığında problemin tekrar etmeyeceğinden emin olabiliyorsun.'
      },
      {
        q: '5 Neden ile balık kılçığı arasındaki fark ne?',
        a:
          '5 Neden tek bir zinciri derinlemesine takip eder. Balık kılçığı ise aynı problemin farklı yönlerini (insan, yöntem, makine, malzeme, ölçüm, çevre) yan yana açar. Sebep tek bir yerde görünüyorsa 5 Neden, dağınıksa önce kılçık daha iyi çalışır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. 5 Neden analizini denemek için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: '5 Neden analizi',
      title: '5 Neden analizi — kök nedeni bul | Klarsti',
      description:
        'Beş kez neden diye sorarak problemin görünen yüzünden asıl sebebine in. Adım adım anlatım, gerçek bir örnek ve ücretsiz araç.',
      keywords: '5 neden analizi, 5 neden analizi örneği, kök neden analizi, 5 whys, neden neden analizi'
    }
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
      "İmleci bir kutunun üstüne getir: dört bağlantı noktasının hepsinde bir + çıkar. Birine bas, şekli seç; yeni kutu o yöne iner ve bağlantısı çizilmiş olur. Adını değiştirmek için kutuya çift tıkla, diğer seçenekler için sağ tıkla.",
      'Kutuları serbestçe sürükleyerek yerleştirirsin; burada otomatik dizilim yok, düzen sana ait.',
      "Bağlantı çizmek için bir kutunun herhangi bir noktasından diğerinin herhangi bir noktasına sürükle: yandan yana, üstten üste, hangi yönü istersen. Bağlı bir ucu değiştirmek için çizginin ucunu tutup başka bir noktaya bırak. Çizginin üstüne yazı yazmak için çizgiye çift tıkla (örneğin evet / hayır).",
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
    ],
    example: {
      title: 'Örnek: Gelen izin talebinin işlenmesi',
      intro:
        'İzin süreci herkesin kafasında farklı. Kim onaylıyor, ne zaman reddediliyor, İK ne zaman devreye giriyor belli değil. Süreci çizince tartışılacak yer tek bir kutuya iniyor.',
      blocks: [
        {
          heading: 'Adımlar',
          items: [
            'Başla: Çalışan izin talebi girer',
            'İşlem: Sistem kalan izin gününü hesaplar',
            'Karar: Yeterli izin günü var mı?',
            'Hayır → Talep reddedilir, çalışana sebep yazılır',
            'Evet → İşlem: Talep yöneticiye düşer',
          ]
        },
        {
          heading: 'Devamı',
          items: [
            'Karar: Yönetici onaylıyor mu?',
            'Hayır → Çalışana gerekçe döner, süreç biter',
            'Evet → İşlem: İK takvime işler',
            'İşlem: Ekip takvimine yansır',
            'Bitir: Çalışana onay bildirimi gider',
          ]
        },
      ],
      outcome:
        'Çizim bitince görülen şu oldu: reddedilen taleplerde çalışana gerekçe dönen bir adım hiç yokmuş. Süreç kafada dururken kimse fark etmiyordu, kutulara dökülünce boşluk kendini gösterdi.'
    },
    faq: [
      {
        q: 'Akış diyagramı nedir?',
        a:
          'Bir işin baştan sona hangi adımlardan geçtiğini, nerede karar verildiğini ve nerede yol ayrıldığını gösteren şema. Anlatarak açıklaması uzun süren süreçler, çizilince tek bakışta anlaşılır hale gelir.'
      },
      {
        q: 'Şekiller ne anlama geliyor?',
        a:
          'Yuvarlatılmış kutu başlangıç ve bitiş, dikdörtgen bir işlem, baklava dilimi ise karar noktasıdır. Karar kutusundan her zaman en az iki ok çıkar; genelde evet ve hayır. Bu ayrım, diyagramı okuyanın kafasında tek anlam bırakır.'
      },
      {
        q: 'Akış diyagramı ile süreç haritası aynı şey mi?',
        a:
          'Yakın ama aynı değil. Akış diyagramı adımların sırasını gösterir. Süreç haritası genelde daha geniştir; kimin hangi adımdan sorumlu olduğunu ve bölümler arası geçişleri de içerir.'
      },
      {
        q: 'Nereden başlamalıyım?',
        a:
          'Sondan. Sürecin hangi sonuçla bittiğini yaz, sonra geriye doğru "bunun olması için ondan önce ne olmalı" diye ilerle. Baştan başlamak, çoğu zaman gerçekte olmayan ideal bir süreç çizdirir.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Akış diyagramı çizmek için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Akış diyagramı',
      title: 'Akış diyagramı oluşturma aracı | Klarsti',
      description:
        'Sürecin adımlarını, karar noktalarını ve yol ayrımlarını çiz. Şekillerin anlamını anlatan örnekle birlikte ücretsiz araç.',
      keywords: 'akış diyagramı, akış şeması, akış diyagramı oluşturma, flowchart, akış diyagramı sembolleri'
    }
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
      "İmleci bir kutunun üstüne getir: dört bağlantı noktasının hepsinde bir + çıkar. Birine basıp pozisyon, birim, ekip ya da boş kadro seç; yeni kutu o yöne iner. Adı ve altındaki unvanı değiştirmek için kutuya çift tıkla.",
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
    ],
    example: {
      title: 'Örnek: 20 kişilik bir yazılım şirketi',
      intro:
        'Şirket iki yılda 6 kişiden 20 kişiye çıktı. Kimin kime bağlı olduğu sözlü olarak biliniyor ama yazılı bir yerde durmuyor. Yeni gelen herkes aynı soruları soruyor.',
      blocks: [
        {
          heading: 'Genel müdür',
          items: [
            'Ürün müdürü',
            'Teknoloji müdürü',
            'Satış müdürü',
            'İK ve finans sorumlusu',
          ]
        },
        {
          heading: 'Teknoloji müdürü altında',
          items: [
            'Arayüz ekibi (3 kişi)',
            'Sunucu ekibi (4 kişi)',
            'Test sorumlusu',
            'Sistem yöneticisi',
          ]
        },
        {
          heading: 'Ürün müdürü altında',
          items: [
            'Tasarımcı (2 kişi)',
            'Ürün analisti',
          ]
        },
        {
          heading: 'Satış müdürü altında',
          items: [
            'Saha satış (2 kişi)',
            'Müşteri destek (2 kişi)',
          ]
        },
      ],
      outcome:
        'Şema çizilince bir şey göze battı: test sorumlusu tek kişi ve doğrudan müdüre bağlı, yani izne çıktığında yerine bakacak kimse yok. Organizasyon şemasının en çok işe yaradığı yer burası; boşlukları isim isim gösteriyor.'
    },
    faq: [
      {
        q: 'Organizasyon şeması nedir?',
        a:
          'Bir kurumdaki kişilerin ve birimlerin birbirine nasıl bağlandığını gösteren şema. Kimin kime rapor verdiğini, hangi birimin nerede durduğunu tek sayfada okutur. Yeni katılan biri için en hızlı yol haritasıdır.'
      },
      {
        q: 'Şemaya isim mi yazmalı, unvan mı?',
        a:
          'İkisi birden en iyisi: unvan yapıyı, isim kimin sorumlu olduğunu anlatır. Yalnızca isim yazarsan biri ayrıldığında şema anlamsızlaşır; yalnızca unvan yazarsan kime gideceğini bilemezsin.'
      },
      {
        q: 'Kaç kişiye kadar tek şemada gösterilir?',
        a:
          'Elli kişiye kadar tek şema rahat okunur. Daha büyük kurumlarda üst seviyeyi ayrı, her birimi kendi içinde ayrı göstermek daha iyi çalışır; tek sayfaya sığdırmaya çalışmak okunmayan bir şema üretir.'
      },
      {
        q: 'Ne sıklıkla güncellenmeli?',
        a:
          'Her işe alım ve her ayrılıkta. Güncel olmayan bir organizasyon şeması, olmayan şemadan daha zararlı; insanlar yanlış kişiye gider.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Organizasyon şeması çizmek için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Organizasyon şeması',
      title: 'Organizasyon şeması oluşturma | Klarsti',
      description:
        'Kimin kime bağlı olduğunu tek sayfada göster, boş kalan rolleri gör. Yirmi kişilik gerçek bir örnekle, ücretsiz araç.',
      keywords: 'organizasyon şeması, organizasyon şeması oluşturma, org şeması, şirket organizasyon şeması, hiyerarşi şeması'
    }
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
    ],
    example: {
      title: 'Örnek: Küçük bir muhasebe ofisinin durumu',
      intro:
        'Beş kişilik bir muhasebe ofisi büyümek istiyor ama nereye yükleneceğini bilmiyor. Dört kutuyu doldurunca karar tartışması sezgiden çıkıp maddelere dayanıyor.',
      blocks: [
        {
          heading: 'Güçlü yanlar',
          items: [
            'On beş yıllık müşteri ilişkisi',
            'Müşteri kaybı neredeyse yok',
            'İki ortak da mali müşavir',
            'Borç yok',
          ]
        },
        {
          heading: 'Zayıf yanlar',
          items: [
            'Her iş iki ortağın üstünde',
            'Dijital süreç yok, her şey kâğıt',
            'Pazarlama yapılmıyor',
            'Yeni müşteri hep tavsiyeyle geliyor',
          ]
        },
        {
          heading: 'Fırsatlar',
          items: [
            'E-fatura zorunluluğu küçük işletmeleri arayışa itiyor',
            'Bölgede yeni açılan çok sayıda küçük işletme',
            'Uzaktan hizmet artık kabul görüyor',
            'Muhasebe yazılımları ucuzladı',
          ]
        },
        {
          heading: 'Tehditler',
          items: [
            'Ucuz online muhasebe hizmetleri',
            'Ortaklardan birinin emekliliği yaklaşıyor',
            'Mevzuat sık değişiyor',
            'Genç mali müşavir bulmak zor',
          ]
        },
      ],
      outcome:
        'Tablo şunu söylüyor: en büyük fırsat (e-fatura) tam da en büyük zayıflığın (dijital süreç yok) olduğu yerde duruyor. Karar netleşti — büyüme değil, önce kendi süreçlerini dijitalleştirme.'
    },
    faq: [
      {
        q: 'SWOT analizi nedir?',
        a:
          'Bir kurumun ya da kararın durumunu dört kutuda toplayan yöntem: güçlü yanlar, zayıf yanlar, fırsatlar ve tehditler. Güçlü ve zayıf yanlar senin içinde, fırsat ve tehditler dışarıdadır. Bu ayrım yönteme adını veren şey ve en çok karıştırılan yeri.'
      },
      {
        q: 'SWOT analizi nasıl yapılır?',
        a:
          'Önce neyin analizini yaptığını tek cümleyle yaz; "şirketimiz" gibi geniş bir konu işe yaramaz, "yeni şubeyi açmalı mıyız" işe yarar. Sonra dört kutuyu doldur. Son adım en önemlisi: kutuları eşleştir. Hangi güçlü yanın hangi fırsatı yakalar, hangi zayıflığın hangi tehdide açık bırakır.'
      },
      {
        q: 'Fırsat ile güçlü yanı nasıl ayırırım?',
        a:
          'Basit ölçü: senin kararınla değişebiliyorsa iç, değişemiyorsa dış. Ekibin deneyimli olması güçlü yan; sektörün büyümesi fırsat. Kutuları karıştırmak analizi kullanılamaz hale getirir.'
      },
      {
        q: 'Her kutuya kaç madde yazmalı?',
        a:
          'Üç ile altı arası iyi çalışır. Bir kutuya on beş madde yazmak analiz değil, dökümdür. Az sayıda ama gerçekten belirleyici maddeyi seçmek, kararın da kendiliğinden netleşmesini sağlar.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. SWOT analizi yapmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'SWOT analizi',
      title: 'SWOT analizi nasıl yapılır — ücretsiz SWOT aracı | Klarsti',
      description:
        'Güçlü ve zayıf yanlarını fırsat ve tehditlerle karşılaştır, dört kutuyu eşleştirip kararı netleştir. Doldurulmuş örnekle birlikte.',
      keywords: 'swot analizi, swot analizi nasıl yapılır, swot analizi örneği, güçlü zayıf yönler, fırsat tehdit analizi'
    }
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
    ],
    example: {
      title: 'Örnek: Üretimde fire oranı yükseldi',
      intro:
        'Bir mobilya atölyesinde hatalı çıkan ürün oranı iki ayda %3\'ten %9\'a çıktı. Tek bir sebep aramak yerine altı başlık altında bütün adaylar yan yana diziliyor.',
      blocks: [
        {
          heading: 'İnsan',
          items: [
            'İki deneyimli usta ayrıldı',
            'Yeni gelenlere eğitim verilmedi',
            'Vardiya değişiminde devir yapılmıyor',
          ]
        },
        {
          heading: 'Yöntem',
          items: [
            'Kesim ölçüleri yazılı değil',
            'Kalite kontrol sadece sonda yapılıyor',
          ]
        },
        {
          heading: 'Makine',
          items: [
            'Kesim testeresi altı aydır bakım görmedi',
            'Zımpara makinesinin ayarı kayıyor',
          ]
        },
        {
          heading: 'Malzeme',
          items: [
            'Tedarikçi değişti',
            'Yeni levhaların nem oranı ölçülmüyor',
          ]
        },
      ],
      outcome:
        'Kılçık dolunca iki başlığın diğerlerinden kalabalık olduğu görülüyor: insan ve malzeme. Ekip önce bu ikisine bakmaya karar veriyor. Kılçığın işi sebebi bulmak değil, aramaya nereden başlanacağını göstermek.'
    },
    faq: [
      {
        q: 'Balık kılçığı diyagramı nedir?',
        a:
          'Bir problemin olası sebeplerini kategorilere ayırıp yan yana gösteren şema. Şekli balık iskeletine benzediği için bu adı almış. Ishikawa diyagramı ya da sebep-sonuç diyagramı olarak da geçer.'
      },
      {
        q: '6M nedir?',
        a:
          'Kılçığın klasik altı kategorisi: İnsan, Yöntem, Makine, Malzeme, Ölçüm ve Çevre. Amaç hepsini doldurmak değil; aklın hep aynı yere gitmesin diye altı ayrı yöne bakmaya zorlamak. Hizmet işlerinde bu başlıkları değiştirmek serbesttir.'
      },
      {
        q: 'Balık kılçığı ile 5 Neden birlikte kullanılır mı?',
        a:
          'Evet, en verimli kullanım şekli bu. Önce kılçıkla olası sebepleri yayarsın, en güçlü görünen dalı seçersin, sonra o dalın üstünde 5 Neden ile derine inersin. Biri genişlik, diğeri derinlik verir.'
      },
      {
        q: 'Kılçık sebebi bulur mu?',
        a:
          'Doğrudan bulmaz, aday çıkarır. Diyagram bittiğinde elinde kanıtlanmış bir sebep değil, sınanacak bir liste olur. Sonraki adım o adayları veriyle test etmektir; Pareto analizi burada iyi eşlik eder.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Balık kılçığı diyagramı çizmek için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Balık kılçığı (Ishikawa) diyagramı',
      title: 'Balık kılçığı diyagramı oluşturma — Ishikawa | Klarsti',
      description:
        'Problemin olası sebeplerini insan, yöntem, makine, malzeme başlıklarına ayır ve nereden başlayacağını gör. Örnekli ücretsiz araç.',
      keywords: 'balık kılçığı diyagramı, ishikawa diyagramı, sebep sonuç diyagramı, balık kılçığı örneği, 6m analizi'
    }
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
    ],
    example: {
      title: 'Örnek: Destek taleplerine cevap süresini kısaltmak',
      intro:
        'Müşteri destek ekibi taleplere ortalama 14 saatte dönüyor. Hedef 4 saat. Ekip büyütmeden önce tek bir döngü deneniyor.',
      blocks: [
        {
          heading: 'Planla',
          items: [
            'Hedef: ortalama ilk cevap süresi 4 saatin altına insin',
            'Varsayım: talepler sabah birikiyor, kimse sahiplenmiyor',
            'Deneme: sabah 09.00-11.00 arası bir kişi nöbetçi olsun',
            'Süre: iki hafta',
          ]
        },
        {
          heading: 'Uygula',
          items: [
            'Nöbet sırası paylaşıldı',
            'Nöbetçi o iki saat başka işe alınmadı',
            'Her talebin ilk cevap saati kaydedildi',
          ]
        },
        {
          heading: 'Kontrol et',
          items: [
            'Ortalama süre 14 saatten 5 saate indi',
            'Sabah gelen taleplerde 2 saate indi',
            'Akşam gelenlerde değişmedi',
            'Nöbetçinin kendi işi aksadı',
          ]
        },
        {
          heading: 'Önlem al',
          items: [
            'Sabah nöbeti kalıcı hale getirildi',
            'Nöbetçinin o günkü iş yükü azaltıldı',
            'Akşam saatleri için yeni bir döngü açıldı',
          ]
        },
      ],
      outcome:
        'Tek döngüde süre üçte bire indi ve yeni bir soru çıktı: akşam gelen talepler. PUKÖ\'nün mantığı bu; bir döngü biterken bir sonrakinin konusunu kendisi veriyor.'
    },
    faq: [
      {
        q: 'PUKÖ (PDCA) döngüsü nedir?',
        a:
          'Sürekli iyileştirme için dört adımlı bir çevrim: Planla, Uygula, Kontrol Et, Önlem Al. Deming döngüsü olarak da bilinir. Fikri şu: büyük değişiklikleri tek seferde yapmak yerine, küçük denemeler yapıp sonucunu ölçerek ilerlemek.'
      },
      {
        q: 'Bir döngü ne kadar sürmeli?',
        a:
          'Sonucu ölçebileceğin en kısa süre. Çoğu ofis işi için bir ile dört hafta arası iyi çalışır. Altı aylık bir döngü döngü değildir; sonucu görene kadar koşullar değişmiş olur ve neyin işe yaradığını anlayamazsın.'
      },
      {
        q: 'Kontrol adımında ne ölçülür?',
        a:
          'Plan adımında yazdığın şey. Bu yüzden plan yaparken hedefi sayıyla yazmak şart: "daha hızlı cevap verelim" ölçülemez, "ortalama ilk cevap 4 saatin altına insin" ölçülür. Ölçüyü baştan yazmazsan kontrol adımı yoruma dönüşür.'
      },
      {
        q: 'Deneme başarısız olursa ne yapılır?',
        a:
          'Başarısız döngü de sonuçtur, atılmaz. Önlem Al adımında varsayımın neden tutmadığını yazarsın ve bir sonraki döngü o bilgiyle başlar. PUKÖ\'de asıl kayıp, sonucu kaydetmeden yeni bir şey denemektir.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. PUKÖ döngüsü kurmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'PUKÖ (PDCA) döngüsü',
      title: 'PUKÖ döngüsü (PDCA) — sürekli iyileştirme | Klarsti',
      description:
        'Planla, Uygula, Kontrol Et, Önlem Al adımlarıyla küçük denemeler yap ve sonucunu ölç. Gerçek bir döngü örneğiyle, ücretsiz.',
      keywords: 'pukö döngüsü, pdca, planla uygula kontrol et önlem al, sürekli iyileştirme, deming döngüsü'
    }
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
    ],
    example: {
      title: 'Örnek: Bir bankaya rapor modülü teslimi',
      intro:
        'Kapsamı sözleşmeyle sabitlenmiş, teslim tarihi belli bir iş. Müşteri her aşamanın sonunda yazılı onay veriyor. Bu tür işlerde aşamalar sırayla ilerliyor.',
      blocks: [
        {
          heading: 'Gereksinim',
          items: [
            'Rapor türleri listelendi',
            'Yetki kuralları yazıldı',
            'Müşteri onayı alındı',
          ]
        },
        {
          heading: 'Tasarım',
          items: [
            'Veri modeli çıkarıldı',
            'Ekran taslakları hazırlandı',
            'Performans sınırları belirlendi',
          ]
        },
        {
          heading: 'Geliştirme',
          items: [
            'Rapor motoru yazıldı',
            'Yetkilendirme eklendi',
            'Dışa aktarma yazıldı',
          ]
        },
        {
          heading: 'Test ve teslim',
          items: [
            'İç testler',
            'Müşteri kabul testi',
            'Canlıya alma',
            'Kullanıcı eğitimi',
          ]
        },
      ],
      outcome:
        'Şelale modelinin gücü de zayıflığı da burada görünüyor: kapsam baştan sabit olduğu için ilerleme net ölçülüyor, ama geliştirme aşamasında çıkan bir gereksinim değişikliği bütün planı geriye sarıyor.'
    },
    faq: [
      {
        q: 'Şelale modeli nedir?',
        a:
          'Projeyi birbirini izleyen aşamalara bölen ve her aşama bitmeden diğerine geçmeyen yöntem: gereksinim, tasarım, geliştirme, test, teslim. Adı, suyun basamaklardan aşağı akmasına benzediği için verilmiş.'
      },
      {
        q: 'Şelale mi çevik mi kullanmalıyım?',
        a:
          'Kapsam baştan belli ve değişmesi beklenmiyorsa şelale daha az yönetim yükü getirir; inşaat, mevzuat işleri, sözleşmeli teslimler böyledir. Kapsamın yol boyunca netleşeceği işlerde şelale pahalıya patlar, orada çevik yöntemler daha uygundur.'
      },
      {
        q: 'Bir aşamaya geri dönülebilir mi?',
        a:
          'Dönülebilir ama bedeli vardır ve modelin mantığı bunu istemez. Geriye dönüş sıklaşıyorsa bu, kapsamın baştan yeterince netleşmediğinin işaretidir; asıl soru o zaman modelin doğru seçilip seçilmediğidir.'
      },
      {
        q: 'Aşamalar arasında ne yapılır?',
        a:
          'Her aşamanın sonunda bir çıktı ve bir onay olur. Onay yazılı olmalı: şelalenin bütün güvencesi, bir aşamanın kapandığına iki tarafın da aynı anda karar vermiş olmasına dayanır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Şelale modeliyle proje yönetmek için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Şelale modeli',
      title: 'Şelale modeli ile proje yönetimi | Klarsti',
      description:
        'Gereksinim, tasarım, geliştirme, test ve teslim aşamalarını sırayla yürüt. Şelale ile çevik arasındaki farkı anlatan örnekle.',
      keywords: 'şelale modeli, waterfall model, şelale modeli aşamaları, proje yönetimi modelleri, şelale mi çevik mi'
    }
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
    ],
    example: {
      title: 'Örnek: Soğuk hava deposunun sıcaklığı yükseldi',
      intro:
        'Bir gıda deposunda sıcaklık iki saat boyunca sınırın üstünde kaldı ve ürün imha edildi. Tepe olay yazılıp altına mantık kapılarıyla iniliyor; hangi arızaların birlikte olması gerektiği böyle görünüyor.',
      blocks: [
        {
          heading: 'Tepe olay',
          items: [
            'Depo sıcaklığı iki saat sınırın üstünde kaldı',
          ]
        },
        {
          heading: 'VEYA kapısı — biri yeterli',
          items: [
            'Soğutma durdu',
            'Isı içeri girdi',
            'Alarm çalışmadı ve kimse fark etmedi',
          ]
        },
        {
          heading: '"Soğutma durdu" altında (VEYA)',
          items: [
            'Kompresör arızası',
            'Elektrik kesintisi',
            'Termostat ayarı yanlış',
          ]
        },
        {
          heading: '"Alarm çalışmadı" altında (VE)',
          items: [
            'Sensör bozuk',
            'Yedek sensör hiç takılmamış',
            'Uzaktan bildirim kapalıydı',
          ]
        },
      ],
      outcome:
        'Ağaç şunu gösteriyor: soğutmanın durması tek başına imhaya yetmiyor, alarmın da susması gerekiyor. Yani en ucuz önlem kompresörü yenilemek değil, yedek sensörü takmak. Hata ağacının parayı doğru yere yönlendirdiği nokta burası.'
    },
    faq: [
      {
        q: 'Hata ağacı analizi (FTA) nedir?',
        a:
          'İstenmeyen bir olayı en üste koyup, onun oluşması için hangi arızaların bir arada gerekli olduğunu mantık kapılarıyla aşağı doğru çözen yöntem. Havacılık ve nükleer sektörde doğdu, bugün her türlü güvenlik ve süreç analizinde kullanılıyor.'
      },
      {
        q: 'VE kapısı ile VEYA kapısı arasındaki fark ne?',
        a:
          'VEYA kapısında alttakilerden herhangi biri olursa üstteki olay gerçekleşir. VE kapısında ise hepsinin aynı anda olması gerekir. Bu ayrım analizin can damarı: VE kapıları, sistemin kendini koruduğu yerleri gösterir.'
      },
      {
        q: 'Hata ağacı ile 5 Neden arasındaki fark ne?',
        a:
          '5 Neden olmuş bir olayın tek zincirini geriye doğru takip eder. Hata ağacı ise henüz olmamış bir olayın bütün oluş yollarını birden çıkarır. Biri geçmişe, diğeri geleceğe bakar.'
      },
      {
        q: 'Nereye kadar inmeliyim?',
        a:
          'Artık daha fazla bölemeyeceğin, doğrudan üstüne önlem alabileceğin olaylara kadar. "Sensör bozuk" yeterince alt seviyedir; çünkü buna karşı bir önlem yazabilirsin. "Sistem çalışmıyor" değildir.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Hata ağacı analizi yapmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Hata ağacı analizi (FTA)',
      title: 'Hata ağacı analizi (FTA) aracı | Klarsti',
      description:
        'İstenmeyen olayı en üste koy, VE/VEYA kapılarıyla hangi arızaların birlikte gerektiğini çöz. Örnekli, ücretsiz hata ağacı aracı.',
      keywords: 'hata ağacı analizi, fta analizi, hata ağacı örneği, ve veya kapısı, arıza ağacı analizi'
    }
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
    ],
    example: {
      title: 'Örnek: Sipariş alındıktan sonra ürünün sevk edilmesi',
      intro:
        'Bir üretici, siparişin gelmesiyle kamyona yüklenmesi arasındaki süreyi ölçüyor. Her adımın gerçek işlem süresi ile aradaki bekleme süresi ayrı yazılıyor. Fark ortaya çıkınca tablo değişiyor.',
      blocks: [
        {
          heading: 'Adımlar ve işlem süresi',
          items: [
            'Sipariş girişi — 10 dakika',
            'Kredi kontrolü — 15 dakika',
            'Üretim planına alma — 30 dakika',
            'Üretim — 4 saat',
            'Kalite kontrol — 20 dakika',
            'Paketleme ve sevk — 40 dakika',
          ]
        },
        {
          heading: 'Adımlar arası bekleme',
          items: [
            'Sipariş girişi sonrası — 1 gün',
            'Kredi kontrolü sonrası — 2 gün',
            'Plana alındıktan sonra — 3 gün',
            'Üretim sonrası — 1 gün',
            'Kalite sonrası — 2 gün',
          ]
        },
      ],
      outcome:
        'Toplam işlem süresi yaklaşık 6 saat, toplam süreç ise 9 gün. Yani zamanın %99\'u beklemeyle geçiyor. En uzun bekleme, üretim planına alındıktan sonraki 3 gün. Değer akışı haritasının cevabı net: üretimi hızlandırmaya çalışmak boşuna, kuyruk düzeltilmeli.'
    },
    faq: [
      {
        q: 'Değer akışı haritası (VSM) nedir?',
        a:
          'Bir ürünün veya talebin baştan sona geçtiği bütün adımları, her adımın süresiyle ve aralardaki beklemelerle birlikte gösteren harita. Yalın üretimden çıktı. Amacı hızlanmak değil, zamanın nerede kaybolduğunu göstermek.'
      },
      {
        q: 'Değer katan ve katmayan adım ne demek?',
        a:
          'Müşterinin parasını ödemeye razı olduğu her şey değer katar; ürünü gerçekten değiştiren adımlar böyledir. Beklemeler, taşımalar, tekrar eden kontroller değer katmaz. Çoğu süreçte toplam sürenin %90\'dan fazlası değer katmayan kısımdır.'
      },
      {
        q: 'Değer akışı haritası ile akış diyagramı arasındaki fark ne?',
        a:
          'Akış diyagramı adımların sırasını ve karar noktalarını gösterir, süre yoktur. Değer akışı haritasının bütün mesele süredir: her adımın işlem süresi ile aradaki bekleme ayrı ayrı yazılır ve ikisi karşılaştırılır.'
      },
      {
        q: 'Nereden başlamalıyım?',
        a:
          'Mevcut durumu olduğu gibi çizmekten. En sık yapılan hata, süreci olması gerektiği gibi çizmek. Harita gerçeği göstermezse iyileştirme de olmayan bir sürece yapılır. Gerçek süreleri sahada ölçmek şart.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Değer akışı haritası çıkarmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Değer akışı haritası (VSM)',
      title: 'Değer akışı haritası (VSM) aracı | Klarsti',
      description:
        'Her adımın işlem süresini aradaki beklemeyle karşılaştır, zamanın nerede kaybolduğunu gör. Sayılı bir örnekle, ücretsiz.',
      keywords: 'değer akışı haritası, vsm, değer akışı haritalama, yalın üretim, değer akışı örneği'
    }
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
    ],
    example: {
      title: 'Örnek: Müşteri şikâyetlerinin dağılımı',
      intro:
        'Bir e-ticaret sitesi üç ayda 480 şikâyet aldı. Ekip her şikâyet türü için ayrı çözüm tartışıyordu. Şikâyetler sayılıp büyükten küçüğe dizilince tablo değişiyor.',
      blocks: [
        {
          heading: 'Şikâyet türü ve adedi',
          items: [
            'Kargo geç geldi — 196',
            'Ürün açıklamadan farklı — 121',
            'İade süreci uzun — 62',
            'Kargo hasarlı geldi — 48',
            'Yanlış ürün gönderildi — 29',
            'Diğer — 24',
          ]
        },
        {
          heading: 'Birikimli oran',
          items: [
            'Kargo geç geldi — %41',
            '+ Ürün açıklamadan farklı — %66',
            '+ İade süreci uzun — %79',
            '+ Kargo hasarlı — %89',
            'Geri kalan üç kalem — %100',
          ]
        },
      ],
      outcome:
        'İlk iki kalem şikâyetlerin üçte ikisini oluşturuyor. Altı sorunu birden çözmeye çalışmak yerine kargo süresi ve ürün açıklamaları düzeltilirse müşteri memnuniyetsizliğinin %66\'sı ortadan kalkar. Pareto\'nun tek işi bu sırayı görünür kılmak.'
    },
    faq: [
      {
        q: 'Pareto analizi nedir?',
        a:
          'Sorunları görülme sıklığına göre büyükten küçüğe sıralayıp, hangilerinin toplamın büyük kısmını oluşturduğunu gösteren yöntem. Dayandığı gözlem şu: sonuçların yaklaşık %80\'i, sebeplerin yaklaşık %20\'sinden gelir.'
      },
      {
        q: '80/20 kuralı her zaman tutar mı?',
        a:
          'Tam olarak tutmaz, tutması da gerekmez. Bazen 70/30, bazen 90/10 çıkar. Önemli olan oranın kendisi değil, dağılımın dengesiz olması: birkaç kalem toplamın büyük kısmını taşıyorsa Pareto analizi işe yarar.'
      },
      {
        q: 'Neye göre sıralamalıyım — adede mi maliyete mi?',
        a:
          'Kararına göre. Adet sıralaması hangi sorunun en sık yaşandığını, maliyet sıralaması hangisinin en pahalıya patladığını gösterir. İkisi çoğu zaman farklı çıkar; nadir ama pahalı bir sorun adet listesinde en altta kalır.'
      },
      {
        q: 'Pareto analizi kaç kategoriyle yapılır?',
        a:
          'Beş ile on kategori en okunur sonucu verir. Otuz kategoriyle yapılan analiz yine bir liste olur ve odak sağlamaz. Az sayıda, birbirinden gerçekten ayrı kategori seçmek analizin yarısıdır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Pareto analizi yapmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Pareto analizi',
      title: 'Pareto analizi ve 80/20 grafiği | Klarsti',
      description:
        'Sorunları sıklığa göre sırala, birikimli eğriyi gör ve problemin büyük kısmını üreten birkaç sebebi bul. Örnekli ücretsiz araç.',
      keywords: 'pareto analizi, pareto grafiği, 80 20 kuralı, pareto analizi örneği, pareto diyagramı'
    }
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
    ],
    example: {
      title: 'Örnek: Kargo teslim süreleri',
      intro:
        'Ortalama teslim süresi 3 gün olarak raporlanıyor ve iyi görünüyor. Ama müşteri şikâyetleri sürüyor. Süreler tek tek gruplanınca ortalamanın sakladığı şey ortaya çıkıyor.',
      blocks: [
        {
          heading: 'Teslim süresi dağılımı (500 sipariş)',
          items: [
            '1 gün — 140 sipariş',
            '2 gün — 165 sipariş',
            '3 gün — 95 sipariş',
            '4 gün — 30 sipariş',
            '5 gün — 12 sipariş',
            '6 gün ve üzeri — 58 sipariş',
          ]
        },
        {
          heading: 'Okuma',
          items: [
            'Siparişlerin %60\'ı iki günde teslim ediliyor',
            'Küçük ama belirgin bir küme 6 gün ve üzerinde',
            'Dağılım tek tepeli değil, iki ayrı grup var',
            'Ortalama olan 3 gün aslında en az görülen değerlerden biri',
          ]
        },
      ],
      outcome:
        'Ortalama 3 gün diyor ama gerçekte iki farklı müşteri deneyimi var: çoğu iki günde alıyor, bir kısmı bir haftayı buluyor. İki tepeli dağılım her zaman aynı şeyi söyler — burada tek bir süreç değil, iki farklı süreç çalışıyor. Sonraki soru: o 58 sipariş hangi bölgeye ya da hangi depoya ait?'
    },
    faq: [
      {
        q: 'Histogram nedir?',
        a:
          'Ölçüm değerlerini aralıklara bölüp her aralığa kaç ölçüm düştüğünü çubuklarla gösteren grafik. Ortalamanın gizlediği şeyi görünür kılar: değerlerin nasıl dağıldığını.'
      },
      {
        q: 'Histogram ile çubuk grafik arasındaki fark ne?',
        a:
          'Çubuk grafikte kategoriler vardır ve sıraları değiştirilebilir; şehirler, ürünler gibi. Histogramda ise sayısal bir eksen vardır ve sıra sabittir, çubuklar bitişik çizilir. Farkı yaratan şey verinin türü.'
      },
      {
        q: 'Kaç aralık kullanmalıyım?',
        a:
          'Yaygın başlangıç noktası, veri sayısının kareköküne yakın bir aralık sayısıdır; 100 ölçüm için 10 civarı. Çok az aralık dağılımın şeklini siler, çok fazlası ise gürültüyü şekil sanmana yol açar. Birkaç değeri deneyip şeklin kararlı kaldığını görmek en pratik yol.'
      },
      {
        q: 'İki tepeli histogram ne anlama gelir?',
        a:
          'Neredeyse her zaman verinin tek bir süreçten gelmediğini. İki vardiya, iki makine, iki bölge gibi. Böyle bir şekil gördüğünde yapılacak ilk iş veriyi ikiye ayırıp ayrı ayrı bakmaktır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Histogram çıkarmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Histogram',
      title: 'Histogram oluşturma — verinin dağılımını gör | Klarsti',
      description:
        'Ölçümlerini aralıklara böl, ortalamanın sakladığı dağılımı gör. İki tepeli dağılımı okumayı anlatan örnekle birlikte, ücretsiz.',
      keywords: 'histogram, histogram oluşturma, histogram nedir, dağılım grafiği, histogram örneği'
    }
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
    ],
    example: {
      title: 'Örnek: Hangi depoyu kiralamalıyız?',
      intro:
        'Üç depo adayı var ve herkesin favorisi başka. Tartışma "bence" üzerinden dönüyor. Kriterler ağırlıklandırılıp her aday 1-10 arası puanlanınca tartışma sayıya iniyor.',
      blocks: [
        {
          heading: 'Kriterler ve ağırlık',
          items: [
            'Aylık maliyet — ağırlık 5',
            'Müşterilere yakınlık — ağırlık 4',
            'Genişleme imkânı — ağırlık 3',
            'Yola ve limana erişim — ağırlık 3',
            'Taşınma zorluğu — ağırlık 1',
          ]
        },
        {
          heading: 'Puanlar (1-10)',
          items: [
            'A Deposu: 8 / 4 / 6 / 5 / 7',
            'B Deposu: 5 / 9 / 4 / 8 / 5',
            'C Deposu: 6 / 7 / 9 / 6 / 3',
          ]
        },
        {
          heading: 'Ağırlıklı toplam',
          items: [
            'A Deposu — 100',
            'B Deposu — 114',
            'C Deposu — 114',
          ]
        },
      ],
      outcome:
        'A elendi. B ve C berabere çıktı, yani matris kararı vermedi — ama tartışmayı beş kriterden ikiye indirdi. Şimdi tek soru kaldı: yakınlık mı, genişleme imkânı mı? Karar matrisinin gerçek faydası çoğu zaman budur; seçmez, seçimi daraltır.'
    },
    faq: [
      {
        q: 'Karar matrisi nedir?',
        a:
          'Birkaç seçeneği aynı kriterler üzerinden puanlayıp, kriterlerin önem ağırlığıyla çarparak karşılaştıran tablo. Amacı kararı otomatikleştirmek değil, kararın hangi varsayımlara dayandığını görünür kılmak.'
      },
      {
        q: 'Ağırlıkları nasıl belirlemeliyim?',
        a:
          'Puanlamadan önce ve seçeneklere bakmadan. Sıra tersine dönerse insan farkında olmadan istediği seçenek kazansın diye ağırlık ayarlar. Ağırlıkları önce yazıp kilitlemek, matrisin işe yaramasının tek şartıdır.'
      },
      {
        q: 'Sonuç istediğim seçeneği göstermezse ne yapmalıyım?',
        a:
          'Bu aslında matrisin en değerli anı. İki ihtimal var: ya bir kriteri yanlış ağırlıklandırdın, ya da tabloya girmemiş bir kriter var. İkisi de sayıyı değiştirmekle değil, eksik kriteri yazmakla düzeltilir.'
      },
      {
        q: 'Kaç kriter kullanmalıyım?',
        a:
          'Dört ile yedi arası iyi çalışır. Üçün altında karar zaten sezgiyle verilebilir; onun üstünde ağırlıklar birbirine yaklaşır ve toplam puanlar anlamsızca birbirine yapışır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Karar matrisi kurmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Karar matrisi',
      title: 'Karar matrisi — ağırlıklı puanlama ile seçim | Klarsti',
      description:
        'Seçenekleri aynı kriterlerle puanla, kriterlere ağırlık ver ve kararın hangi varsayıma dayandığını gör. Örnekli ücretsiz araç.',
      keywords: 'karar matrisi, ağırlıklı puanlama, karar verme matrisi, karar matrisi örneği, seçenek karşılaştırma'
    }
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
    ],
    example: {
      title: 'Örnek: Yoğun bir salı günü',
      intro:
        'Gün üç toplantı, bir teslim ve arada kalan işlerle dolu. Sabah beş dakika ayırıp günü yazmak, akşam neyin yapılıp neyin yapılmadığını tartışmaya bırakmıyor.',
      blocks: [
        {
          heading: 'Bugün mutlaka',
          items: [
            'Müşteri sunumunu bitir (14.00 toplantısı öncesi)',
            'Fatura onaylarını gönder',
            'Yeni gelen arkadaşın erişimlerini aç',
          ]
        },
        {
          heading: 'Olursa iyi olur',
          items: [
            'Geçen haftanın raporunu oku',
            'Tedarikçiyi ara',
            'Masaüstündeki dosyaları topla',
          ]
        },
        {
          heading: 'Gün sonu değerlendirmesi',
          items: [
            'Sunum bitti ama 13.50\'de bitti, tekrar olmasın',
            'Fatura onayları unutuldu — sabaha ilk iş',
            'Öğleden sonra iki saat kesintisiz çalışabildim',
            'Yarın toplantıları öğleden sonraya toplayacağım',
          ]
        },
      ],
      outcome:
        'Asıl fayda listede değil, gün sonu değerlendirmesinde. Bir hafta üst üste yazınca aynı satırın tekrar ettiği görülüyor: işler toplantı aralarına sıkışıyor. O fark edilmeden düzeltilemiyor.'
    },
    faq: [
      {
        q: 'Ajanda ne işe yarıyor?',
        a:
          'Günü baştan yazmak ve akşam üstünden geçmek için. İki bölümü var: o günün planı ve gün sonu değerlendirmesi. İkincisi olmadan ajanda yapılacaklar listesine dönüşür; asıl değeri, aynı hatanın tekrar ettiğini görmende.'
      },
      {
        q: 'Ajandama başkaları erişebilir mi?',
        a:
          'Hayır. Ajanda ve gün sonu değerlendirmesi tamamen kişiseldir; projelerin içinde durmaz, senin kendi kaydında tutulur. Bir projeyi ekibinle paylaştığında ajandan paylaşıma dahil olmaz.'
      },
      {
        q: 'Günde kaç madde yazmalıyım?',
        a:
          'Mutlaka yapılacaklar üçü geçmesin. Onu geçen listeler gün sonunda hep yarım kalır ve bir süre sonra listeye bakmayı bırakırsın. Geri kalan işler ikinci gruba yazılır; olursa iyi olur, olmazsa gün başarısız sayılmaz.'
      },
      {
        q: 'Gün sonu değerlendirmesine ne yazmalıyım?',
        a:
          'Ne yaptığını değil, ne fark ettiğini. "Sunumu bitirdim" bilgi taşımıyor; "sunum son dakikaya kaldı çünkü sabahki toplantı uzadı" bir sonraki hafta işine yarar.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız.'
      },
    ],
    seo: {
      name: 'Ajanda',
      title: 'Günlük ajanda ve gün sonu değerlendirmesi | Klarsti',
      description:
        'Günü sabah yaz, akşam üstünden geç. Ajandan tamamen kişiseldir, proje paylaşımına dahil olmaz. Ücretsiz.',
      keywords: 'günlük ajanda, gün sonu değerlendirmesi, günlük plan, yapılacaklar listesi, günlük planlayıcı'
    }
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
    ],
    example: {
      title: 'Örnek: Bir web sitesi yenileme işi',
      intro:
        'İş sekiz haftaya sığacak. Kim ne zaman başlayacak ve hangi iş hangisini bekliyor belli değil. İşler takvime dizilince çakışmalar görünür oluyor.',
      blocks: [
        {
          heading: 'İşler ve haftalar',
          items: [
            'İçerik envanteri — 1. hafta',
            'Tasarım — 2. ve 3. hafta',
            'Metin yazımı — 2. haftadan 5. haftaya',
            'Geliştirme — 4. haftadan 7. haftaya',
            'İçerik girişi — 6. ve 7. hafta',
            'Test ve yayına alma — 8. hafta',
          ]
        },
        {
          heading: 'Çıkan sorular',
          items: [
            'Geliştirme 4. haftada başlıyor ama tasarım 3. hafta bitiyor: bir hafta pay yok',
            'İçerik girişi metin yazımını bekliyor, o da 5. haftada bitiyor: sıkışık',
            'Test için tek hafta var, hata çıkarsa yayın kayar',
            'Metin yazımı ile tasarım aynı kişiye mi bakıyor?',
          ]
        },
      ],
      outcome:
        'Şema bittiğinde plan değil, planın riskleri görünür oldu. Sekiz hafta kâğıt üstünde yetiyor ama hiçbir yerde pay yok. Gantt şemasının işi süre uydurmak değil, payın nerede olmadığını göstermek.'
    },
    faq: [
      {
        q: 'Gantt şeması nedir?',
        a:
          'İşleri yatay çubuklar halinde takvim üzerine yerleştiren şema. Her çubuğun uzunluğu işin süresini, konumu ise ne zaman yapılacağını gösterir. Hangi işlerin aynı anda yürüdüğü tek bakışta görülür.'
      },
      {
        q: 'Gantt şeması nasıl hazırlanır?',
        a:
          'Önce işleri çıkar, sonra takvime yerleştir. Doğru sıra şu: iş kırılım yapısı ile işleri belirle, her birine süre ver, bağımlılıkları yaz, ondan sonra çiz. Kırılım yapmadan çizilen Gantt şeması eksik bir listeyi güzel göstermekten öteye gitmez.'
      },
      {
        q: 'Bağımlılık ne demek?',
        a:
          'Bir işin başlaması için başka bir işin bitmesi gerekiyorsa aralarında bağımlılık vardır. Gantt şemasında bunlar zincir oluşturur; en uzun zincir projenin gerçek süresini belirler ve o zincirdeki her gecikme doğrudan teslim tarihine yansır.'
      },
      {
        q: 'Gantt şeması ile yol haritası arasındaki fark ne?',
        a:
          'Gantt şeması işleri gün ve hafta düzeyinde takvime bağlar, ekibin içindir. Yol haritası ise daha kaba, çeyrek ya da ay düzeyindedir ve niyeti anlatır; genelde ekip dışına, yönetime veya müşteriye gösterilir.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Gantt şeması çizmek için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Gantt şeması',
      title: 'Gantt şeması oluşturma — proje takvimi | Klarsti',
      description:
        'İşleri takvime diz, hangilerinin aynı anda yürüdüğünü ve payın nerede olmadığını gör. Sekiz haftalık örnekle, ücretsiz.',
      keywords: 'gantt şeması, gantt chart, gantt şeması oluşturma, proje takvimi, gantt şeması örneği'
    }
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
    ],
    example: {
      title: 'Örnek: Bir mobil uygulamanın altı aylık yol haritası',
      intro:
        'Ekip her hafta yeni bir fikirle sapıyor ve yönetim ne zaman ne çıkacağını bilmiyor. Altı ay, kabaca üç durağa bölünüyor. Amaç tarih vermek değil, sıraya bağlamak.',
      blocks: [
        {
          heading: '1. Durak — Temeli sağlamlaştır',
          items: [
            'Açılış hızını yarıya indir',
            'Çöken ekranları kapat',
            'Kayıt akışını sadeleştir',
          ]
        },
        {
          heading: '2. Durak — Elde tut',
          items: [
            'Bildirim ayarları',
            'Çevrimdışı çalışma',
            'Geri bildirim kutusu',
          ]
        },
        {
          heading: '3. Durak — Büyüt',
          items: [
            'Arkadaş davet etme',
            'İkinci dil desteği',
            'Ücretli plan altyapısı',
          ]
        },
        {
          heading: 'Bilerek dışarıda bıraktıklarımız',
          items: [
            'Tablet arayüzü',
            'Masaüstü sürümü',
            'Yapay zekâ özellikleri',
          ]
        },
      ],
      outcome:
        'Yol haritasının en çok işe yarayan kutusu sonuncusu. Neyin yapılacağını yazmak tartışmayı bitirmiyor; neyin bu dönem yapılmayacağını yazmak bitiriyor.'
    },
    faq: [
      {
        q: 'Yol haritası nedir?',
        a:
          'Bir ürünün ya da işin önümüzdeki dönemde hangi sırayla nereye gideceğini gösteren üst seviye plan. Gün gün iş listesi değildir; niyeti ve sırayı anlatır.'
      },
      {
        q: 'Yol haritasına tarih yazmalı mıyım?',
        a:
          'Kesin gün yazmak çoğu zaman zarar verir; kaçırıldığında bütün haritanın güvenilirliği gider. Çeyrek ya da "şimdi / sonra / daha sonra" gibi kabalık düzeyi daha dayanıklıdır. Kesin tarih gerekiyorsa o iş artık yol haritasına değil Gantt şemasına aittir.'
      },
      {
        q: 'Yol haritası ne sıklıkla güncellenmeli?',
        a:
          'Ayda bir gözden geçirmek çoğu ekip için yeterli. Her hafta değişen bir yol haritası yol haritası değildir; hiç değişmeyen de gerçeklikten kopmuştur. Değişikliğin kendisi değil, sebebinin yazılması önemlidir.'
      },
      {
        q: 'Yapılmayacaklar listesi neden gerekli?',
        a:
          'Çünkü bir yol haritasına yöneltilen soruların çoğu "peki şu ne olacak" biçiminde gelir. Bilerek dışarıda bırakılanları yazmak bu soruları baştan cevaplar ve ekibi her hafta aynı tartışmaya dönmekten kurtarır.'
      },
      {
        q: 'Ücretsiz mi?',
        a:
          'Evet. Klarsti şu an ücretsiz ve reklamsız. Yol haritası çıkarmak için hesap açman gerekmiyor.'
      },
    ],
    seo: {
      name: 'Yol haritası',
      title: 'Yol haritası oluşturma — ürün yol haritası | Klarsti',
      description:
        'Önümüzdeki dönemin sırasını duraklara böl ve bu dönem yapılmayacakları da yaz. Altı aylık bir örnekle, ücretsiz araç.',
      keywords: 'yol haritası, ürün yol haritası, roadmap, yol haritası örneği, yol haritası nasıl hazırlanır'
    }
  }
};

export default kilavuzlar;
