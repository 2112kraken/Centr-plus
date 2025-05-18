import "~/styles/globals.css";

import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { locales } from "~/i18n/request";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import CallWidget from "~/components/CallWidget";

// Шрифт Geist
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return {
    title: "CenterPlus Shooting Range",
    description: "Стрілецький комплекс CenterPlus",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uk: `/uk`,
        en: `/en`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Включаем поддержку серверных компонентов
  unstable_setRequestLocale(locale);

  // Загружаем сообщения для текущей локали
  const messages = (locale === 'uk')
    ? (await import('../../../locales/uk.json')).default
    : (await import('../../../locales/en.json')).default;

  return (
    <html lang={locale} className={`${geist.variable}`}>
      <body>
        {/* @ts-expect-error Типы next-intl */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
          <Footer />
          <CallWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}