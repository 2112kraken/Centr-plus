import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import MediaLibrary from "~/components/admin/MediaLibrary";

interface MediaPageProps {
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
    title: locale === 'uk' ? "Медіа бібліотека | CenterPlus" : "Media Library | CenterPlus",
    description: locale === 'uk' 
      ? "Управління медіафайлами стрілецького комплексу CenterPlus" 
      : "Media management for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function MediaPage({
  params,
}: MediaPageProps) {
  const { locale } = params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <MediaLibrary locale={locale} />
    </AdminLayout>
  );
}