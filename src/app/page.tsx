import { redirect } from 'next/navigation';
import { defaultLocale } from '~/i18n/request';

export default function RootPage() {
  // Перенаправляем на путь с локалью по умолчанию
  redirect(`/${defaultLocale}`);
}
