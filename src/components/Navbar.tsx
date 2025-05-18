'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { usePathname } from '~/navigation';

export default function Navbar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  // Функция для определения активного состояния ссылки
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Логотип */}
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-[var(--clr-base)]">
              CenterPlus
            </Link>
          </div>

          {/* Навигационные ссылки - на мобильных устройствах отображаются под логотипом */}
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link 
                href="/" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('home')}
              </Link>
              <Link 
                href="/ranges" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/ranges') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('ranges')}
              </Link>
              <Link 
                href="/training" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/training') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('training')}
              </Link>
              <Link 
                href="/prices" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/prices') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('prices')}
              </Link>
              <Link 
                href="/booking" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/booking') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('booking')}
              </Link>
              <Link 
                href="/faq" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/faq') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('faq')}
              </Link>
              <Link 
                href="/contact" 
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive('/contact') 
                    ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
                    : 'text-gray-700 hover:text-[var(--clr-base)]'
                }`}
              >
                {t('contact')}
              </Link>
            </div>
            
            {/* Переключатель языка */}
            <div className="mt-4 md:mt-0">
              <LanguageSwitcher locale="" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}