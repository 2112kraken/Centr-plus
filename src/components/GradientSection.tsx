import React, { forwardRef } from 'react';

interface GradientSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Компонент-обертка с градиентным фоном
 * Использует градиент 135deg от --clr-base к --clr-base-light
 */
const GradientSection = forwardRef<HTMLElement, GradientSectionProps>(function GradientSection(
  { children, className = '' },
  ref
) {
  return (
    <section
      ref={ref}
      className={`clip-hero parallax section-gradient text-white py-12 px-4 ${className}`}
    >
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
});

GradientSection.displayName = 'GradientSection';

export default GradientSection;