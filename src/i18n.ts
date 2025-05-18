import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Поддерживаемые локали
export const locales = ['uk', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'uk';
 
export default getRequestConfig(async ({locale}) => {
  // Проверяем, поддерживается ли локаль
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
 
  // Загружаем сообщения для текущей локали
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const messages = (await import(`../locales/${locale}.json`)).default;
 
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    messages,
    timeZone: 'Europe/Kiev',
    now: new Date(),
    locale
  };
});