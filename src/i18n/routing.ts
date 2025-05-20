import {defineRouting} from 'next-intl/routing';
import {locales, defaultLocale} from './request'; // Импортируем существующие локали

export const routing = defineRouting({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: {
    mode: 'as-needed' // Изменено с 'always' на 'as-needed'
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