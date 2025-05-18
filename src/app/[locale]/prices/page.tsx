import { unstable_setRequestLocale } from "next-intl/server";
import PricesPageContent from "~/components/PricesPage";

interface PricesPageProps {
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
    title: locale === 'uk' ? "Ціни | CenterPlus" : "Prices | CenterPlus",
    description: locale === 'uk' 
      ? "Актуальні ціни на послуги стрілецького комплексу CenterPlus" 
      : "Current prices for CenterPlus Shooting Range services",
  };
}

// Серверный компонент для страницы
export default async function PricesPage({
  params,
}: PricesPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <PricesPageContent locale={locale} />;
}