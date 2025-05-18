import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import UserTable from "~/components/admin/UserTable";

interface UsersPageProps {
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
    title: locale === 'uk' ? "Управління користувачами | CenterPlus" : "User Management | CenterPlus",
    description: locale === 'uk' 
      ? "Управління користувачами стрілецького комплексу CenterPlus" 
      : "User management for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function UsersPage({
  params,
}: UsersPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <UserTable locale={locale} />
    </AdminLayout>
  );
}