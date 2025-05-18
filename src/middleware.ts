import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/request';

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
      .map(item => {
        const part = item.split(';')[0];
        return part ? part.trim().substring(0, 2).toLowerCase() : '';
      });
    
    // Находим первую поддерживаемую локаль
    const matchedLocale = acceptedLocales.find(locale =>
      locales.includes(locale as Locale)
    );
    if (matchedLocale) {
      preferredLocale = matchedLocale as Locale;
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
  // Включаем автоматическое определение локали
  localeDetection: true
});

export const config = {
  // Matcher для всех путей, кроме статических файлов, API и т.д.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};