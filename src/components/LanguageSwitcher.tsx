'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '~/navigation';

interface LanguageSwitcherProps {
  locale: string;
}

export default function LanguageSwitcher({ locale: _locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    
    // Устанавливаем cookie для сохранения выбранного языка
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleChange('uk')}
        className={`px-2 py-1 rounded ${
          currentLocale === 'uk'
            ? 'bg-[var(--clr-accent)] text-[#1B1B1B] font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isPending}
        title="Українська"
        aria-label="Українська"
      >
        UA
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`px-2 py-1 rounded ${
          currentLocale === 'en'
            ? 'bg-[var(--clr-accent)] text-[#1B1B1B] font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isPending}
        title="English"
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}