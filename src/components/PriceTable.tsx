'use client';

import { useTranslations } from 'next-intl';

interface PriceItem {
  id: string;
  service: string;
  price: number;
  unit?: string;
  featured?: boolean;
}

interface PriceTableProps {
  items: PriceItem[];
  className?: string;
  showHeader?: boolean;
}

/**
 * Адаптивная таблица цен
 * Отображает услуги и их стоимость
 * На мобильных устройствах трансформируется в карточки
 */
export default function PriceTable({
  items,
  className = '',
  showHeader = true,
}: PriceTableProps) {
  const t = useTranslations('priceTable');

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

      {/* Десктопная версия (таблица) - скрыта на мобильных */}
      <div className="hidden md:block overflow-hidden rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--clr-base)] text-white">
              <th className="py-4 px-6 text-left">{t('service')}</th>
              <th className="py-4 px-6 text-right">{t('price')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr 
                key={item.id} 
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  ${item.featured ? 'bg-[var(--clr-accent)]/10' : ''}
                  transition-colors hover:bg-gray-100
                `}
              >
                <td className="py-4 px-6 border-t border-gray-200">
                  {item.featured && (
                    <span className="inline-block bg-[var(--clr-accent)] text-[#1B1B1B] text-xs font-semibold mr-2 px-2 py-0.5 rounded">
                      ★
                    </span>
                  )}
                  {item.service}
                </td>
                <td className="py-4 px-6 text-right border-t border-gray-200 font-medium">
                  {item.price} {t('currency')}
                  {item.unit && <span className="text-sm text-gray-500 ml-1">/ {t(item.unit)}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия (карточки) - видна только на мобильных */}
      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`
              bg-white rounded-lg shadow-md overflow-hidden
              ${item.featured ? 'border-2 border-[var(--clr-accent)]' : 'border border-gray-200'}
            `}
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  {item.featured && (
                    <span className="inline-block bg-[var(--clr-accent)] text-[#1B1B1B] text-xs font-semibold mr-2 px-2 py-0.5 rounded">
                      ★
                    </span>
                  )}
                  {item.service}
                </h3>
                <div className="font-bold text-lg">
                  {item.price} {t('currency')}
                  {item.unit && <span className="text-sm text-gray-500 ml-1">/ {t(item.unit)}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}