import { unstable_setRequestLocale } from "next-intl/server";
import TrainingPageContent from "~/components/TrainingPage";

interface TrainingPageProps {
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
    title: locale === 'uk' ? "Навчання | CenterPlus" : "Training | CenterPlus",
    description: locale === 'uk' 
      ? "Курси стрільби для початківців та професіоналів у стрілецькому комплексі CenterPlus" 
      : "Shooting courses for beginners and professionals at CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function TrainingPage({
  params,
}: TrainingPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <TrainingPageContent locale={locale} />;
}