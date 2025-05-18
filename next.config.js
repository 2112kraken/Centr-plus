/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  // Пустая конфигурация, так как i18n в next.config.js не поддерживается в App Router
};

export default withNextIntl(config);
