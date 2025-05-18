import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Загружаем tsconfig.json через require вместо импорта
const tsconfig = require('./tsconfig.json');
const { compilerOptions } = tsconfig;

// Создаем базовую конфигурацию без наследования от корневого конфига
// Это позволит избежать проблем с импортом ES-модулей

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Указываем, что тесты находятся в src директории
  roots: ['<rootDir>/src'],
  // Расширения файлов, которые Jest будет обрабатывать
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // Трансформация файлов с помощью ts-jest
  transform: {
    '^.+\\.(ts)$': ['ts-jest', {
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
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  // Директория для отчетов о покрытии
  coverageDirectory: '../coverage',
  // Настройки для e2e тестов
  testRegex: '.spec.ts$',
  // Маппинг путей из tsconfig для корректного импорта модулей
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
};

export default config;