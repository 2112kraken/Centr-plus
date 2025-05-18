import { unstable_setRequestLocale } from "next-intl/server";
import AdminLayout from "~/components/admin/AdminLayout";
import BookingTable from "~/components/admin/BookingTable";

interface BookingsPageProps {
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
    title: locale === 'uk' ? "Управління бронюваннями | CenterPlus" : "Booking Management | CenterPlus",
    description: locale === 'uk' 
      ? "Управління бронюваннями стрілецького комплексу CenterPlus" 
      : "Booking management for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function BookingsPage({
  params,
}: BookingsPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентские компоненты для отображения содержимого
  return (
    <AdminLayout locale={locale}>
      <BookingTable locale={locale} />
    </AdminLayout>
  );
}