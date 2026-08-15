/**
 * Deneme kipi: kullanıcı hesap açmadan tuvali kullanıyor.
 *
 * Neden bir bayrak: tuvallerin kendisi deneme kipinde de aynen çalışıyor,
 * yalnızca hesaba bağlı düğmeler (paylaş) kapanmalı. Bileşenlere ayrı ayrı
 * "deneme mi?" diye bir prop geçirmek yerine tek yerden okunuyor.
 *
 * Değer render'dan ÖNCE, /dene açılırken bir kez konuyor ve oturum boyunca
 * değişmiyor; o yüzden abonelik gerektirmiyor.
 */

let denemede = false;

export const denemeKipiniAc = () => {
  denemede = true;
};

export const denemeKipiKapat = () => {
  denemede = false;
};

export const denemeKipindeMi = () => denemede;
