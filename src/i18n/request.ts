import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Поддерживаемые локали
export const locales = ['uk', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'uk';

// Временное решение для routing, пока мы не определили его централизованно
// В идеале, это должно импортироваться из './routing' как показано в документации next-intl
const routing = {
  locales: locales,
  defaultLocale: defaultLocale
};

export default getRequestConfig(async ({requestLocale}) => {
  // Это обычно соответствует сегменту `[locale]`
  let locale = await requestLocale;

  // Убедимся, что входящая локаль валидна
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Проверяем, поддерживается ли локаль (дополнительная проверка, если routing.locales отличается от locales)
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Загружаем сообщения для текущей локали
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const messages = (await import(`../../locales/${locale}.json`)).default;

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    messages,
    timeZone: 'Europe/Kiev',
    now: new Date(),
  };
});