import { unstable_setRequestLocale } from "next-intl/server";
import RangeDetailsContent from "~/components/RangeDetails";

interface RangeDetailsPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Функция для генерации метаданных
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  
  // Моковые данные для метаданных
  const titles = {
    '25m': {
      uk: "Тир 25 метрів | CenterPlus",
      en: "25m Range | CenterPlus"
    },
    '50m': {
      uk: "Тир 50 метрів | CenterPlus",
      en: "50m Range | CenterPlus"
    },
    '100m': {
      uk: "Тир 100 метрів | CenterPlus",
      en: "100m Range | CenterPlus"
    }
  };
  
  const descriptions = {
    '25m': {
      uk: "Тир на 25 метрів для тренувань з короткоствольної зброї",
      en: "25-meter range for handgun training"
    },
    '50m': {
      uk: "Тир на 50 метрів для тренувань з карабінів та гвинтівок малого калібру",
      en: "50-meter range for carbine and small caliber rifle training"
    },
    '100m': {
      uk: "Тир на 100 метрів для тренувань з гвинтівок та снайперських гвинтівок",
      en: "100-meter range for rifle and sniper rifle training"
    }
  };
  
  return {
    title: titles[slug as keyof typeof titles]?.[locale as 'uk' | 'en'] || 
      (locale === 'uk' ? "Тир | CenterPlus" : "Range | CenterPlus"),
    description: descriptions[slug as keyof typeof descriptions]?.[locale as 'uk' | 'en'] || 
      (locale === 'uk' ? "Стрілецький тир CenterPlus" : "CenterPlus Shooting Range")
  };
}

// Серверный компонент для страницы
export default async function RangeDetailsPage({
  params,
}: RangeDetailsPageProps) {
  const { locale, slug } = params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);
  
  // Используем клиентский компонент для отображения содержимого
  return <RangeDetailsContent slug={slug} locale={locale} />;
}