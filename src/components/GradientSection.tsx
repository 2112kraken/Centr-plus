import React from 'react';

interface GradientSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Компонент-обертка с градиентным фоном
 * Использует градиент 135deg от --clr-base к --clr-base-light
 */
export default function GradientSection({ 
  children, 
  className = '' 
}: GradientSectionProps) {
  return (
    <section
      className={`clip-hero parallax section-gradient text-white py-12 px-4 ${className}`}
    >
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
}