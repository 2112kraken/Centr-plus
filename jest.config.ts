import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  // Используем node для API тестов и jsdom для React компонентов
  testEnvironment: 'node',
  // Указываем, что тесты находятся в src, apps и packages директориях
  roots: ['<rootDir>/src', '<rootDir>/apps', '<rootDir>/packages'],
  // Расширения файлов, которые Jest будет обрабатывать
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Трансформация файлов с помощью ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  // Игнорируем node_modules и другие директории при тестировании
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.cursor/', '<rootDir>/Documents/', '<rootDir>/Downloads/', '<rootDir>/\\.vscode/'],
  // Игнорируем пути для модулей
  modulePathIgnorePatterns: ['<rootDir>/.cursor/', '<rootDir>/Documents/', '<rootDir>/Downloads/'],
  // Собираем информацию о покрытии кода
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/mocks/**',
  ],
  // Директория для отчетов о покрытии
  coverageDirectory: 'coverage',
  // Настройки для разных типов тестов
  projects: [
    {
      displayName: 'react',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/apps/**/*.spec.ts'],
    },
  ],
};

export default config;