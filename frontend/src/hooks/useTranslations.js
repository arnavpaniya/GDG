import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import { loadAllTranslations } from '@/utils/i18n';

export function useTranslations() {
  const { language } = useStore();
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadAllTranslations(language).then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, [language]);

  const t = (key) => {
    if (!translations) return key;
    const keys = key.split('.');
    let current = translations;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return key;
      }
    }
    
    return current;
  };

  return { t, translations, loading, language };
}
