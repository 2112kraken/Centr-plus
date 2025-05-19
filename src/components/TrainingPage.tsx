'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import GradientSection from './GradientSection';

interface TrainingPageProps {
  locale: string;
}

// Моковые данные для курсов
const mockCourses = [
  {
    id: 'basic-handgun',
    titleUk: 'Базовий курс стрільби з пістолета',
    titleEn: 'Basic Handgun Course',
    descriptionUk: 'Курс для початківців, які хочуть навчитися безпечно та ефективно користуватися пістолетом. Включає теоретичні та практичні заняття.',
    descriptionEn: 'Course for beginners who want to learn how to safely and effectively use a handgun. Includes theoretical and practical lessons.',
    priceUa: 2500,
    priceEn: 80,
    image: '/images/courses/handgun-basic.svg',
    duration: 8,
    level: 'beginner'
  },
  {
    id: 'advanced-handgun',
    titleUk: 'Просунутий курс стрільби з пістолета',
    titleEn: 'Advanced Handgun Course',
    descriptionUk: 'Курс для тих, хто вже має базові навички стрільби з пістолета і хоче покращити свою техніку та швидкість.',
    descriptionEn: 'Course for those who already have basic handgun shooting skills and want to improve their technique and speed.',
    priceUa: 3500,
    priceEn: 120,
    image: '/images/courses/handgun-advanced.svg',
    duration: 12,
    level: 'advanced'
  },
  {
    id: 'basic-rifle',
    titleUk: 'Базовий курс стрільби з гвинтівки',
    titleEn: 'Basic Rifle Course',
    descriptionUk: 'Курс для початківців, які хочуть навчитися безпечно та ефективно користуватися гвинтівкою. Включає теоретичні та практичні заняття.',
    descriptionEn: 'Course for beginners who want to learn how to safely and effectively use a rifle. Includes theoretical and practical lessons.',
    priceUa: 3000,
    priceEn: 100,
    image: '/images/courses/rifle-basic.svg',
    duration: 10,
    level: 'beginner'
  },
  {
    id: 'tactical-shooting',
    titleUk: 'Тактична стрільба',
    titleEn: 'Tactical Shooting',
    descriptionUk: 'Курс для тих, хто хоче навчитися тактичній стрільбі в різних умовах. Включає стрільбу з різних положень, з-за укриття, в русі.',
    descriptionEn: 'Course for those who want to learn tactical shooting in various conditions. Includes shooting from different positions, from behind cover, in motion.',
    priceUa: 4500,
    priceEn: 150,
    image: '/images/courses/tactical.svg',
    duration: 16,
    level: 'expert'
  },
  {
    id: 'competition-preparation',
    titleUk: 'Підготовка до змагань',
    titleEn: 'Competition Preparation',
    descriptionUk: 'Курс для тих, хто хоче підготуватися до спортивних змагань зі стрільби. Включає тренування з різних дисциплін.',
    descriptionEn: 'Course for those who want to prepare for shooting sports competitions. Includes training in various disciplines.',
    priceUa: 5000,
    priceEn: 170,
    image: '/images/courses/competition.svg',
    duration: 20,
    level: 'expert'
  },
  {
    id: 'self-defense',
    titleUk: 'Самооборона з використанням зброї',
    titleEn: 'Self-Defense with Firearms',
    descriptionUk: 'Курс для тих, хто хоче навчитися використовувати зброю для самооборони. Включає правові аспекти та практичні навички.',
    descriptionEn: 'Course for those who want to learn how to use firearms for self-defense. Includes legal aspects and practical skills.',
    priceUa: 4000,
    priceEn: 130,
    image: '/images/courses/self-defense.svg',
    duration: 14,
    level: 'intermediate'
  }
];

export default function TrainingPageContent({ locale }: TrainingPageProps) {
  const t = useTranslations('training');
  
  // Функция для отображения уровня сложности
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {t('levels.beginner')}
          </span>
        );
      case 'intermediate':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {t('levels.intermediate')}
          </span>
        );
      case 'advanced':
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {t('levels.advanced')}
          </span>
        );
      case 'expert':
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {t('levels.expert')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </GradientSection>

      {/* Список курсов */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl overflow-hidden shadow-card transition-transform duration-300 hover:translate-y-[-8px]"
            >
              {/* Изображение курса */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={course.image}
                  alt={locale === 'uk' ? course.titleUk : course.titleEn}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Контент */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {locale === 'uk' ? course.titleUk : course.titleEn}
                  </h2>
                  {getLevelBadge(course.level)}
                </div>
                
                <p className="text-gray-600 mb-4">
                  {locale === 'uk' ? course.descriptionUk : course.descriptionEn}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--clr-base)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-1 text-gray-600">
                      {course.duration} {t('hours')}
                    </span>
                  </div>
                  
                  <div className="text-xl font-bold text-[var(--clr-base)]">
                    {locale === 'uk' 
                      ? `${course.priceUa} ${t('currency.ua')}` 
                      : `${course.priceEn} ${t('currency.en')}`}
                  </div>
                </div>
                
                <button className="mt-4 w-full bg-[var(--clr-base)] hover:bg-[var(--clr-base-light)] text-white rounded-lg px-4 py-2 transition-colors">
                  {t('enrollButton')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Информация о записи на курсы */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4">{t('howToEnroll.title')}</h2>
            <p className="text-gray-600 mb-6">{t('howToEnroll.description')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--clr-base)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  1
                </div>
                <h3 className="font-semibold mb-2">{t('howToEnroll.step1.title')}</h3>
                <p className="text-gray-600">{t('howToEnroll.step1.description')}</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--clr-base)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  2
                </div>
                <h3 className="font-semibold mb-2">{t('howToEnroll.step2.title')}</h3>
                <p className="text-gray-600">{t('howToEnroll.step2.description')}</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--clr-base)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  3
                </div>
                <h3 className="font-semibold mb-2">{t('howToEnroll.step3.title')}</h3>
                <p className="text-gray-600">{t('howToEnroll.step3.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}