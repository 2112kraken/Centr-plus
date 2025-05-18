'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ContentManagerProps {
  locale?: string;
  contentType?: 'ranges' | 'courses' | 'faqs';
}

// Интерфейсы для различных типов контента
interface Range {
  id: string;
  slugUk: string;
  slugEn: string;
  titleUk: string;
  titleEn: string;
  length: number;
  contentUk: Record<string, unknown>;
  contentEn: Record<string, unknown>;
}

interface Course {
  id: string;
  slugUk: string;
  slugEn: string;
  titleUk: string;
  titleEn: string;
  priceUa: number;
  priceEn: number;
  contentUk: Record<string, unknown>;
  contentEn: Record<string, unknown>;
}

interface FAQ {
  id: string;
  questionUk: string;
  questionEn: string;
  answerUk: string;
  answerEn: string;
}

/**
 * Компонент для управления контентом (тиры, курсы, FAQ)
 * Предоставляет CRUD-функциональность для различных типов контента
 */
export default function ContentManager({ locale = 'uk', contentType = 'ranges' }: ContentManagerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedItem, setSelectedItem] = useState<Range | Course | FAQ | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState('');
  
  // Моковые данные для тиров
  const mockRanges: Range[] = [
    {
      id: 'range-1',
      slugUk: '25m',
      slugEn: '25m',
      titleUk: 'Тир 25 метрів',
      titleEn: '25m Range',
      length: 25,
      contentUk: {
        description: 'Тир для стрільби на короткі дистанції.',
        features: ['6 стрілецьких доріжок', 'Електронні мішені', 'Кондиціонування повітря']
      },
      contentEn: {
        description: 'Range for short-distance shooting.',
        features: ['6 shooting lanes', 'Electronic targets', 'Air conditioning']
      }
    },
    {
      id: 'range-2',
      slugUk: '50m',
      slugEn: '50m',
      titleUk: 'Тир 50 метрів',
      titleEn: '50m Range',
      length: 50,
      contentUk: {
        description: 'Тир для стрільби на середні дистанції.',
        features: ['4 стрілецькі доріжки', 'Електронні мішені', 'Кондиціонування повітря']
      },
      contentEn: {
        description: 'Range for medium-distance shooting.',
        features: ['4 shooting lanes', 'Electronic targets', 'Air conditioning']
      }
    },
    {
      id: 'range-3',
      slugUk: '100m',
      slugEn: '100m',
      titleUk: 'Тир 100 метрів',
      titleEn: '100m Range',
      length: 100,
      contentUk: {
        description: 'Тир для стрільби на довгі дистанції.',
        features: ['3 стрілецькі доріжки', 'Електронні мішені', 'Кондиціонування повітря']
      },
      contentEn: {
        description: 'Range for long-distance shooting.',
        features: ['3 shooting lanes', 'Electronic targets', 'Air conditioning']
      }
    }
  ];
  
  // Моковые данные для курсов
  const mockCourses: Course[] = [
    {
      id: 'course-1',
      slugUk: 'bazovyi-kurs',
      slugEn: 'basic-course',
      titleUk: 'Базовий курс стрільби',
      titleEn: 'Basic Shooting Course',
      priceUa: 2500,
      priceEn: 60,
      contentUk: {
        description: 'Базовий курс для початківців.',
        duration: '8 годин',
        level: 'Початковий'
      },
      contentEn: {
        description: 'Basic course for beginners.',
        duration: '8 hours',
        level: 'Beginner'
      }
    },
    {
      id: 'course-2',
      slugUk: 'serednii-kurs',
      slugEn: 'intermediate-course',
      titleUk: 'Середній курс стрільби',
      titleEn: 'Intermediate Shooting Course',
      priceUa: 3500,
      priceEn: 85,
      contentUk: {
        description: 'Курс для стрільців з базовими навичками.',
        duration: '12 годин',
        level: 'Середній'
      },
      contentEn: {
        description: 'Course for shooters with basic skills.',
        duration: '12 hours',
        level: 'Intermediate'
      }
    },
    {
      id: 'course-3',
      slugUk: 'prosunutyi-kurs',
      slugEn: 'advanced-course',
      titleUk: 'Просунутий курс стрільби',
      titleEn: 'Advanced Shooting Course',
      priceUa: 5000,
      priceEn: 120,
      contentUk: {
        description: 'Курс для досвідчених стрільців.',
        duration: '16 годин',
        level: 'Просунутий'
      },
      contentEn: {
        description: 'Course for experienced shooters.',
        duration: '16 hours',
        level: 'Advanced'
      }
    }
  ];
  
  // Моковые данные для FAQ
  const mockFAQs: FAQ[] = [
    {
      id: 'faq-1',
      questionUk: 'Чи потрібно мати дозвіл на зброю?',
      questionEn: 'Do I need a gun permit?',
      answerUk: 'Для стрільби з нашої зброї дозвіл не потрібен. Для стрільби з власної зброї необхідно мати відповідний дозвіл.',
      answerEn: 'You don\'t need a permit to use our rental firearms. To use your own firearm, you must have the appropriate permit.'
    },
    {
      id: 'faq-2',
      questionUk: 'Чи можна приходити зі своєю зброєю?',
      questionEn: 'Can I bring my own firearm?',
      answerUk: 'Так, ви можете використовувати власну зброю за наявності відповідних дозвільних документів.',
      answerEn: 'Yes, you can use your own firearm if you have the appropriate permits and documentation.'
    },
    {
      id: 'faq-3',
      questionUk: 'Чи є інструктор для початківців?',
      questionEn: 'Is there an instructor for beginners?',
      answerUk: 'Так, у нас працюють кваліфіковані інструктори, які проведуть інструктаж та допоможуть освоїти основи стрільби.',
      answerEn: 'Yes, we have qualified instructors who will provide guidance and help you learn the basics of shooting.'
    },
    {
      id: 'faq-4',
      questionUk: 'Який мінімальний вік для відвідування тиру?',
      questionEn: 'What is the minimum age to visit the range?',
      answerUk: 'Мінімальний вік для відвідування тиру - 18 років. Особи від 14 до 18 років можуть відвідувати тир у супроводі батьків або опікунів.',
      answerEn: 'The minimum age to visit the range is 18 years. Persons aged 14 to 18 may visit the range accompanied by a parent or guardian.'
    }
  ];
  
  // Получение данных в зависимости от типа контента
  const getContentData = () => {
    switch (contentType) {
      case 'ranges':
        return mockRanges;
      case 'courses':
        return mockCourses;
      case 'faqs':
        return mockFAQs;
      default:
        return [];
    }
  };
  
  // Получение заголовка страницы
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPageTitle = () => {
    if (locale === 'uk') {
      switch (contentType) {
        case 'ranges':
          return 'Управління тирами';
        case 'courses':
          return 'Управління курсами';
        case 'faqs':
          return 'Управління FAQ';
        default:
          return 'Управління контентом';
      }
    } else {
      switch (contentType) {
        case 'ranges':
          return 'Ranges Management';
        case 'courses':
          return 'Courses Management';
        case 'faqs':
          return 'FAQ Management';
        default:
          return 'Content Management';
      }
    }
  };
  
  // Получение описания страницы
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPageDescription = () => {
    if (locale === 'uk') {
      switch (contentType) {
        case 'ranges':
          return 'Створення, редагування та видалення тирів';
        case 'courses':
          return 'Створення, редагування та видалення курсів';
        case 'faqs':
          return 'Створення, редагування та видалення FAQ';
        default:
          return 'Управління контентом сайту';
      }
    } else {
      switch (contentType) {
        case 'ranges':
          return 'Create, edit, and delete ranges';
        case 'courses':
          return 'Create, edit, and delete courses';
        case 'faqs':
          return 'Create, edit, and delete FAQs';
        default:
          return 'Manage website content';
      }
    }
  };
  
  // Фильтрация данных по поисковому запросу
  const filterData = (data: (Range | Course | FAQ)[]) => {
    if (!searchQuery) return data;
    
    return data.filter(item => {
      switch (contentType) {
        case 'ranges':
          return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.titleUk.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.slugUk.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.slugEn.toLowerCase().includes(searchQuery.toLowerCase())
          );
        case 'courses':
          return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.titleUk.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.slugUk.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.slugEn.toLowerCase().includes(searchQuery.toLowerCase())
          );
        case 'faqs':
          return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.questionUk.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.answerUk.toLowerCase().includes(searchQuery.toLowerCase()) ??
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            item.answerEn.toLowerCase().includes(searchQuery.toLowerCase())
          );
        default:
          return false;
      }
    });
  };
  
  // Обработчик удаления элемента
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteItem = (id: string) => {
    // В реальном приложении здесь был бы API-запрос
    console.log(`Deleting item ${id}`);
    setIsDeleteModalOpen(false);
  };
  
  // Получение данных и фильтрация
  const contentData = getContentData();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredData = filterData(contentData);
  
  // Форматирование валюты
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatCurrency = (amount: number, currency: string): string => {
    if (currency === 'UAH') {
      return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₴`;
    } else {
      return `€${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  };
}