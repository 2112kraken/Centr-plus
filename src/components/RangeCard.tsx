'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '~/navigation';

interface RangeCardProps {
  id: string;
  title: string;
  length: number;
  image: string;
  slug: string;
  available?: boolean;
  className?: string;
}

/**
 * Карточка для отображения информации о стрелковой дистанции
 * Отображает название, длину дистанции, изображение
 * Имеет ссылку на детальную страницу дистанции
 */
export default function RangeCard({
  id: _id,
  title,
  length,
  image,
  slug,
  available = true,
  className = '',
}: RangeCardProps) {
  const t = useTranslations('rangeCard');

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-card transition-transform duration-300 hover:translate-y-[-8px] ${className} ${!available ? 'opacity-70' : ''}`}
    >
      {/* Изображение */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
        
        {/* Индикатор доступности */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          available 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          {available ? t('available') : t('unavailable')}
        </div>
      </div>
      
      {/* Контент */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        
        <div className="flex items-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-[var(--clr-base)]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
            />
          </svg>
          <span className="ml-2 text-gray-700">
            {length} {t('meters')}
          </span>
        </div>
        
        <Link 
          href={`/ranges/${slug}`}
          className="inline-block bg-[var(--clr-base)] hover:bg-[var(--clr-base-light)] text-white rounded-lg px-4 py-2 transition-colors"
        >
          {t('viewDetails')}
        </Link>
      </div>
    </div>
  );
}