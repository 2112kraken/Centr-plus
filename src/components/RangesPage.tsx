'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import GradientSection from './GradientSection';
import RangeCard from './RangeCard';

// Моковые данные для стрелковых дистанций
const mockRanges = [
  {
    id: 'range-25m',
    title: 'Тир 25 метрів',
    titleEn: '25m Range',
    length: 25,
    image: '/images/ranges/range-25m.jpg',
    slug: '25m',
    available: true
  },
  {
    id: 'range-50m',
    title: 'Тир 50 метрів',
    titleEn: '50m Range',
    length: 50,
    image: '/images/ranges/range-50m.jpg',
    slug: '50m',
    available: true
  },
  {
    id: 'range-100m',
    title: 'Тир 100 метрів',
    titleEn: '100m Range',
    length: 100,
    image: '/images/ranges/range-100m.jpg',
    slug: '100m',
    available: true
  }
];

export default function RangesPageContent({ locale = 'uk' }) {
  const t = useTranslations('ranges');
  const [filter, setFilter] = useState<number | null>(null);

  // Фильтрация дистанций по длине
  const filteredRanges = filter 
    ? mockRanges.filter(range => range.length === filter)
    : mockRanges;

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </GradientSection>

      {/* Фильтры */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === null 
                ? 'bg-[var(--clr-accent)] text-[#1B1B1B]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('allRanges')}
          </button>
          <button 
            onClick={() => setFilter(25)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 25 
                ? 'bg-[var(--clr-accent)] text-[#1B1B1B]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('range25m')}
          </button>
          <button 
            onClick={() => setFilter(50)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 50 
                ? 'bg-[var(--clr-accent)] text-[#1B1B1B]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('range50m')}
          </button>
          <button 
            onClick={() => setFilter(100)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 100 
                ? 'bg-[var(--clr-accent)] text-[#1B1B1B]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('range100m')}
          </button>
        </div>

        {/* Список дистанций */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRanges.map((range) => (
            <RangeCard
              key={range.id}
              id={range.id}
              title={locale === 'uk' ? range.title : range.titleEn}
              length={range.length}
              image={range.image}
              slug={range.slug}
              available={range.available}
            />
          ))}
        </div>

        {/* Сообщение, если нет результатов */}
        {filteredRanges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">{t('noRangesFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}