import {defineRouting} from 'next-intl/routing';
import {locales, defaultLocale} from './request'; // Импортируем существующие локали

export const routing = defineRouting({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: {
    mode: 'always' // Или 'as-needed', или 'never' в зависимости от вашей стратегии
  },
  pathnames: {
    // Пример:
    // '/': '/',
    // '/about': {
    //   uk: '/pro-nas',
    //   en: '/about-us'
    // }
  }
});