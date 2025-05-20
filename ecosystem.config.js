module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/sk-rancho',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://centruser:your_password@localhost:5432/centrplus',
        SITE_URL: 'https://sk-rancho.com',
        DEFAULT_LOCALE: 'uk',
        SUPPORTED_LOCALES: 'uk,en',
        SKIP_ENV_VALIDATION: 'true'
      }
    },
    {
      name: 'api',
      script: 'npm',
      args: 'run start:api',
      cwd: '/var/www/sk-rancho/apps/api',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://centruser:your_password@localhost:5432/centrplus',
        DEFAULT_LOCALE: 'uk',
        SUPPORTED_LOCALES: 'uk,en'
      }
    }
  ]
};