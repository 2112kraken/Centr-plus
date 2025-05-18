import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import SettingsPage from "~/components/admin/SettingsPage";

interface SettingsPageProps {
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
    title: locale === 'uk' ? "Налаштування | CenterPlus" : "Settings | CenterPlus",
    description: locale === 'uk' 
      ? "Налаштування сайту стрілецького комплексу CenterPlus" 
      : "Site settings for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function AdminSettingsPage({
  params,
}: SettingsPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <SettingsPage locale={locale} />
    </AdminLayout>
  );
}