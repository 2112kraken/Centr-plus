'use client';

import { useTranslations } from 'next-intl';
import { Link } from '~/navigation';

interface ContentTypesPageProps {
  locale?: string;
}

/**
 * Компонент страницы выбора типа контента
 * Предоставляет ссылки на различные типы контента для управления
 */
export default function ContentTypesPage({ locale = 'uk' }: ContentTypesPageProps) {
  // Типы контента
  const contentTypes = [
    {
      id: 'ranges',
      iconPath: (
        <path d="M5.25 14.25h13.5m-13.5-4.5h13.5M10.5 3l-7.5 7.5 7.5 7.5M3.75 10.5h16.5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      ),
      titleUk: 'Тири',
      titleEn: 'Ranges',
      descriptionUk: 'Управління тирами та їх характеристиками',
      descriptionEn: 'Manage shooting ranges and their characteristics'
    },
    {
      id: 'courses',
      iconPath: (
        <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      ),
      titleUk: 'Курси',
      titleEn: 'Courses',
      descriptionUk: 'Управління курсами та тренінгами',
      descriptionEn: 'Manage courses and trainings'
    },
    {
      id: 'faqs',
      iconPath: (
        <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      ),
      titleUk: 'Часті питання',
      titleEn: 'FAQs',
      descriptionUk: 'Управління частими питаннями',
      descriptionEn: 'Manage frequently asked questions'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'uk' ? 'Управління контентом' : 'Content Management'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {locale === 'uk' ? 'Виберіть тип контенту для управління' : 'Select content type to manage'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contentTypes.map((type) => (
          <Link 
            key={type.id} 
            href={`/admin/content/${type.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-[var(--clr-base)]/10 rounded-lg flex items-center justify-center text-[var(--clr-base)] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  {type.iconPath}
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                {locale === 'uk' ? type.titleUk : type.titleEn}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {locale === 'uk' ? type.descriptionUk : type.descriptionEn}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}