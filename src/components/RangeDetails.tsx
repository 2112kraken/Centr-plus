'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Link } from '~/navigation';
import GradientSection from './GradientSection';

interface RangeDetailsProps {
  slug: string;
  locale: string;
}

// Моковые данные для стрелковых дистанций
const mockRanges = {
  '25m': {
    id: 'range-25m',
    titleUk: 'Тир 25 метрів',
    titleEn: '25m Range',
    length: 25,
    images: [
      '/images/ranges/range-25m-1.jpg',
      '/images/ranges/range-25m-2.jpg',
      '/images/ranges/range-25m-3.jpg',
    ],
    specUk: {
      lanes: '5 стрілецьких доріжок',
      targets: 'Електронні мішені з автоматичною зміною',
      weapons: 'Пістолети, револьвери',
      safety: 'Сучасна система вентиляції та захисту',
      description: 'Тир на 25 метрів ідеально підходить для тренувань з короткоствольної зброї. Обладнаний сучасними електронними мішенями з автоматичною зміною та системою підрахунку очок.'
    },
    specEn: {
      lanes: '5 shooting lanes',
      targets: 'Electronic targets with automatic change',
      weapons: 'Pistols, revolvers',
      safety: 'Modern ventilation and protection system',
      description: 'The 25-meter range is perfect for training with handguns. Equipped with modern electronic targets with automatic change and scoring system.'
    }
  },
  '50m': {
    id: 'range-50m',
    titleUk: 'Тир 50 метрів',
    titleEn: '50m Range',
    length: 50,
    images: [
      '/images/ranges/range-50m-1.jpg',
      '/images/ranges/range-50m-2.jpg',
      '/images/ranges/range-50m-3.jpg',
    ],
    specUk: {
      lanes: '4 стрілецькі доріжки',
      targets: 'Електронні та паперові мішені',
      weapons: 'Карабіни, гвинтівки малого калібру',
      safety: 'Посилена система звукоізоляції',
      description: 'Тир на 50 метрів призначений для тренувань з карабінів та гвинтівок малого калібру. Обладнаний як електронними, так і паперовими мішенями для різних видів тренувань.'
    },
    specEn: {
      lanes: '4 shooting lanes',
      targets: 'Electronic and paper targets',
      weapons: 'Carbines, small caliber rifles',
      safety: 'Enhanced sound insulation system',
      description: 'The 50-meter range is designed for training with carbines and small caliber rifles. Equipped with both electronic and paper targets for different types of training.'
    }
  },
  '100m': {
    id: 'range-100m',
    titleUk: 'Тир 100 метрів',
    titleEn: '100m Range',
    length: 100,
    images: [
      '/images/ranges/range-100m-1.jpg',
      '/images/ranges/range-100m-2.jpg',
      '/images/ranges/range-100m-3.jpg',
    ],
    specUk: {
      lanes: '3 стрілецькі доріжки',
      targets: 'Електронні мішені з відеоспостереженням',
      weapons: 'Гвинтівки, карабіни, снайперські гвинтівки',
      safety: 'Професійна система захисту та звукоізоляції',
      description: 'Тир на 100 метрів призначений для тренувань з гвинтівок та снайперських гвинтівок. Обладнаний електронними мішенями з відеоспостереженням та системою підрахунку очок.'
    },
    specEn: {
      lanes: '3 shooting lanes',
      targets: 'Electronic targets with video surveillance',
      weapons: 'Rifles, carbines, sniper rifles',
      safety: 'Professional protection and sound insulation system',
      description: 'The 100-meter range is designed for training with rifles and sniper rifles. Equipped with electronic targets with video surveillance and scoring system.'
    }
  }
};

export default function RangeDetailsContent({ slug, locale }: RangeDetailsProps) {
  const t = useTranslations('rangeDetails');
  const [activeImage, setActiveImage] = useState(0);
  
  // Получаем данные о дистанции по slug
  const range = mockRanges[slug as keyof typeof mockRanges];
  
  // Если дистанция не найдена
  if (!range) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('rangeNotFound')}</h1>
        <p className="mb-8">{t('rangeNotFoundDescription')}</p>
        <Link href="/ranges" className="btn-primary">
          {t('backToRanges')}
        </Link>
      </div>
    );
  }
  
  // Получаем данные в зависимости от локали
  const title = locale === 'uk' ? range.titleUk : range.titleEn;
  const spec = locale === 'uk' ? range.specUk : range.specEn;

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
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
            <span>{range.length} {t('meters')}</span>
          </div>
        </div>
      </GradientSection>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Галерея изображений */}
          <div>
            <div className="relative h-80 md:h-96 w-full mb-4 rounded-xl overflow-hidden">
              <Image
                src={range.images[activeImage]}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {range.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  aria-label={`${t('viewImage')} ${index + 1}`}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-[var(--clr-accent)]' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Спецификации */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('specifications')}</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-[var(--clr-base)] text-white p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{t('lanes')}</h3>
                  <p>{spec.lanes}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[var(--clr-base)] text-white p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{t('targets')}</h3>
                  <p>{spec.targets}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[var(--clr-base)] text-white p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{t('weapons')}</h3>
                  <p>{spec.weapons}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[var(--clr-base)] text-white p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{t('safety')}</h3>
                  <p>{spec.safety}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t('description')}</h2>
              <p className="text-gray-700">{spec.description}</p>
            </div>
            
            <Link href="/booking" className="btn-primary inline-block">
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}