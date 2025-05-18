'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import GradientSection from './GradientSection';
import FAQAccordion from './FAQAccordion';

// Категории вопросов
enum FAQCategory {
  GENERAL = 'general',
  BOOKING = 'booking',
  SAFETY = 'safety',
  EQUIPMENT = 'equipment',
}

interface FAQPageProps {
  locale?: string;
}

/**
 * Компонент страницы с часто задаваемыми вопросами
 * Группирует вопросы по категориям и предоставляет поиск
 */
export default function FAQPage({ locale = 'uk' }: FAQPageProps) {
  const t = useTranslations('faqAccordion');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategory | null>(null);

  // Моковые данные для FAQ, сгруппированные по категориям
  const faqData = {
    [FAQCategory.GENERAL]: [
      {
        question: locale === 'uk' ? 'Чи потрібно мати дозвіл на зброю?' : 'Do I need a gun permit?',
        answer: locale === 'uk' 
          ? 'Для стрільби з нашої зброї дозвіл не потрібен. Для стрільби з власної зброї необхідно мати відповідний дозвіл.' 
          : 'You don\'t need a permit to use our rental firearms. To use your own firearm, you must have the appropriate permit.'
      },
      {
        question: locale === 'uk' ? 'Який мінімальний вік для відвідування тиру?' : 'What is the minimum age to visit the range?',
        answer: locale === 'uk' 
          ? 'Мінімальний вік для відвідування тиру - 18 років. Особи від 14 до 18 років можуть відвідувати тир у супроводі батьків або опікунів.' 
          : 'The minimum age to visit the range is 18 years. Persons aged 14 to 18 may visit the range accompanied by a parent or guardian.'
      },
      {
        question: locale === 'uk' ? 'Які документи потрібні для відвідування тиру?' : 'What documents are required to visit the range?',
        answer: locale === 'uk' 
          ? 'Для відвідування тиру необхідно мати при собі паспорт або інший документ, що посвідчує особу.' 
          : 'To visit the range, you must have a passport or other identification document.'
      }
    ],
    [FAQCategory.BOOKING]: [
      {
        question: locale === 'uk' ? 'Як забронювати тир?' : 'How do I book a range?',
        answer: locale === 'uk' 
          ? 'Ви можете забронювати тир онлайн на нашому сайті, зателефонувавши нам або відвідавши наш комплекс особисто.' 
          : 'You can book a range online on our website, by calling us, or by visiting our complex in person.'
      },
      {
        question: locale === 'uk' ? 'Чи можна скасувати бронювання?' : 'Can I cancel a booking?',
        answer: locale === 'uk' 
          ? 'Так, ви можете скасувати бронювання не пізніше ніж за 24 години до запланованого часу. В іншому випадку може стягуватися плата за скасування.' 
          : 'Yes, you can cancel a booking no later than 24 hours before the scheduled time. Otherwise, a cancellation fee may be charged.'
      }
    ],
    [FAQCategory.SAFETY]: [
      {
        question: locale === 'uk' ? 'Чи є інструктор для початківців?' : 'Is there an instructor for beginners?',
        answer: locale === 'uk' 
          ? 'Так, у нас працюють кваліфіковані інструктори, які проведуть інструктаж та допоможуть освоїти основи стрільби.' 
          : 'Yes, we have qualified instructors who will provide guidance and help you learn the basics of shooting.'
      },
      {
        question: locale === 'uk' ? 'Які заходи безпеки застосовуються в тирі?' : 'What safety measures are used at the range?',
        answer: locale === 'uk' 
          ? 'Наш тир обладнаний сучасними системами вентиляції, звукоізоляції та захисту. Всі відвідувачі проходять обов\'язковий інструктаж з техніки безпеки перед початком стрільби.' 
          : 'Our range is equipped with modern ventilation, sound insulation, and protection systems. All visitors undergo mandatory safety training before shooting.'
      }
    ],
    [FAQCategory.EQUIPMENT]: [
      {
        question: locale === 'uk' ? 'Чи можна приходити зі своєю зброєю?' : 'Can I bring my own firearm?',
        answer: locale === 'uk' 
          ? 'Так, ви можете використовувати власну зброю за наявності відповідних дозвільних документів.' 
          : 'Yes, you can use your own firearm if you have the appropriate permits and documentation.'
      },
      {
        question: locale === 'uk' ? 'Яке обладнання надається в тирі?' : 'What equipment is provided at the range?',
        answer: locale === 'uk' 
          ? 'Ми надаємо захисні окуляри, навушники, мішені та базове спорядження. Також доступна оренда різних видів зброї.' 
          : 'We provide protective glasses, ear protection, targets, and basic equipment. Various types of firearms are also available for rent.'
      }
    ]
  };

  // Переводы для категорий
  const categoryTranslations = {
    [FAQCategory.GENERAL]: locale === 'uk' ? 'Загальні питання' : 'General Questions',
    [FAQCategory.BOOKING]: locale === 'uk' ? 'Бронювання' : 'Booking',
    [FAQCategory.SAFETY]: locale === 'uk' ? 'Безпека' : 'Safety',
    [FAQCategory.EQUIPMENT]: locale === 'uk' ? 'Обладнання' : 'Equipment',
  };

  // Фильтрация вопросов по поисковому запросу и категории
  const filteredFAQs = Object.entries(faqData)
    .filter(([category]) => !activeCategory || category as FAQCategory === activeCategory)
    .flatMap(([_, questions]) => 
      questions.filter(item => 
        !searchQuery || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </GradientSection>

      <div className="container mx-auto px-4 py-12">
        {/* Поиск */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={locale === 'uk' ? 'Пошук питань...' : 'Search questions...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--clr-accent)] focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === null 
                ? 'bg-[var(--clr-accent)] text-[#1B1B1B]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {locale === 'uk' ? 'Всі питання' : 'All Questions'}
          </button>
          {Object.values(FAQCategory).map((category) => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category 
                  ? 'bg-[var(--clr-accent)] text-[#1B1B1B]' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {categoryTranslations[category]}
            </button>
          ))}
        </div>

        {/* Список вопросов */}
        <div className="max-w-3xl mx-auto">
          {activeCategory === null && !searchQuery ? (
            // Группировка по категориям, если нет фильтрации
            Object.entries(faqData).map(([category, questions]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-[var(--clr-base)]">
                  {categoryTranslations[category as FAQCategory]}
                </h2>
                <FAQAccordion 
                  items={questions} 
                  showHeader={false} 
                  className="mb-4"
                />
              </div>
            ))
          ) : (
            // Отфильтрованные вопросы
            filteredFAQs.length > 0 ? (
              <FAQAccordion 
                items={filteredFAQs} 
                showHeader={false}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  {locale === 'uk' ? 'Питань не знайдено' : 'No questions found'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}