import React, { useState, useEffect, useRef } from 'react';

interface DebouncedFieldProps {
  initialValue: string;
  onCommit: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  /** Sayı alanları için 'number'. Değer yine metin olarak commit edilir. */
  type?: 'text' | 'number';
  min?: string;
  max?: string;
}

/**
 * Bir input/textarea alanını, her tuş vuruşunda değil, sadece odak kaybedildiğinde
 * (blur) store'a yazacak şekilde sarmalar. Değer değişmediyse (kullanıcı yazıp
 * geri sildiyse) gereksiz bir store güncellemesi tetiklenmez.
 *
 * `initialValue` sadece bileşenin İLK MONTE EDİLDİĞİ andaki değeri sağlar — daha
 * sonra dışarıdan `initialValue` değişse bile (örn. store'daki ilgisiz bir
 * güncelleme yüzünden), bu bileşenin kendi yerel state'i SIFIRLANMAZ. Bu,
 * kullanıcı yazarken editin kaybolmamasını garantiler. Farklı bir analiz/maddeye
 * geçildiğinde ise, çağıran taraftaki `key` (örn. `key={item.id}`) React'ın bu
 * bileşenin YENİ bir instance'ını oluşturmasını sağlar, dolayısıyla doğru
 * senkronizasyon otomatik olarak gerçekleşir.
 *
 * `onBlur`/`onKeyDown`/`autoFocus` opsiyoneldir — çağıran tarafın, bu alanın
 * store'a yazmasının ÜSTÜNE kendi ek davranışını (örn. "düzenleme modundan çık")
 * eklemesi gerektiğinde kullanılır. `onBlur` her zaman store commit'inden SONRA
 * çağrılır.
 */
export default function DebouncedField({ initialValue, onCommit, onBlur, onKeyDown, className, placeholder, multiline, rows, disabled, autoFocus, ariaLabel, type = 'text', min, max }: DebouncedFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [odakli, setOdakli] = useState(false);
  const valueRef = useRef(value);
  const onCommitRef = useRef(onCommit);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    valueRef.current = value;
    onCommitRef.current = onCommit;
    initialValueRef.current = initialValue;
  }, [value, onCommit, initialValue]);

  // Alan odakta DEĞİLKEN dışarıdaki değer değişirse alan onu benimser. Geri
  // alma bunu gerektiriyor: store eski değere döner ama kutuda kullanıcının
  // yazdığı metin kalırdı. Odaktayken benimsemiyoruz; yazarken araya giren bir
  // güncelleme (örn. aynı projede çalışan başka biri) edit'i silip atardı.
  useEffect(() => {
    if (!odakli && initialValue !== valueRef.current) {
      setValue(initialValue);
    }
  }, [initialValue, odakli]);

  useEffect(() => {
    return () => {
      if (valueRef.current !== initialValueRef.current) {
        onCommitRef.current(valueRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleFocus = () => setOdakli(true);

  const handleBlur = () => {
    setOdakli(false);
    if (value !== initialValue) {
      onCommit(value);
    }
    onBlur?.();
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        className={className}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
    />
  );
}
