import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import ContentTypesPage from "~/components/admin/ContentTypesPage";

interface ContentPageProps {
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
    title: locale === 'uk' ? "Управління контентом | CenterPlus" : "Content Management | CenterPlus",
    description: locale === 'uk' 
      ? "Управління контентом стрілецького комплексу CenterPlus" 
      : "Content management for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function ContentPage({
  params,
}: ContentPageProps) {
  const { locale } = params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <ContentTypesPage locale={locale} />
    </AdminLayout>
  );
}