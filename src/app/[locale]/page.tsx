import { unstable_setRequestLocale } from "next-intl/server";
import HomePageContent from "~/components/HomePage";

interface HomePageProps {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale } = params;
  
  return {
    title: "CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale } = params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <HomePageContent />;
}