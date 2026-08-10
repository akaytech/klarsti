// Markanın resmi hesapları. Sıra: en çok kullanılandan en aza.
//
// Liste alt bilgide ve iletişim sayfasında birebir aynı. Önce PublicFooter'ın
// içindeydi, oradan çıkarıldı: ikinci bir yerde gerekince kopyalanacaktı ve
// hesap eklendiğinde biri güncellenip diğeri unutulurdu.
//
// Neden SocialIcons.tsx'in içinde değil: o dosya yalnızca bileşen dışa
// aktarınca hızlı yenileme (fast refresh) çalışıyor, araya bir sabit
// konunca linter uyarı veriyor. Simgeler orada, liste burada.
//
// DİKKAT: Buradaki adresler index.html'deki Organization yapılandırılmış
// verisinin `sameAs` listesiyle aynı kalmalı. Google markanın hesaplarını
// oradan tanıyor; biri eklenip diğeri unutulursa bağ kopar.
import {
  InstagramIcon, FacebookIcon, LinkedInIcon, XIcon, TikTokIcon, ThreadsIcon, BlueskyIcon,
} from './SocialIcons';

export const SOSYAL_HESAPLAR = [
  { ad: 'Instagram', adres: 'https://www.instagram.com/klarsti.app/', Ikon: InstagramIcon },
  { ad: 'Facebook', adres: 'https://www.facebook.com/klarstiapp', Ikon: FacebookIcon },
  { ad: 'LinkedIn', adres: 'https://www.linkedin.com/company/klarsti/', Ikon: LinkedInIcon },
  { ad: 'X', adres: 'https://x.com/Klarsti', Ikon: XIcon },
  { ad: 'TikTok', adres: 'https://www.tiktok.com/@klarsti', Ikon: TikTokIcon },
  { ad: 'Threads', adres: 'https://www.threads.com/@klarsti.app', Ikon: ThreadsIcon },
  { ad: 'Bluesky', adres: 'https://bsky.app/profile/klarsti.bsky.social', Ikon: BlueskyIcon },
];
