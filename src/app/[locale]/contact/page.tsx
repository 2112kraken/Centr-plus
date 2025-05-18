import { unstable_setRequestLocale } from "next-intl/server";
import ContactPage from "~/components/ContactPage";

interface ContactPageProps {
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
    title: locale === 'uk' ? "Контакти | CenterPlus" : "Contact | CenterPlus",
    description: locale === 'uk' 
      ? "Контактна інформація стрілецького комплексу CenterPlus" 
      : "Contact information for CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function ContactPageRoute({
  params,
}: ContactPageProps) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <ContactPage locale={locale} />;
}