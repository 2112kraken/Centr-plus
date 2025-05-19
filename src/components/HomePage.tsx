'use client';

import { useTranslations } from "next-intl";
import { Link } from "~/navigation";
import HeroSection from "./HeroSection";
import GradientSection from "./GradientSection";
import Image from "next/image";
import { useInView } from "~/hooks/useInView";

export default function HomePageContent() {
  // Получаем функцию для перевода из пространства имен "home"
  const t = useTranslations("home");

  // Преимущества стрелкового тира
  const benefits = [
    {
      id: 'modern-equipment',
      icon: '/images/icons/target.svg',
      title: t("benefits.modernEquipment.title"),
      description: t("benefits.modernEquipment.description")
    },
    {
      id: 'safety',
      icon: '/images/icons/shield.svg',
      title: t("benefits.safety.title"),
      description: t("benefits.safety.description")
    },
    {
      id: 'instructors',
      icon: '/images/icons/instructor.svg',
      title: t("benefits.instructors.title"),
      description: t("benefits.instructors.description")
    },
    {
      id: 'variety',
      icon: '/images/icons/gun.svg',
      title: t("benefits.variety.title"),
      description: t("benefits.variety.description")
    }
  ];

  // Создаем рефы для анимации появления
  const benefitsRef = useInView();
  const rangeGridRef = useInView();
  const ctaRef = useInView();

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <HeroSection backgroundImage="/images/hero-bg.svg" />
      
      {/* Преимущества */}
      <section ref={benefitsRef} className="py-16 px-4 reveal">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("benefitsTitle")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 cq">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-white rounded-xl shadow-card p-6 transition-transform duration-300 hover:translate-y-[-8px]"
              >
                <div className="w-16 h-16 bg-[var(--clr-base-light)] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Image
                    src={benefit.icon}
                    alt={benefit.title}
                    width={32}
                    height={32}
                    className="text-white"
                  />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <GradientSection ref={ctaRef} className="py-16 reveal">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ctaSection.title")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t("ctaSection.subtitle")}</p>
          <Link href="/booking" className="btn-primary text-lg">
            {t("ctaSection.button")}
          </Link>
        </div>
      </GradientSection>
    </main>
  );
}