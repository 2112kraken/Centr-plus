'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { usePathname } from '~/navigation';
import { useState } from 'react';

export default function Navbar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Функция для определения активного состояния ссылки
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Компонент для активной ссылки с подчеркиванием
  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${
        isActive(href)
          ? 'text-[var(--clr-accent)] after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-full after:bg-accent'
          : 'text-gray-700 hover:text-[var(--clr-base)]'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[var(--clr-base)]">
              CenterPlus
            </Link>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <NavLink href="/">{t('home')}</NavLink>
              <NavLink href="/ranges">{t('ranges')}</NavLink>
              <NavLink href="/training">{t('training')}</NavLink>
              <NavLink href="/prices">{t('prices')}</NavLink>
              <NavLink href="/booking">{t('booking')}</NavLink>
              <NavLink href="/faq">{t('faq')}</NavLink>
              <NavLink href="/contact">{t('contact')}</NavLink>
            </div>
            
            {/* Переключатель языка */}
            <div className="ml-4">
              <LanguageSwitcher locale="" />
            </div>
          </div>
          
          {/* Мобильная навигация - кнопка бургер */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[var(--clr-base)]"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`px-4 py-2 ${isActive('/') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href="/ranges"
                className={`px-4 py-2 ${isActive('/ranges') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('ranges')}
              </Link>
              <Link
                href="/training"
                className={`px-4 py-2 ${isActive('/training') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('training')}
              </Link>
              <Link
                href="/prices"
                className={`px-4 py-2 ${isActive('/prices') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('prices')}
              </Link>
              <Link
                href="/booking"
                className={`px-4 py-2 ${isActive('/booking') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('booking')}
              </Link>
              <Link
                href="/faq"
                className={`px-4 py-2 ${isActive('/faq') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('faq')}
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 ${isActive('/contact') ? 'text-[var(--clr-accent)]' : 'text-gray-700'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>
              <div className="px-4 py-2">
                <LanguageSwitcher locale="" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}