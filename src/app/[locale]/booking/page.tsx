import { unstable_setRequestLocale } from "next-intl/server";
import BookingStepper from "~/components/BookingStepper";

interface BookingPageProps {
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
    title: locale === 'uk' ? "Бронювання | CenterPlus" : "Booking | CenterPlus",
    description: locale === 'uk' 
      ? "Забронюйте тир у стрілецькому комплексі CenterPlus" 
      : "Book a range at CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function BookingPage({
  params,
}: BookingPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <BookingStepper locale={locale} />;
}