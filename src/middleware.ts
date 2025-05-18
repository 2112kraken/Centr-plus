import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n';

// Функция для определения локали из запроса
function getLocaleFromRequest(request: NextRequest): string {
  // Получаем текущую локаль из cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Получаем предпочтительный язык из заголовка Accept-Language
  const acceptLanguage = request.headers.get('Accept-Language');
  let preferredLocale = defaultLocale;
  
  if (acceptLanguage) {
    // Парсим заголовок Accept-Language
    const acceptedLocales = acceptLanguage
      .split(',')
      .map(item => item.split(';')[0].trim().substring(0, 2).toLowerCase());
    
    // Находим первую поддерживаемую локаль
    const matchedLocale = acceptedLocales.find(locale =>
      locales.includes(locale as Locale)
    );
    if (matchedLocale) {
      preferredLocale = matchedLocale;
    }
  }
  
  // Приоритет: cookie > Accept-Language > default
  return cookieLocale && locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : preferredLocale;
}

// Создаем middleware для интернационализации
export default createMiddleware({
  // Список поддерживаемых локалей
  locales,
  // Локаль по умолчанию
  defaultLocale,
  // Функция для определения локали
  localeDetection: (request) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return getLocaleFromRequest(request);
  }
});

export const config = {
  // Matcher для всех путей, кроме статических файлов, API и т.д.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};