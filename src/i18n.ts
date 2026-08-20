import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { DESTEKLENEN_DILLER } from './config/languages';
import { VARSAYILAN_DIL } from './utils/dilYolu';

// <html> öğesinin yön (dir) ve dil (lang) niteliklerini aktif dile göre ayarlar.
// i18n.dir() Arapça (ve gelecekte İbranice/Farsça) için 'rtl', diğerleri için
// 'ltr' döndürür. Böylece metin akışı, input hizası ve flex sıralaması doğru olur.
const applyDocumentDirection = (lng: string) => {
  document.documentElement.dir = i18n.dir(lng);
  document.documentElement.lang = lng;
};

i18n
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string) => import(`./locales/${language}.json`)))
  .use(initReactI18next)
  .init({
    fallbackLng: VARSAYILAN_DIL,
    // Adresin ilk parçası dil olabilir (/tr/wbs). 'path' algılayıcı önce
    // oraya bakıyor; parça geçerli bir dil değilse (örn. /wbs) sıradaki
    // yönteme düşüyor. supportedLngs olmadan "wbs" dil sanılırdı.
    supportedLngs: DESTEKLENEN_DILLER.map((d) => d.code),
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => applyDocumentDirection(i18n.language));

// Kullanıcı dili değiştirdiğinde yönü güncelle.
i18n.on('languageChanged', applyDocumentDirection);

export default i18n;
