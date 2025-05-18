import { unstable_setRequestLocale } from "next-intl/server";
import RangesPageContent from "~/components/RangesPage";

interface RangesPageProps {
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
    title: locale === 'uk' ? "Тири | CenterPlus" : "Ranges | CenterPlus",
    description: locale === 'uk' 
      ? "Стрілецькі тири CenterPlus - дистанції 25м, 50м та 100м" 
      : "CenterPlus Shooting Ranges - 25m, 50m, and 100m distances",
  };
}

// Серверный компонент для страницы
export default async function RangesPage({
  params,
}: RangesPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <RangesPageContent locale={locale} />;
}