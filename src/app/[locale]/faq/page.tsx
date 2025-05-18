import { unstable_setRequestLocale } from "next-intl/server";
import FAQPage from "~/components/FAQPage";

interface FAQPageProps {
  params: Promise<{ // Возвращаем Promise для params
    locale: string;
  }>;
}

// Функция для генерации метаданных
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>; // Возвращаем Promise для params
}) {
  const { locale } = await params; // Возвращаем Promise для params
  
  return {
    title: locale === 'uk' ? "Часті запитання | CenterPlus" : "FAQ | CenterPlus",
    description: locale === 'uk'
      ? "Відповіді на найпоширеніші запитання про стрілецький комплекс CenterPlus"
      : "Answers to the most common questions about CenterPlus Shooting Range",
  };
}

// Серверный компонент для страницы
export default async function FAQPageRoute({
  params,
}: FAQPageProps) {
  const { locale } = await params; // Возвращаем Promise для params
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  // Сообщения будут получены из NextIntlClientProvider в layout.tsx
  return <FAQPage locale={locale} />;
}