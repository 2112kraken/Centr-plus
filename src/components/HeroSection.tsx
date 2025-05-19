'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/navigation';

interface HeroSectionProps {
  backgroundImage?: string;
  className?: string;
}

/**
 * Полноширинное вступление для главной страницы
 * Содержит заголовок, подзаголовок и кнопку CTA
 * Может использовать фоновое изображение или градиентный фон
 */
export default function HeroSection({
  backgroundImage,
  className = '',
}: HeroSectionProps) {
  const t = useTranslations('heroSection');

  return (
    <section
      className={`relative min-h-[70vh] flex items-center justify-center px-4 py-16 md:py-24 section-gradient parallax ${className}`}
      data-aos="fade-up"
    >
      {/* Фоновое изображение или градиент */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Затемнение для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          {/* Clip-polygon эффект */}
          <div className="absolute inset-0 bg-black/40 clip-hero"></div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 section-gradient">
          {/* Clip-polygon эффект */}
          <div className="absolute inset-0 bg-black/40 clip-hero"></div>
        </div>
      )}

      {/* Контент */}
      <div className="container mx-auto relative z-10 text-center reveal">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent animate-[gradient_6s_ease_infinite]">
            {t('title')}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href="/booking"
          className="btn-primary inline-block text-lg reveal"
        >
          {t('cta')}
        </Link>
      </div>

      {/* Декоративный элемент - волнистая линия внизу */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}