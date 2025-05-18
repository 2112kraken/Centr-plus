import { unstable_setRequestLocale } from "next-intl/server";
import PrivacyPolicy from "~/components/PrivacyPolicy";

interface PrivacyPolicyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Функция для генерации метаданных
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
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
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <PrivacyPolicy locale={locale} />;
}