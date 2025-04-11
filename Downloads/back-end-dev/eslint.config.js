/* eslint-disable @typescript-eslint/no-require-imports */
const tseslint = require('typescript-eslint');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginImport = require('eslint-plugin-import');

module.exports = [
  ...tseslint.configs.recommended,
  {
    files: ['apps/supertest/src/common/sdk/operations.graphql.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['sibling', 'parent'], 'index'],
          pathGroups: [
            {
              pattern: 'fs|http|path|crypto|typeorm|graphql-request',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@nestjs/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@app/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@common/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@identity/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@notification/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@balance/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@games/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@adminpanel/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@supertest/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    ignores: ['.eslintrc.js', 'eslint.config.js', 'dist/**'],
  },
];
