import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import ContentManager from "~/components/admin/ContentManager";

interface ContentPageProps {
  params: {
    locale: string;
    type: string;
  };
}

// Функция для генерации метаданных
export async function generateMetadata({
  params,
}: {
  params: { locale: string; type: string };
}) {
  const { locale, type } = params;
  
  let title = '';
  if (locale === 'uk') {
    switch (type) {
      case 'ranges':
        title = "Управління тирами | CenterPlus";
        break;
      case 'courses':
        title = "Управління курсами | CenterPlus";
        break;
      case 'faqs':
        title = "Управління FAQ | CenterPlus";
        break;
      default:
        title = "Управління контентом | CenterPlus";
    }
  } else {
    switch (type) {
      case 'ranges':
        title = "Ranges Management | CenterPlus";
        break;
      case 'courses':
        title = "Courses Management | CenterPlus";
        break;
      case 'faqs':
        title = "FAQ Management | CenterPlus";
        break;
      default:
        title = "Content Management | CenterPlus";
    }
  }
  
  return {
    title,
    description: locale === 'uk' 
      ? "Управління контентом стрілецького комплексу CenterPlus" 
      : "Content management for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function ContentPage({
  params,
}: ContentPageProps) {
  const { locale, type } = params;
  
  // Проверка валидности типа контента
  const validTypes = ['ranges', 'courses', 'faqs'];
  const contentType = validTypes.includes(type) ? type : 'ranges';
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <ContentManager locale={locale} contentType={contentType as 'ranges' | 'courses' | 'faqs'} />
    </AdminLayout>
  );
}