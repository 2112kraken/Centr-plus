'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SettingsPageProps {
  locale?: string;
}

interface BrandSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

interface BinotelSettings {
  apiKey: string;
  secretKey: string;
  widgetId: string;
  enabled: boolean;
}

/**
 * Компонент страницы настроек
 * Предоставляет функциональность для настройки бренда и учетных данных Binotel
 */
export default function SettingsPage({ locale = 'uk' }: SettingsPageProps) {
  // Настройки бренда
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    siteName: 'CenterPlus Shooting Range',
    siteDescription: locale === 'uk' 
      ? 'Професійний стрілецький комплекс у Києві' 
      : 'Professional shooting range in Kyiv',
    logoUrl: '/logo.png',
    primaryColor: '#4B5320',
    accentColor: '#FDCB3E',
    contactEmail: 'info@centerplus.ua',
    contactPhone: '+380 44 123 4567',
    address: locale === 'uk' 
      ? 'вул. Стрілецька, 1, Київ, 01001' 
      : '1 Shooting St., Kyiv, 01001'
  });
  
  // Настройки Binotel
  const [binotelSettings, setBinotelSettings] = useState<BinotelSettings>({
    apiKey: 'binotel_api_key_example',
    secretKey: 'binotel_secret_key_example',
    widgetId: 'binotel_widget_id_example',
    enabled: true
  });
  
  // Состояние для отображения уведомления о сохранении
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  // Обработчик изменения настроек бренда
  const handleBrandSettingChange = (key: keyof BrandSettings, value: string) => {
    setBrandSettings({
      ...brandSettings,
      [key]: value
    });
  };
  
  // Обработчик изменения настроек Binotel
  const handleBinotelSettingChange = (key: keyof BinotelSettings, value: string | boolean) => {
    setBinotelSettings({
      ...binotelSettings,
      [key]: value
    });
  };
  
  // Обработчик сохранения настроек
  const handleSaveSettings = () => {
    // В реальном приложении здесь был бы API-запрос
    console.log('Saving brand settings:', brandSettings);
    console.log('Saving Binotel settings:', binotelSettings);
    
    // Показываем уведомление о сохранении
    setShowSaveNotification(true);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'uk' ? 'Налаштування' : 'Settings'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {locale === 'uk' ? 'Налаштування сайту та інтеграцій' : 'Site and integration settings'}
        </p>
      </div>
      
      {/* Уведомление о сохранении */}
      {showSaveNotification && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold mr-2">
            {locale === 'uk' ? 'Збережено!' : 'Saved!'}
          </strong>
          <span className="block sm:inline">
            {locale === 'uk' ? 'Налаштування успішно збережені.' : 'Settings have been successfully saved.'}
          </span>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Настройки бренда */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {locale === 'uk' ? 'Налаштування бренду' : 'Brand Settings'}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'Назва сайту' : 'Site Name'}
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={brandSettings.siteName}
                  onChange={(e) => handleBrandSettingChange('siteName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                />
              </div>
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'Опис сайту' : 'Site Description'}
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  value={brandSettings.siteDescription}
                  onChange={(e) => handleBrandSettingChange('siteDescription', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                />
              </div>
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'URL логотипу' : 'Logo URL'}
                </label>
                <input
                  type="text"
                  id="logoUrl"
                  value={brandSettings.logoUrl}
                  onChange={(e) => handleBrandSettingChange('logoUrl', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    {locale === 'uk' ? 'Основний колір' : 'Primary Color'}
                  </label>
                  <div className="mt-1 flex">
                    <input
                      type="color"
                      id="primaryColor"
                      value={brandSettings.primaryColor}
                      onChange={(e) => handleBrandSettingChange('primaryColor', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-md shadow-sm"
                      title={locale === 'uk' ? 'Виберіть основний колір' : 'Choose primary color'}
                      aria-label={locale === 'uk' ? 'Основний колір' : 'Primary Color'}
                    />
                    <input
                      type="text"
                      value={brandSettings.primaryColor}
                      onChange={(e) => handleBrandSettingChange('primaryColor', e.target.value)}
                      className="ml-2 flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                      title={locale === 'uk' ? 'Введіть код кольору в форматі HEX' : 'Enter color code in HEX format'}
                      placeholder="#000000"
                      aria-label={locale === 'uk' ? 'Код основного кольору' : 'Primary Color Code'}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">
                    {locale === 'uk' ? 'Акцентний колір' : 'Accent Color'}
                  </label>
                  <div className="mt-1 flex">
                    <input
                      type="color"
                      id="accentColor"
                      value={brandSettings.accentColor}
                      onChange={(e) => handleBrandSettingChange('accentColor', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-md shadow-sm"
                      title={locale === 'uk' ? 'Виберіть акцентний колір' : 'Choose accent color'}
                      aria-label={locale === 'uk' ? 'Акцентний колір' : 'Accent Color'}
                    />
                    <input
                      type="text"
                      value={brandSettings.accentColor}
                      onChange={(e) => handleBrandSettingChange('accentColor', e.target.value)}
                      className="ml-2 flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                      title={locale === 'uk' ? 'Введіть код кольору в форматі HEX' : 'Enter color code in HEX format'}
                      placeholder="#000000"
                      aria-label={locale === 'uk' ? 'Код акцентного кольору' : 'Accent Color Code'}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'Контактний email' : 'Contact Email'}
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={brandSettings.contactEmail}
                  onChange={(e) => handleBrandSettingChange('contactEmail', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'Контактний телефон' : 'Contact Phone'}
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  value={brandSettings.contactPhone}
                  onChange={(e) => handleBrandSettingChange('contactPhone', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'Адреса' : 'Address'}
                </label>
                <input
                  type="text"
                  id="address"
                  value={brandSettings.address}
                  onChange={(e) => handleBrandSettingChange('address', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Настройки Binotel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {locale === 'uk' ? 'Налаштування Binotel' : 'Binotel Settings'}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="binotelEnabled"
                checked={binotelSettings.enabled}
                onChange={(e) => handleBinotelSettingChange('enabled', e.target.checked)}
                className="h-4 w-4 text-[var(--clr-accent)] focus:ring-[var(--clr-accent)] border-gray-300 rounded"
              />
              <label htmlFor="binotelEnabled" className="ml-2 block text-sm text-gray-900">
                {locale === 'uk' ? 'Увімкнути інтеграцію з Binotel' : 'Enable Binotel integration'}
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="binotelApiKey" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'API ключ' : 'API Key'}
                </label>
                <input
                  type="text"
                  id="binotelApiKey"
                  value={binotelSettings.apiKey}
                  onChange={(e) => handleBinotelSettingChange('apiKey', e.target.value)}
                  disabled={!binotelSettings.enabled}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="binotelSecretKey" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'Секретний ключ' : 'Secret Key'}
                </label>
                <input
                  type="password"
                  id="binotelSecretKey"
                  value={binotelSettings.secretKey}
                  onChange={(e) => handleBinotelSettingChange('secretKey', e.target.value)}
                  disabled={!binotelSettings.enabled}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="binotelWidgetId" className="block text-sm font-medium text-gray-700">
                  {locale === 'uk' ? 'ID віджета' : 'Widget ID'}
                </label>
                <input
                  type="text"
                  id="binotelWidgetId"
                  value={binotelSettings.widgetId}
                  onChange={(e) => handleBinotelSettingChange('widgetId', e.target.value)}
                  disabled={!binotelSettings.enabled}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {locale === 'uk' 
                      ? 'Для отримання ключів API та ID віджета зверніться до служби підтримки Binotel.' 
                      : 'Contact Binotel support to obtain API keys and widget ID.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Кнопка сохранения */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-[var(--clr-accent)] text-[#1B1B1B] rounded-md hover:bg-[var(--clr-accent-hover)] transition-colors"
          >
            {locale === 'uk' ? 'Зберегти налаштування' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}