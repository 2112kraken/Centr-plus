import { unstable_setRequestLocale } from "next-intl/server";
import PrivacyPolicy from "~/components/PrivacyPolicy";

interface PrivacyPolicyPageProps {
  params: {
    locale: string;
  };
}

// Функция для генерации метаданных
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  
  return {
    title: locale === 'uk' ? "Політика конфіденційності | CenterPlus" : "Privacy Policy | CenterPlus",
    description: locale === 'uk' 
      ? "Політика конфіденційності стрілецького комплексу CenterPlus" 
      : "Privacy Policy of CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <PrivacyPolicy locale={locale} />;
}