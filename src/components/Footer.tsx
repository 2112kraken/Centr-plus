'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/navigation';

export default function Footer() {
  const t = useTranslations('navigation');
  const footerT = useTranslations('footer');

  return (
    <footer className="bg-[var(--clr-base)] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Логотип и краткая информация */}
          <div>
            <h3 className="text-xl font-bold mb-4">CenterPlus</h3>
            <p className="text-sm text-gray-200 mb-4">
              Професійний стрілецький комплекс з дистанціями 25м, 50м та 100м
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Социальные сети */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--clr-accent)] transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--clr-accent)] transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--clr-accent)] transition-colors"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--clr-accent)] transition-colors"
                aria-label="Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.224 17.871c.188.133.43.166.619.098.189-.068.34-.25.416-.439.728-1.841 2.261-7.209 2.866-9.333.047-.164.046-.343-.002-.507-.047-.164-.152-.306-.295-.394-.143-.087-.312-.124-.478-.102-.166.021-.319.103-.428.229-1.357 1.554-5.253 5.862-5.869 6.528-.262.243-.643.226-.883-.039-.52-.572-1.86-1.965-2.271-2.339-.646-.591-1.38-1.355-2.301-1.348-1.601.013-1.197 1.747-1.197 1.747.584 1.737 1.926 3.475 2.799 4.542.981 1.074 1.941 2.096 2.919 3.103.244.252.543.445.873.569.331.124.682.177 1.03.159.347-.018.689-.109 1.001-.269.311-.16.586-.383.807-.652.255-.293.604-.696.975-1.121.192-.22.52-.216.713.004l.325.337c.155.158.356.257.567.279.212.022.425-.025.608-.134z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Навигационные ссылки */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/ranges" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('ranges')}
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('training')}
                </Link>
              </li>
              <li>
                <Link href="/prices" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('prices')}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('booking')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-[var(--clr-accent)] transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Контактная информация */}
          <div>
            <h3 className="text-xl font-bold mb-4">{footerT('contactUs')}</h3>
            <div className="space-y-3">
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-[var(--clr-accent)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{footerT('address')}</span>
              </p>
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-[var(--clr-accent)]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{footerT('phone')}</span>
              </p>
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-[var(--clr-accent)]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{footerT('email')}</span>
              </p>
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-[var(--clr-accent)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{footerT('workingHours')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            {footerT('rights')}
          </p>
          <div>
            <Link href="/legal/privacy" className="text-sm text-gray-400 hover:text-[var(--clr-accent)] transition-colors">
              {footerT('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}