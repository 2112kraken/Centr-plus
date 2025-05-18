'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import GradientSection from './GradientSection';

interface ContactPageProps {
  locale?: string;
}

/**
 * Компонент страницы с контактной информацией
 * Отображает карту, контактную форму и информацию о компании
 */
export default function ContactPage({ locale = 'uk' }: ContactPageProps) {
  const t = useTranslations('footer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = locale === 'uk' ? 'Введіть ваше ім\'я' : 'Please enter your name';
    }
    
    if (!formData.email.trim()) {
      errors.email = locale === 'uk' ? 'Введіть вашу електронну пошту' : 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = locale === 'uk' ? 'Введіть коректну електронну пошту' : 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      errors.message = locale === 'uk' ? 'Введіть ваше повідомлення' : 'Please enter your message';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Имитация отправки данных на сервер
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        
        // Сбрасываем сообщение об успешной отправке через 5 секунд
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('contactUs')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {locale === 'uk' 
              ? 'Зв\'яжіться з нами для отримання додаткової інформації або бронювання' 
              : 'Contact us for more information or booking'}
          </p>
        </div>
      </GradientSection>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Карта и контактная информация */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-[var(--clr-base)]">
              {locale === 'uk' ? 'Наше розташування' : 'Our Location'}
            </h2>
            
            {/* Карта (OpenStreetMap через iframe) */}
            <div className="w-full h-80 bg-gray-200 mb-8 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=30.5%2C50.4%2C30.6%2C50.5&amp;layer=mapnik&amp;marker=50.45%2C30.55" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="CenterPlus location"
              ></iframe>
            </div>
            
            {/* Контактная информация */}
            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--clr-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">{locale === 'uk' ? 'Адреса' : 'Address'}</h3>
                  <p className="text-gray-600">{t('address')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--clr-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">{locale === 'uk' ? 'Телефон' : 'Phone'}</h3>
                  <p className="text-gray-600">{t('phone')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--clr-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">{locale === 'uk' ? 'Електронна пошта' : 'Email'}</h3>
                  <p className="text-gray-600">{t('email')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--clr-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">{locale === 'uk' ? 'Години роботи' : 'Working Hours'}</h3>
                  <p className="text-gray-600">{t('workingHours')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Контактная форма */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-[var(--clr-base)]">
              {locale === 'uk' ? 'Напишіть нам' : 'Write to Us'}
            </h2>
            
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-green-800">
                    {locale === 'uk' 
                      ? 'Дякуємо! Ваше повідомлення успішно відправлено. Ми зв\'яжемося з вами найближчим часом.' 
                      : 'Thank you! Your message has been successfully sent. We will contact you shortly.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'uk' ? 'Ім\'я та прізвище' : 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)] ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'uk' ? 'Електронна пошта' : 'Email'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)] ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'uk' ? 'Номер телефону' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'uk' ? 'Повідомлення' : 'Message'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)] ${
                      formErrors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#1B1B1B] bg-[var(--clr-accent)] hover:bg-[var(--clr-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)] ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting 
                      ? (locale === 'uk' ? 'Відправка...' : 'Sending...') 
                      : (locale === 'uk' ? 'Відправити повідомлення' : 'Send Message')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}