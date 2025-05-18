// Импортируем расширения для jest-dom
import '@testing-library/jest-dom';

// Добавляем типы для глобальных объектов
declare global {
  interface Window {
    matchMedia(query: string): MediaQueryList;
  }
}

// Глобальные моки и настройки для тестов React-компонентов
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Мок для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Подавление предупреждений React в тестах
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' && (
      /Warning.*not wrapped in act/i.test(args[0]) ||
      /Warning: ReactDOM.render is no longer supported/i.test(args[0])
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};