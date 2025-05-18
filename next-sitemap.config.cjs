/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://centerplus.ua',
  generateRobotsTxt: true,
  // Генерация отдельных карт сайта для каждой локали
  alternateRefs: [
    {
      href: 'https://centerplus.ua/uk',
      hreflang: 'uk',
    },
    {
      href: 'https://centerplus.ua/en',
      hreflang: 'en',
    },
  ],
  // Настройка для генерации отдельных карт сайта для каждой локали
  additionalPaths: async (config) => {
    const result = [];
    
    // Добавляем пути для украинской локали
    result.push({
      loc: '/uk',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
      alternateRefs: [
        { href: 'https://centerplus.ua/en', hreflang: 'en' },
      ],
    });
    
    // Добавляем пути для английской локали
    result.push({
      loc: '/en',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8,
      alternateRefs: [
        { href: 'https://centerplus.ua/uk', hreflang: 'uk' },
      ],
    });
    
    return result;
  },
  // Исключаем пути, которые не должны быть в карте сайта
  exclude: ['/api/*', '/admin/*'],
};