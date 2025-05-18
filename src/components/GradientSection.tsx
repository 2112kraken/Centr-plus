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
      className={`bg-gradient-to-br from-[var(--clr-base)] to-[var(--clr-base-light)] text-white py-12 px-4 ${className}`}
      style={{ backgroundImage: 'linear-gradient(135deg, var(--clr-base) 0%, var(--clr-base-light) 100%)' }}
    >
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
}