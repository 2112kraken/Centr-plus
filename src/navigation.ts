import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './i18n/request';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, defaultLocale });