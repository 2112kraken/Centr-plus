'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items?: FAQItem[];
  className?: string;
  showHeader?: boolean;
  initialOpenIndex?: number;
}

/**
 * Сворачиваемый список часто задаваемых вопросов
 * Отображает вопросы и ответы в формате аккордеона
 * Поддерживает открытие/закрытие секций
 */
export default function FAQAccordion({
  items,
  className = '',
  showHeader = true,
  initialOpenIndex = -1,
}: FAQAccordionProps) {
  const t = useTranslations('faqAccordion');
  const [openIndex, setOpenIndex] = useState<number>(initialOpenIndex);
  const [showAll, setShowAll] = useState(false);
  
  // Если items не передан, используем вопросы из локализации
  const faqItems = items ?? t('questions') as FAQItem[];
  
  // Количество вопросов для отображения в свернутом состоянии
  const initialVisibleCount = 4;
  
  // Вопросы для отображения (все или только первые initialVisibleCount)
  const visibleItems = showAll ? faqItems : faqItems.slice(0, initialVisibleCount);
  
  // Обработчик клика по вопросу
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showHeader && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Вопрос (заголовок) */}
            <button
              onClick={() => handleToggle(index)}
              className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--clr-accent)] focus:ring-inset"
              aria-expanded={openIndex === index ? "true" : "false"}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {item.question}
              </h3>
              <span className="ml-6 flex-shrink-0">
                {openIndex === index ? (
                  <svg 
                    className="h-6 w-6 text-[var(--clr-accent)]" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 15l7-7 7 7" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="h-6 w-6 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                )}
              </span>
            </button>
            
            {/* Ответ (содержимое) */}
            {openIndex === index && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Кнопка "Показать больше/меньше" */}
      {faqItems.length > initialVisibleCount && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--clr-base)] bg-[var(--clr-accent)]/10 hover:bg-[var(--clr-accent)]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)]"
          >
            {showAll ? t('showLess') : t('showMore')}
            <svg 
              className={`ml-2 h-5 w-5 transform transition-transform ${showAll ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}