import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PriceTable from './PriceTable';

// Добавляем типы для @testing-library/react
declare module '@testing-library/react' {
  interface RenderResult {
    container: HTMLElement;
  }
}

// Мок для useTranslations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Цены',
      'subtitle': 'Наши услуги и цены',
      'service': 'Услуга',
      'price': 'Цена',
      'currency': 'грн',
      'hour': 'час',
      'session': 'сессия',
      'day': 'день',
    };
    return translations[key] ?? key;
  },
}));

describe('PriceTable', () => {
  const mockItems = [
    { id: '1', service: 'Стрельба из пистолета', price: 500, unit: 'hour' },
    { id: '2', service: 'Стрельба из винтовки', price: 700, unit: 'session', featured: true },
    { id: '3', service: 'Аренда тира', price: 5000, unit: 'day' },
  ];

  it('рендерит все переданные цены', () => {
    render(<PriceTable items={mockItems} />);
    
    // Проверяем, что все услуги отображаются
    expect(screen.getByText('Стрельба из пистолета')).toBeInTheDocument();
    expect(screen.getByText('Стрельба из винтовки')).toBeInTheDocument();
    expect(screen.getByText('Аренда тира')).toBeInTheDocument();
    
    // Проверяем, что все цены отображаются
    expect(screen.getByText('500 грн', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('700 грн', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('5000 грн', { exact: false })).toBeInTheDocument();
  });

  it('отображает заголовок и подзаголовок, когда showHeader=true', () => {
    render(<PriceTable items={mockItems} showHeader={true} />);
    
    expect(screen.getByText('Цены')).toBeInTheDocument();
    expect(screen.getByText('Наши услуги и цены')).toBeInTheDocument();
  });

  it('не отображает заголовок и подзаголовок, когда showHeader=false', () => {
    render(<PriceTable items={mockItems} showHeader={false} />);
    
    expect(screen.queryByText('Цены')).not.toBeInTheDocument();
    expect(screen.queryByText('Наши услуги и цены')).not.toBeInTheDocument();
  });

  it('отмечает избранные услуги', () => {
    render(<PriceTable items={mockItems} />);
    
    // В мобильной и десктопной версии должны быть звездочки для избранных услуг
    // Проверяем, что есть хотя бы одна звездочка на странице
    const stars = screen.getAllByText('★');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('применяет переданный className', () => {
    const { container } = render(<PriceTable items={mockItems} className="test-class" />);
    
    // Проверяем, что корневой элемент содержит переданный класс
    expect(container.firstChild).toHaveClass('test-class');
  });
});