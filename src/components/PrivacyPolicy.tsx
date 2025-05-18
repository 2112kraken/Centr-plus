'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import GradientSection from './GradientSection';

interface PrivacyPolicyProps {
  locale?: string;
}

/**
 * Компонент страницы с политикой конфиденциальности
 * Отображает текст политики в формате Markdown с оглавлением
 */
export default function PrivacyPolicy({ locale = 'uk' }: PrivacyPolicyProps) {
  const t = useTranslations('footer');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Моковые данные для разделов политики конфиденциальности
  const privacyPolicySections = {
    uk: [
      {
        id: 'introduction',
        title: 'Вступ',
        content: `
## Вступ

Ця Політика конфіденційності пояснює, як CenterPlus Shooting Range ("ми", "нас" або "наш") збирає, використовує та захищає інформацію, яку ви надаєте під час використання нашого веб-сайту та послуг.

Ми поважаємо вашу конфіденційність і зобов'язуємося захищати ваші особисті дані. Ця політика конфіденційності інформує вас про ваші права на конфіденційність та про те, як закон захищає вас.

Будь ласка, уважно прочитайте цю політику конфіденційності, щоб зрозуміти наші погляди та практики щодо ваших особистих даних і як ми будемо з ними поводитися.
        `
      },
      {
        id: 'data-collection',
        title: 'Збір даних',
        content: `
## Збір даних

### Інформація, яку ви надаєте нам

Ми можемо збирати та обробляти наступні дані про вас:

- Інформація, яку ви надаєте, заповнюючи форми на нашому веб-сайті, включаючи інформацію, надану під час реєстрації для використання нашого сайту, бронювання наших послуг, підписки на наші послуги, публікації матеріалів або запиту додаткових послуг.
- Інформація, яку ви надаєте, коли повідомляєте про проблему з нашим сайтом.
- Записи кореспонденції, якщо ви зв'язуєтеся з нами.
- Відповіді на опитування, які ми використовуємо для дослідницьких цілей.
- Деталі транзакцій, які ви здійснюєте через наш веб-сайт, та виконання ваших замовлень.
- Деталі ваших відвідувань нашого веб-сайту та ресурси, до яких ви маєте доступ.

### Інформація, яку ми збираємо про вас

Під час кожного вашого відвідування нашого веб-сайту ми можемо автоматично збирати наступну інформацію:

- Технічна інформація, включаючи тип пристрою, IP-адресу, інформацію про браузер та операційну систему.
- Інформація про ваш візит, включаючи повний URL, час та тривалість відвідування сторінок.
        `
      },
      {
        id: 'data-usage',
        title: 'Використання даних',
        content: `
## Використання даних

Ми використовуємо інформацію, яку зберігаємо про вас, наступним чином:

- Для забезпечення вам інформації, продуктів або послуг, які ви запитуєте від нас.
- Для виконання наших зобов'язань, що виникають з будь-яких контрактів, укладених між вами та нами.
- Для надання вам інформації про інші товари та послуги, які ми пропонуємо, подібні до тих, які ви вже придбали або про які запитували.
- Для надання вам інформації про товари чи послуги, які, на нашу думку, можуть вас зацікавити.
- Для повідомлення вас про зміни в наших послугах.
- Для забезпечення ефективної роботи нашого веб-сайту для внутрішніх операцій, включаючи усунення несправностей, аналіз даних, тестування, дослідження, статистичні та опитувальні цілі.
- Для покращення нашого веб-сайту, щоб забезпечити більш ефективне представлення контенту для вас.
- Для вимірювання або розуміння ефективності реклами, яку ми показуємо вам та іншим, і для надання вам відповідної реклами.
        `
      },
      {
        id: 'data-sharing',
        title: 'Розкриття даних',
        content: `
## Розкриття даних

Ми можемо розкривати вашу особисту інформацію третім сторонам:

- Якщо ми продаємо або купуємо будь-який бізнес або активи, у такому випадку ми можемо розкрити ваші персональні дані потенційному продавцю або покупцю таких бізнесів або активів.
- Якщо CenterPlus Shooting Range або практично всі його активи придбані третьою стороною, у такому випадку персональні дані, які вона зберігає про своїх клієнтів, будуть одним із переданих активів.
- Якщо ми зобов'язані розкрити або поділитися вашими персональними даними для дотримання будь-якого юридичного зобов'язання, або для захисту прав, власності або безпеки CenterPlus Shooting Range, наших клієнтів або інших.
        `
      },
      {
        id: 'data-security',
        title: 'Безпека даних',
        content: `
## Безпека даних

Ми вживаємо відповідних заходів безпеки для запобігання несанкціонованому доступу або зміні, розкриттю або знищенню ваших персональних даних. Крім того, ми обмежуємо доступ до ваших персональних даних тим співробітникам, агентам, підрядникам та іншим третім сторонам, які мають бізнес-потребу знати. Вони будуть обробляти ваші персональні дані лише за нашими вказівками і зобов'язані дотримуватися конфіденційності.

Ми впровадили процедури для вирішення будь-якого підозрюваного порушення персональних даних і повідомимо вас і будь-який відповідний регулятор про порушення, коли ми юридично зобов'язані це зробити.
        `
      },
      {
        id: 'your-rights',
        title: 'Ваші права',
        content: `
## Ваші права

Ви маєте право:

- Запитувати доступ до своїх персональних даних.
- Запитувати виправлення своїх персональних даних.
- Запитувати видалення своїх персональних даних.
- Заперечувати проти обробки своїх персональних даних.
- Запитувати обмеження обробки своїх персональних даних.
- Запитувати передачу своїх персональних даних.
- Відкликати згоду.

Якщо ви хочете скористатися будь-яким із цих прав, будь ласка, зв'яжіться з нами.
        `
      },
      {
        id: 'cookies',
        title: 'Файли cookie',
        content: `
## Файли cookie

Наш веб-сайт використовує файли cookie для відрізнення вас від інших користувачів нашого веб-сайту. Це допомагає нам забезпечити вам хороший досвід під час перегляду нашого веб-сайту, а також дозволяє нам покращувати наш сайт.

Файл cookie - це невеликий файл букв і цифр, який ми зберігаємо у вашому браузері або на жорсткому диску вашого комп'ютера, якщо ви погоджуєтесь. Файли cookie містять інформацію, яка передається на жорсткий диск вашого комп'ютера.

Ми використовуємо наступні файли cookie:

- **Строго необхідні файли cookie**. Це файли cookie, необхідні для роботи нашого веб-сайту. Вони включають, наприклад, файли cookie, які дозволяють вам входити в захищені області нашого веб-сайту або використовувати кошик для покупок.
- **Аналітичні/продуктивні файли cookie**. Вони дозволяють нам розпізнавати та підраховувати кількість відвідувачів, а також бачити, як відвідувачі переміщуються по нашому веб-сайту під час його використання. Це допомагає нам покращити роботу нашого веб-сайту, наприклад, забезпечуючи, щоб користувачі легко знаходили те, що шукають.
- **Функціональні файли cookie**. Вони використовуються для розпізнавання вас, коли ви повертаєтеся на наш веб-сайт. Це дозволяє нам персоналізувати наш контент для вас, вітати вас по імені та запам'ятовувати ваші уподобання (наприклад, ваш вибір мови або регіону).
- **Таргетингові файли cookie**. Ці файли cookie записують ваш візит на наш веб-сайт, сторінки, які ви відвідали, та посилання, за якими ви перейшли. Ми будемо використовувати цю інформацію, щоб зробити наш веб-сайт та рекламу, яка на ньому відображається, більш релевантними для ваших інтересів.
        `
      },
      {
        id: 'changes',
        title: 'Зміни до політики',
        content: `
## Зміни до політики

Будь-які зміни, які ми можемо внести в нашу політику конфіденційності в майбутньому, будуть розміщені на цій сторінці та, де це доречно, повідомлені вам електронною поштою. Будь ласка, часто перевіряйте, щоб побачити будь-які оновлення або зміни в нашій політиці конфіденційності.
        `
      },
      {
        id: 'contact',
        title: 'Контакти',
        content: `
## Контакти

Якщо у вас є будь-які запитання щодо цієї політики конфіденційності або наших практик конфіденційності, будь ласка, зв'яжіться з нами за адресою:

CenterPlus Shooting Range
вул. Стрілецька, 1, Київ, 01001
Email: privacy@centerplus.ua
Телефон: +380 44 123 4567
        `
      }
    ],
    en: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: `
## Introduction

This Privacy Policy explains how CenterPlus Shooting Range ("we", "us", or "our") collects, uses, and protects information that you provide when using our website and services.

We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about your privacy rights and how the law protects you.

Please read this privacy policy carefully to understand our views and practices regarding your personal data and how we will treat it.
        `
      },
      {
        id: 'data-collection',
        title: 'Data Collection',
        content: `
## Data Collection

### Information you provide to us

We may collect and process the following data about you:

- Information that you provide by filling in forms on our website, including information provided at the time of registering to use our site, booking our services, subscribing to our service, posting material, or requesting further services.
- Information that you provide when reporting a problem with our site.
- Records of correspondence if you contact us.
- Responses to surveys that we use for research purposes.
- Details of transactions you carry out through our website and of the fulfillment of your orders.
- Details of your visits to our website and the resources that you access.

### Information we collect about you

With each of your visits to our website, we may automatically collect the following information:

- Technical information, including the type of device, IP address, browser information, and operating system.
- Information about your visit, including the full URL, time and duration of visits to pages.
        `
      },
      {
        id: 'data-usage',
        title: 'Data Usage',
        content: `
## Data Usage

We use information held about you in the following ways:

- To provide you with information, products, or services that you request from us.
- To carry out our obligations arising from any contracts entered into between you and us.
- To provide you with information about other goods and services we offer that are similar to those that you have already purchased or enquired about.
- To provide you with information about goods or services we feel may interest you.
- To notify you about changes to our service.
- To ensure that content from our site is presented in the most effective manner for you and for your device.
- To administer our site and for internal operations, including troubleshooting, data analysis, testing, research, statistical and survey purposes.
- To improve our site to ensure that content is presented in the most effective manner for you.
- To measure or understand the effectiveness of advertising we serve to you and others, and to deliver relevant advertising to you.
        `
      },
      {
        id: 'data-sharing',
        title: 'Data Disclosure',
        content: `
## Data Disclosure

We may disclose your personal information to third parties:

- If we sell or buy any business or assets, in which case we may disclose your personal data to the prospective seller or buyer of such businesses or assets.
- If CenterPlus Shooting Range or substantially all of its assets are acquired by a third party, in which case personal data held by it about its customers will be one of the transferred assets.
- If we are under a duty to disclose or share your personal data in order to comply with any legal obligation, or in order to enforce or apply our terms of use and other agreements; or to protect the rights, property, or safety of CenterPlus Shooting Range, our customers, or others.
        `
      },
      {
        id: 'data-security',
        title: 'Data Security',
        content: `
## Data Security

We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.

We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
        `
      },
      {
        id: 'your-rights',
        title: 'Your Rights',
        content: `
## Your Rights

You have the right to:

- Request access to your personal data.
- Request correction of your personal data.
- Request erasure of your personal data.
- Object to processing of your personal data.
- Request restriction of processing your personal data.
- Request transfer of your personal data.
- Withdraw consent.

If you wish to exercise any of these rights, please contact us.
        `
      },
      {
        id: 'cookies',
        title: 'Cookies',
        content: `
## Cookies

Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.

A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive.

We use the following cookies:

- **Strictly necessary cookies**. These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website or use a shopping cart.
- **Analytical/performance cookies**. They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.
- **Functionality cookies**. These are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name and remember your preferences (for example, your choice of language or region).
- **Targeting cookies**. These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests.
        `
      },
      {
        id: 'changes',
        title: 'Changes to Policy',
        content: `
## Changes to Policy

Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by e-mail. Please check back frequently to see any updates or changes to our privacy policy.
        `
      },
      {
        id: 'contact',
        title: 'Contact',
        content: `
## Contact

If you have any questions about this privacy policy or our privacy practices, please contact us at:

CenterPlus Shooting Range
1 Shooting St., Kyiv, 01001
Email: privacy@centerplus.ua
Phone: +380 44 123 4567
        `
      }
    ]
  };

  // Отслеживание активного раздела при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentActiveSection: string | null = null;
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
          currentActiveSection = section.id;
        }
      });
      
      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для установки начального активного раздела
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  // Обработчик клика по ссылке в оглавлении
  const handleTocClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Получаем разделы для текущей локали
  const sections = locale === 'uk' ? privacyPolicySections.uk : privacyPolicySections.en;

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('privacy')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {locale === 'uk' 
              ? 'Політика конфіденційності CenterPlus Shooting Range' 
              : 'Privacy Policy of CenterPlus Shooting Range'}
          </p>
        </div>
      </GradientSection>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Оглавление (боковая панель) */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--clr-base)]">
                {locale === 'uk' ? 'Зміст' : 'Table of Contents'}
              </h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => handleTocClick(section.id)}
                        className={`text-left w-full px-2 py-1 rounded-md transition-colors ${
                          activeSection === section.id
                            ? 'bg-[var(--clr-accent)]/10 text-[var(--clr-base)] font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Основное содержимое */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <article className="prose prose-lg max-w-none">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="mb-12">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: section.content
                          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                          .replace(/\n- (.*$)/gim, '<li>$1</li>')
                          .replace(/<\/li>\n<li>/g, '</li><li>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/<\/p><p>- /g, '</p><ul><li>')
                          .replace(/<\/li>\n\n/g, '</li></ul><p>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} 
                    />
                  </section>
                ))}
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}