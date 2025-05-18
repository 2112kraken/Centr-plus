'use client';

import { useTranslations } from 'next-intl';
import GradientSection from './GradientSection';
import PriceTable from './PriceTable';
import { Link } from '~/navigation';

interface PricesPageProps {
  locale: string;
}

// Типы для моковых данных
interface PriceItem {
  id: string;
  service: {
    uk: string;
    en: string;
  };
  price: number;
  unit?: string;
  featured?: boolean;
}

// Моковые данные для цен
const mockRangePrices = [
  {
    id: 'range-25m',
    service: {
      uk: 'Тир 25 метрів (1 година)',
      en: '25m Range (1 hour)'
    },
    price: 500,
    unit: 'hour'
  },
  {
    id: 'range-50m',
    service: {
      uk: 'Тир 50 метрів (1 година)',
      en: '50m Range (1 hour)'
    },
    price: 600,
    unit: 'hour'
  },
  {
    id: 'range-100m',
    service: {
      uk: 'Тир 100 метрів (1 година)',
      en: '100m Range (1 hour)'
    },
    price: 700,
    unit: 'hour'
  },
  {
    id: 'range-all-day',
    service: {
      uk: 'Весь день (будні дні)',
      en: 'All day (weekdays)'
    },
    price: 2500,
    unit: 'day',
    featured: true
  },
  {
    id: 'range-all-day-weekend',
    service: {
      uk: 'Весь день (вихідні)',
      en: 'All day (weekends)'
    },
    price: 3000,
    unit: 'day'
  }
];

const mockEquipmentPrices = [
  {
    id: 'pistol-rental',
    service: {
      uk: 'Оренда пістолета',
      en: 'Pistol rental'
    },
    price: 300,
    unit: 'hour'
  },
  {
    id: 'rifle-rental',
    service: {
      uk: 'Оренда гвинтівки',
      en: 'Rifle rental'
    },
    price: 400,
    unit: 'hour'
  },
  {
    id: 'ammo-9mm',
    service: {
      uk: 'Набої 9мм (50 шт)',
      en: '9mm Ammo (50 pcs)'
    },
    price: 600
  },
  {
    id: 'ammo-223',
    service: {
      uk: 'Набої .223 (50 шт)',
      en: '.223 Ammo (50 pcs)'
    },
    price: 800
  },
  {
    id: 'targets',
    service: {
      uk: 'Мішені (10 шт)',
      en: 'Targets (10 pcs)'
    },
    price: 150
  }
];

const mockServicesPrices = [
  {
    id: 'instructor',
    service: {
      uk: 'Інструктор (1 година)',
      en: 'Instructor (1 hour)'
    },
    price: 500,
    unit: 'hour'
  },
  {
    id: 'cleaning',
    service: {
      uk: 'Чистка зброї',
      en: 'Weapon cleaning'
    },
    price: 300
  },
  {
    id: 'storage',
    service: {
      uk: 'Зберігання зброї (місяць)',
      en: 'Weapon storage (month)'
    },
    price: 1000
  },
  {
    id: 'group-discount',
    service: {
      uk: 'Групове відвідування (від 5 осіб)',
      en: 'Group visit (5+ people)'
    },
    price: 2500,
    featured: true
  }
];

export default function PricesPageContent({ locale }: PricesPageProps) {
  const t = useTranslations('prices');
  
  // Функция для преобразования моковых данных в формат для компонента PriceTable
  const transformPriceItems = (items: PriceItem[]) => {
    return items.map(item => {
      const result: {
        id: string;
        service: string;
        price: number;
        unit?: string;
        featured?: boolean;
      } = {
        id: item.id,
        service: item.service[locale as 'uk' | 'en'],
        price: item.price
      };
      
      if (item.unit) {
        result.unit = item.unit;
      }
      
      if (item.featured) {
        result.featured = item.featured;
      }
      
      return result;
    });
  };
  
  const rangePrices = transformPriceItems(mockRangePrices);
  const equipmentPrices = transformPriceItems(mockEquipmentPrices);
  const servicesPrices = transformPriceItems(mockServicesPrices);

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
        {/* Цены на тиры */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('rangesPrices')}</h2>
          <PriceTable items={rangePrices} showHeader={false} />
        </section>
        
        {/* Цены на оборудование */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('equipmentPrices')}</h2>
          <PriceTable items={equipmentPrices} showHeader={false} />
        </section>
        
        {/* Цены на услуги */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('servicesPrices')}</h2>
          <PriceTable items={servicesPrices} showHeader={false} />
        </section>
        
        {/* Ссылка на PDF с полным прайс-листом */}
        <section className="bg-gray-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('fullPriceList.title')}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{t('fullPriceList.description')}</p>
          <a 
            href="/files/price-list.pdf" 
            target="_blank"
            className="inline-flex items-center bg-[var(--clr-base)] hover:bg-[var(--clr-base-light)] text-white rounded-lg px-6 py-3 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('fullPriceList.downloadButton')}
          </a>
        </section>
        
        {/* Специальные предложения */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('specialOffers.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-[var(--clr-accent)]">
              <h3 className="text-xl font-bold mb-3">{t('specialOffers.weekday.title')}</h3>
              <p className="text-gray-600 mb-4">{t('specialOffers.weekday.description')}</p>
              <div className="text-lg font-bold text-[var(--clr-base)]">-20%</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-[var(--clr-accent)]">
              <h3 className="text-xl font-bold mb-3">{t('specialOffers.group.title')}</h3>
              <p className="text-gray-600 mb-4">{t('specialOffers.group.description')}</p>
              <div className="text-lg font-bold text-[var(--clr-base)]">-15%</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-[var(--clr-accent)]">
              <h3 className="text-xl font-bold mb-3">{t('specialOffers.membership.title')}</h3>
              <p className="text-gray-600 mb-4">{t('specialOffers.membership.description')}</p>
              <Link href="/contact" className="text-[var(--clr-base)] font-medium hover:underline">
                {t('specialOffers.membership.learnMore')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}