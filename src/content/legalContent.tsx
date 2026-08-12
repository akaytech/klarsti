// Gizlilik politikası ve kullanım koşullarının metinleri.
//
// Metinler eskiden LegalModal'ın içinde duruyordu. Artık iki yerden
// gösteriliyorlar: uygulama içindeki açılır pencere ve herkese açık
// /privacy, /terms sayfaları. Metnin tek kopyası olsun diye buraya alındı;
// iki yerde durursa biri güncellenip diğeri unutulur.

// Metinlerin içinde geçen destek adresi. Tanımı config/iletisim.ts'de:
// oradan okuyan başka dosyalar da var ve hepsi bu dosyayı, yani bütün yasal
// metinleri, paketine almak zorunda kalmasın diye ayrıldı.
import { CONTACT_EMAIL } from '../config/iletisim';
import CookiePreference from '../components/CookiePreference';

const heading = 'text-lg font-bold text-slate-900 dark:text-white mt-6';

const privacyTR = (
  <>
    <p className="font-semibold text-xs text-slate-500 mb-4">Son Güncelleme: 11 Ağustos 2026</p>

    <h3 className={heading}>1. Veri Sorumlusu</h3>
    <p>
      Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, "Klarsti" (bundan sonra "Uygulama" olarak anılacaktır) tarafından kişisel verilerinizin toplanması, işlenmesi ve aktarılması süreçlerine ilişkin olarak sizi bilgilendirmek amacıyla hazırlanmıştır.
    </p>

    <h3 className={heading}>2. İşlenen Kişisel Verileriniz</h3>
    <p>Uygulamayı kullanımınız kapsamında aşağıdaki kişisel verileriniz işlenmektedir:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Kimlik ve İletişim Verileri:</strong> Ad, soyad, e-posta adresi, profil fotoğrafı (Google ile giriş yapılması veya manuel kayıt olunması durumunda).</li>
      <li><strong>Kullanıcı İşlem Verileri:</strong> Uygulama içerisinde oluşturduğunuz projeler, diyagramlar, notlar ve paylaştığınız içerikler.</li>
      <li><strong>İşlem Güvenliği Verileri:</strong> IP adresi, sisteme giriş-çıkış saatleri, cihaz bilgileri, Firebase tarafından atanan benzersiz kullanıcı kimliği (User ID).</li>
    </ul>

    <h3 className={heading}>3. Kişisel Verilerin İşlenme Amacı</h3>
    <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Kullanıcı hesaplarının oluşturulması ve yönetilmesi,</li>
      <li>Uygulamanın temel işlevlerinin (proje oluşturma, kaydetme, eş zamanlı ortak çalışma) yerine getirilmesi,</li>
      <li>Ortak çalışma (multiplayer/share) özelliği kapsamında, yetkilendirdiğiniz diğer kullanıcılarla projelerinizin paylaşılması,</li>
      <li>Sistem güvenliğinin sağlanması, hataların tespit edilmesi ve uygulamanın geliştirilmesi.</li>
    </ul>

    <h3 className={heading}>4. Toplama Yöntemi ve Hukuki Sebep</h3>
    <p>
      Verileriniz tamamen elektronik ortamda, uygulamayı kullanmanız sırasında
      toplanır. Hukuki sebepleri şunlardır:
    </p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Sözleşmenin kurulması ve ifası (KVKK m.5/2-c):</strong> Hesabınızın açılması, çalışmalarınızın kaydedilmesi ve size gösterilmesi. Bu veriler olmadan hizmet verilemez.</li>
      <li><strong>Meşru menfaat (KVKK m.5/2-f):</strong> Sistem güvenliğinin sağlanması, kötüye kullanımın engellenmesi ve hataların tespit edilmesi. Bu kapsamda işlenen veriler teknik kayıtlarla sınırlıdır.</li>
      <li><strong>Açık rıza (KVKK m.5/1):</strong> Zorunlu olmayan ziyaret ölçümlemesi. Yalnızca izin verdiyseniz işlenir; izni istediğiniz zaman geri alabilirsiniz (bkz. Çerez Politikası).</li>
    </ul>

    <h3 className={heading}>5. Saklama Süresi</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>Hesabınıza ait veriler, hesabınız açık kaldığı sürece saklanır.</li>
      <li>Hesabınızı sildiğinizde veriler anında ve kalıcı olarak silinir; bekleme süresi uygulanmaz (bkz. aşağıdaki 8. bölüm).</li>
      <li>Paylaştığınız bir çalışmaya katılan kişilerin adı ve e-postası, o paylaşım sürdüğü sürece ilgili kayıtta tutulur; paylaşımdan çıkarıldıklarında silinir.</li>
      <li>Hata kayıtları, sorunun teşhisi için gereken süre boyunca hata takip hizmetimizde tutulur ve kendiliğinden silinir.</li>
    </ul>

    <h3 className={heading}>6. Kişisel Verilerin Aktarımı</h3>
    <p>Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda;</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Veritabanı ve sunucu hizmetleri için altyapı sağlayıcımız olan <strong>Google (Firebase)</strong> sunucularında barındırılmaktadır (Sunucuların yurt dışında bulunması sebebiyle yurt dışına aktarım söz konusudur).</li>
      <li>Ortak çalışma özelliği kullandığınızda, projenizi paylaştığınız diğer uygulama kullanıcıları (sadece ilgili proje verileri ile sınırlı olmak üzere) ile paylaşılır.</li>
    </ul>

    <h3 className={heading}>7. KVKK Madde 11 Kapsamındaki Haklarınız</h3>
    <p>Kanun’un 11. maddesi uyarınca veri sahibi olarak verilerinizin işlenip işlenmediğini öğrenme, silinmesini talep etme ve diğer haklarınızı kullanmak için aşağıdaki adres üzerinden iletişime geçebilirsiniz.</p>

    <h3 className={heading}>8. Hesabınızı ve Verilerinizi Silme</h3>
    <p>
      Hesabınızı istediğiniz zaman kendiniz silebilirsiniz: uygulamada sağ üstteki hesap düğmesine tıklayın, <strong>Ayarlar</strong> bölümünü açın ve en alttaki <strong>“Hesabı sil”</strong> seçeneğini kullanın. Talep etmenize veya bizden onay beklemenize gerek yoktur.
    </p>
    <p>Silme işlemi şunları kapsar:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Oluşturduğunuz bütün klasörler ve içlerindeki tüm çalışmalar,</li>
      <li>Ajandanız ve gün sonu değerlendirme notlarınız,</li>
      <li>Başka kullanıcıların paylaşımlarında yer alan ad ve e-posta kaydınız,</li>
      <li>Giriş hesabınız.</li>
    </ul>
    <p>
      Silme anında ve kalıcı olarak gerçekleşir; bekleme süresi yoktur ve verilerin geri getirilebileceği bir yedek tutulmaz. Silmeden önce çalışmalarınızın bir kopyasını almak isterseniz uygulama içindeki dışa aktarma seçeneğini kullanabilirsiniz.
    </p>
    <p>
      Uygulamaya erişemiyorsanız ya da silme işleminde bir sorun yaşarsanız aynı sonucu aşağıdaki adrese yazarak da elde edebilirsiniz.
    </p>

    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <p><strong>İletişim:</strong> {CONTACT_EMAIL}</p>
    </div>
  </>
);

const privacyEN = (
  <>
    <p className="font-semibold text-xs text-slate-500 mb-4">Last Updated: August 11, 2026</p>

    <h3 className={heading}>1. Data Controller</h3>
    <p>
      This Privacy Policy explains how "Klarsti" (the "Application") collects, processes, and transfers your personal data, and informs you about your related rights.
    </p>

    <h3 className={heading}>2. Personal Data We Process</h3>
    <p>The following personal data is processed in connection with your use of the Application:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Identity &amp; Contact Data:</strong> Name, email address, and profile photo (when signing in with Google or registering manually).</li>
      <li><strong>User Activity Data:</strong> The projects, diagrams, notes, and content you create and share within the Application.</li>
      <li><strong>Transaction Security Data:</strong> IP address, login/logout times, device information, and the unique user identifier (User ID) assigned by Firebase.</li>
    </ul>

    <h3 className={heading}>3. Purposes of Processing</h3>
    <p>Your personal data is processed for the following purposes:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Creating and managing user accounts,</li>
      <li>Delivering the core functions of the Application (creating and saving projects, and real-time collaboration),</li>
      <li>Sharing your projects with other users you authorize through the collaboration (multiplayer/share) feature,</li>
      <li>Ensuring system security, detecting errors, and improving the Application.</li>
    </ul>

    <h3 className={heading}>4. How Data Is Collected and On What Legal Basis</h3>
    <p>
      Your data is collected entirely electronically, while you use the
      application. The legal bases are:
    </p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Performance of a contract:</strong> Creating your account, saving your work and showing it back to you. The service cannot be provided without this data.</li>
      <li><strong>Legitimate interest:</strong> Keeping the system secure, preventing abuse and diagnosing errors. Data processed on this basis is limited to technical records.</li>
      <li><strong>Consent:</strong> Non-essential visit measurement. Processed only if you have agreed, and you can withdraw that consent at any time (see the Cookie Policy).</li>
    </ul>

    <h3 className={heading}>5. Retention</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>Data belonging to your account is kept for as long as the account exists.</li>
      <li>When you delete your account, the data is deleted immediately and permanently; there is no waiting period (see section 8 below).</li>
      <li>The name and email of people who joined something you shared are kept in that record for as long as the sharing lasts, and are removed when they leave or are removed.</li>
      <li>Error reports are kept by our error-tracking provider for as long as diagnosing the problem requires, and expire automatically.</li>
    </ul>

    <h3 className={heading}>6. Transfer of Personal Data</h3>
    <p>In order to fulfil the purposes stated above, your personal data may be:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Hosted on the servers of our infrastructure provider <strong>Google (Firebase)</strong>. As these servers may be located abroad, your data may be transferred internationally.</li>
      <li>Shared, when you use the collaboration feature, with the other users you share your project with (limited to the relevant project data only).</li>
    </ul>

    <h3 className={heading}>7. Your Rights</h3>
    <p>You have the right to learn whether your personal data is being processed, to request its deletion, and to exercise your other data protection rights. To do so, please contact us at the address below.</p>

    <h3 className={heading}>8. Deleting Your Account and Data</h3>
    <p>
      You can delete your account yourself at any time: click the account button at the top right of the application, open <strong>Settings</strong>, and use the <strong>“Delete account”</strong> option at the bottom. You do not need to submit a request or wait for our approval.
    </p>
    <p>Deletion covers:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Every folder you created and all the work inside it,</li>
      <li>Your agenda and end-of-day notes,</li>
      <li>Your name and email address as recorded in other users’ shared items,</li>
      <li>Your sign-in account.</li>
    </ul>
    <p>
      Deletion is immediate and permanent. There is no waiting period, and no backup is kept from which the data could be restored. If you would like a copy of your work first, use the export option inside the application before deleting.
    </p>
    <p>
      If you cannot access the application, or if something goes wrong during deletion, you can achieve the same result by writing to the address below.
    </p>

    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <p><strong>Contact:</strong> {CONTACT_EMAIL}</p>
    </div>
  </>
);

const termsTR = (
  <>
    <p className="font-semibold text-xs text-slate-500 mb-4">Son Güncelleme: 22 Temmuz 2026</p>

    <h3 className={heading}>1. Taraflar ve Kabul</h3>
    <p>
      Bu Kullanım Koşulları, "Klarsti" uygulamasını kullanım şartlarını düzenlemektedir. Uygulamaya kayıt olarak veya uygulamayı kullanarak bu koşulları kabul etmiş sayılırsınız.
    </p>

    <h3 className={heading}>2. Hizmetin Kapsamı</h3>
    <p>
      Klarsti, kullanıcıların problem çözme tekniklerini (WBS, SWOT, Ishikawa, Pareto vb.) kullanarak projeler oluşturmasını ve bu projeleri diğer kullanıcılarla paylaşarak ortaklaşa çalışmasını sağlayan bir üretkenlik aracıdır. Hizmet, "olduğu gibi" sunulmakta olup, kesintisiz veya hatasız çalışma garantisi verilmemektedir.
    </p>

    <h3 className={heading}>3. Kullanıcı Yükümlülükleri</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>Kullanıcı, hesabının güvenliğinden bizzat sorumludur.</li>
      <li>Uygulama içerisine girilen verilerin (projeler, notlar) hukuka aykırı, telif hakkı ihlali içeren veya üçüncü şahıslara zarar verici nitelikte olmaması kullanıcının sorumluluğundadır.</li>
      <li>"Ortak Çalışma (Paylaşım)" özelliği kullanıldığında, projenin linkini kimlerle paylaştığınız tamamen sizin sorumluluğunuzdadır.</li>
    </ul>

    <h3 className={heading}>4. Sorumluluğun Sınırlandırılması</h3>
    <p>
      Uygulamanın kullanımından, veri kayıplarından, sunucu kesintilerinden (Google Firebase kaynaklı sorunlar dahil) veya diğer kullanıcıların ortak projelerdeki eylemlerinden doğabilecek doğrudan veya dolaylı hiçbir zarardan Klarsti (geliştirici) sorumlu tutulamaz.
    </p>

    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <p><strong>İletişim:</strong> {CONTACT_EMAIL}</p>
    </div>
  </>
);

const termsEN = (
  <>
    <p className="font-semibold text-xs text-slate-500 mb-4">Last Updated: July 22, 2026</p>

    <h3 className={heading}>1. Parties and Acceptance</h3>
    <p>
      These Terms of Use govern your use of the "Klarsti" application. By registering for or using the Application, you are deemed to have accepted these terms.
    </p>

    <h3 className={heading}>2. Scope of Service</h3>
    <p>
      Klarsti is a productivity tool that enables users to create projects using problem-solving techniques (WBS, SWOT, Ishikawa, Pareto, etc.) and to collaborate by sharing these projects with other users. The service is provided "as is", with no guarantee of uninterrupted or error-free operation.
    </p>

    <h3 className={heading}>3. User Obligations</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>The user is personally responsible for the security of their account.</li>
      <li>The user is responsible for ensuring that data entered into the Application (projects, notes) is not unlawful, does not infringe copyright, and is not harmful to third parties.</li>
      <li>When using the "Collaboration (Sharing)" feature, you are solely responsible for whom you share the project link with.</li>
    </ul>

    <h3 className={heading}>4. Limitation of Liability</h3>
    <p>
      Klarsti (the developer) cannot be held liable for any direct or indirect damages arising from the use of the Application, data loss, server outages (including issues originating from Google Firebase), or the actions of other users in shared projects.
    </p>

    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <p><strong>Contact:</strong> {CONTACT_EMAIL}</p>
    </div>
  </>
);

// Çerez politikası.
//
// Buradaki liste uydurma değil: tarayıcıda gerçekten ne saklandığı tek tek
// bakılarak çıkarıldı. Hazır şablonlar genellikle sitenin hiç kullanmadığı
// çerezleri sayıyor; yanlış bir metin, hiç metin olmamasından daha kötü.
//
// DİKKAT: Uygulamaya yeni bir saklama alanı ya da üçüncü taraf betik
// eklendiğinde bu liste de güncellenmeli.
const cookiesTR = (
  <>
    <p className="font-semibold text-xs text-slate-500 mb-4">Son Güncelleme: 11 Ağustos 2026</p>

    <p>
      Klarsti, klasik anlamda çerezi çok az kullanır. İhtiyaç duyduğu bilgilerin
      neredeyse tamamını, tarayıcınızın kendi depolama alanlarında (yerel
      depolama, oturum depolaması, IndexedDB) saklar. Aşağıda bunların hepsi
      tek tek yazılıdır.
    </p>

    <h3 className={heading}>1. Zorunlu Olanlar</h3>
    <p>
      Bunlar uygulamanın çalışması ve güvenliği için gereklidir; izne bağlı
      değildir, çünkü olmadan uygulama kullanılamaz.
    </p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Oturum kaydı:</strong> Kim olduğunuzu tutar; her sayfa açılışında yeniden giriş yapmanızı önler. Firebase tarafından yönetilir. Çıkış yaptığınızda silinir.</li>
      <li><strong>Oturum kopyası:</strong> Sayfa ilk açıldığında ekranı doğru çizebilmek için adınız ve e-postanız tarayıcıda tutulur. Çıkışta ve hesap silmede temizlenir.</li>
      <li><strong>Dil tercihi:</strong> Seçtiğiniz arayüz dili. Siz değiştirene kadar kalır.</li>
      <li><strong>Tema tercihi:</strong> Seçtiğiniz görünüm. Siz değiştirene kadar kalır.</li>
      <li><strong>Sürüm tazeleme kaydı:</strong> Yeni bir sürüm yayınlandığında sayfanın gereksiz yere tekrar tekrar yenilenmesini önler. Sekmeyi kapattığınızda silinir.</li>
      <li><strong>Çevrimdışı önbellek:</strong> Uygulamanın dosyalarının kopyası. İnternetiniz kesildiğinde çalışmaya devam edebilmenizi sağlar. Kişisel veri içermez.</li>
      <li><strong>Google reCAPTCHA:</strong> İsteklerin gerçekten uygulamadan geldiğini doğrular, veritabanının kötüye kullanılmasını engeller. Google'ın kendi alan adında çerez kullanır.</li>
    </ul>

    <h3 className={heading}>2. İzninize Bağlı Olan</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Google Analytics:</strong> Kaç kişinin siteyi ziyaret ettiğini ve hangi sayfaların açıldığını ölçer. Ne yazdığınızı, hangi çalışmayı oluşturduğunuzu görmez. Çerezleri Google tarafından belirlenen süre boyunca (varsayılan olarak 2 yıla kadar) saklanır.</li>
    </ul>
    <p>
      İzin vermezseniz ölçümleme hiç başlatılmaz. Karar vermediğiniz sürece de
      kapalı kalır.
    </p>

    <h3 className={heading}>3. Tercihinizi Değiştirme</h3>
    <p>Kararınızı istediğiniz zaman buradan değiştirebilirsiniz:</p>
    <CookiePreference />

    <h3 className={heading}>4. Tarayıcıdan Silme</h3>
    <p>
      Yukarıdakilerin tamamını tarayıcınızın ayarlarından da silebilirsiniz.
      Bunu yaparsanız oturumunuz kapanır ve dil, tema gibi tercihleriniz
      sıfırlanır; çalışmalarınız etkilenmez, onlar sunucuda durur.
    </p>

    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <p><strong>İletişim:</strong> {CONTACT_EMAIL}</p>
    </div>
  </>
);

const cookiesEN = (
  <>
    <p className="font-semibold text-xs text-slate-500 mb-4">Last Updated: August 11, 2026</p>

    <p>
      Klarsti uses very few cookies in the classic sense. Almost everything it
      needs is kept in your browser’s own storage areas (local storage, session
      storage, IndexedDB). All of it is listed below.
    </p>

    <h3 className={heading}>1. Strictly Necessary</h3>
    <p>
      These are required for the application to work and to stay secure. They
      are not subject to consent, because without them the application cannot
      be used.
    </p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Session record:</strong> Keeps you signed in so you do not have to log in on every page load. Managed by Firebase. Removed when you sign out.</li>
      <li><strong>Session copy:</strong> Your name and email are kept in the browser so the first paint of the page is correct. Cleared on sign-out and on account deletion.</li>
      <li><strong>Language preference:</strong> The interface language you chose. Kept until you change it.</li>
      <li><strong>Theme preference:</strong> The appearance you chose. Kept until you change it.</li>
      <li><strong>Version refresh record:</strong> Prevents the page from reloading repeatedly when a new version is published. Removed when you close the tab.</li>
      <li><strong>Offline cache:</strong> A copy of the application’s files so it keeps working when your connection drops. Contains no personal data.</li>
      <li><strong>Google reCAPTCHA:</strong> Verifies that requests genuinely come from the application and protects the database from abuse. Uses cookies on Google’s own domain.</li>
    </ul>

    <h3 className={heading}>2. Subject to Your Consent</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Google Analytics:</strong> Measures how many people visit and which pages are opened. It does not see what you write or which work you create. Its cookies are stored for the period set by Google (up to 2 years by default).</li>
    </ul>
    <p>
      If you do not consent, measurement is never started. It also stays off
      for as long as you have not made a choice.
    </p>

    <h3 className={heading}>3. Changing Your Choice</h3>
    <p>You can change your decision at any time here:</p>
    <CookiePreference />

    <h3 className={heading}>4. Clearing Them From Your Browser</h3>
    <p>
      You can also delete all of the above from your browser settings. If you
      do, you will be signed out and preferences such as language and theme
      will reset. Your work is not affected; it stays on the server.
    </p>

    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <p><strong>Contact:</strong> {CONTACT_EMAIL}</p>
    </div>
  </>
);

export type LegalType = 'privacy' | 'terms' | 'cookies';

/**
 * İstenen metni verir. KVKK Türkiye'ye özgü bir kanun olduğundan Türkçe
 * kullanıcılar tam KVKK metnini görür; diğer bütün diller aynı içeriğin genel
 * İngilizce karşılığını görür.
 */
export function legalIcerik(type: LegalType, dil: string) {
  const turkceMi = (dil || '').toLowerCase().startsWith('tr');
  if (type === 'privacy') return turkceMi ? privacyTR : privacyEN;
  if (type === 'cookies') return turkceMi ? cookiesTR : cookiesEN;
  return turkceMi ? termsTR : termsEN;
}
