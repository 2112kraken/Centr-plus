import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import AdminDashboard from "~/components/admin/AdminDashboard";

interface AdminPageProps {
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
    title: locale === 'uk' ? "Адмін-панель | CenterPlus" : "Admin Dashboard | CenterPlus",
    description: locale === 'uk' 
      ? "Адміністративна панель стрілецького комплексу CenterPlus" 
      : "Admin dashboard for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function AdminPage({
  params,
}: AdminPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <AdminDashboard locale={locale} />
    </AdminLayout>
  );
}