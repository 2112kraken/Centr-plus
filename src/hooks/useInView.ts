import { useRef, useEffect } from 'react';

/**
 * Хук для отслеживания видимости элемента в области просмотра
 * Добавляет класс 'in-view' к элементу, когда он становится видимым
 * Используется для анимации появления элементов при прокрутке
 */
export function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0 && entries[0].isIntersecting) {
          entries[0].target.classList.add('in-view');
        }
      },
      { threshold: 0.2 }
    );
    
    if (ref.current) {
      io.observe(ref.current);
    }
    
    return () => io.disconnect();
  }, []);
  
  return ref;
}

export default useInView;