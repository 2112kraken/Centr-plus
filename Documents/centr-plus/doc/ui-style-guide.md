# CenterPlus **shadcn/ui + Tailwind CSS v4** Style‑Guide

> **Версия 2.0** — обогащена продвинутыми приемами Tailwind 4 и полным списком компонентов.
> Используйте это руководство как *единственный* источник для создания современного, тактильного и брендированного интерфейса.

## Содержание

- [0. Быстрый результат](#0-быстрый-результат)
- [1. Цветовые токены](#1-цветовые-токены-однократно)
- [2. Установка shadcn/ui](#2-установка-shadcnui)
- [3. Матрица компонентов и страниц](#3-матрица-компонентов-и-страниц)
- [4. Продвинутые приемы Tailwind 4](#4-продвинутые-приемы-tailwind-4-со-сниппетами)
- [5. Готовые сниппеты страниц](#5-готовые-сниппеты-страниц)
- [6. Защита производительности и доступности](#6-защита-производительности-и-доступности)
- [7. CI / Линтинг](#7-ci--линтинг)
- [8. Шпаргалка](#8-шпаргалка)

---

## 0. Быстрый результат

По завершении вы получите:

* Оливково-желтую **палитру бренда**, подключенную к токенам Tailwind + shadcn.
* 14 сгенерированных и стилизованных компонентов shadcn (кнопки, навигационное меню, hover-карточки, вкладки, уведомления...).
* Градиенты, стекломорфизм, анимации при прокрутке, сетки с контейнерными запросами, CSS-параллакс — **всё только на CSS**.
* Полностью готовые к копированию сниппеты для Hero-секции, сетки диапазонов, пошагового бронирования, карточек с ценами.

Время выполнения ≈ 20-25 минут на чистом репозитории.

---

## 1. Цветовые токены (однократно)

### 1.1. globals.css

```css
:root{
  /* БРЕНД */
  --clr-base:#4B5320;          /* темный оливковый */
  --clr-base-light:#667C3E;    /* светлый оливковый */
  --clr-accent:#FDCB3E;        /* энергичный желтый */
  --clr-accent-hover:color-mix(in srgb,var(--clr-accent) 80%,var(--clr-base));
  /* ДИЗАЙН-СИСТЕМА */
  --radius:1.25rem;            /* XL скругление */
  --shadow-card:0 8px 24px rgba(0,0,0,.12);
  --glass-bg:hsla(0,0%,100%,.05);
}
html{scroll-behavior:smooth}
.section-gradient{background-image:linear-gradient(135deg,var(--clr-base)0%,var(--clr-base-light)100%)}
.btn-primary{@apply bg-[var(--clr-accent)] text-[#1B1B1B] hover:bg-[var(--clr-accent-hover)] rounded-xl font-semibold transition-colors}
```

### 1.2. tailwind.config.mjs

```js
export default {
  content:['./src/**/*.{js,ts,jsx,tsx,mdx}','./packages/ui/**/*.{js,ts,jsx,tsx}','./locales/**/*.json'],
  theme:{
    extend:{
      colors:{
        primary:{DEFAULT:'var(--clr-base)',fg:'#FFF'},
        secondary:{DEFAULT:'var(--clr-base-light)',fg:'#FFF'},
        accent:{DEFAULT:'var(--clr-accent)',hover:'var(--clr-accent-hover)'}
      },
      borderRadius:{lg:'var(--radius)'},
      boxShadow:{card:'var(--shadow-card)'},
      gradientColorStops:{start:'var(--clr-base)',end:'var(--clr-base-light)'}
    },
  },
  plugins:['@tailwindcss/typography','@tailwindcss/forms','tailwindcss-animate'],
};
```

---

## 2. Установка shadcn/ui

```bash
pnpm dlx shadcn-ui@latest init --path src --tailwind tailwind.config.mjs
# базовые примитивы
pnpm dlx shadcn-ui@latest add button card input dialog dropdown-menu accordion
# расширенный набор
pnpm dlx shadcn-ui@latest add navigation-menu hover-card tooltip toast tabs table switch radio-group skeleton progress alert-dialog
```

> CLI внедряет Radix + стили; токены автоматически подхватывают наши цвета бренда.

### 2.1. Карта сгенерированных файлов

```
src/components/ui/
 ├─ button.tsx
 ├─ card.tsx
 ├─ navigation-menu.tsx
 ├─ hover-card.tsx
 … и т.д.
```

---

## 3. Матрица компонентов и страниц

| Маршрут / Функция               | Компонент(ы) shadcn                            |
| ------------------------------- | ---------------------------------------------- |
| Навбар (десктоп + мобильный)    | `navigation-menu` + `dropdown-menu`            |
| Hero CTA                        | `button` (вариант `primary`)                   |
| Карточки диапазонов с быстрыми характеристиками | `card` + `hover-card`          |
| Пошаговое бронирование          | `tabs` для шагов, `input`, `select`, `progress`|
| Выбор размера команды           | `radio-group`                                  |
| Прайс-лист                      | `table` + `badge` (кастомный)                  |
| FAQ                             | `accordion`                                    |
| Лайтбокс для медиа              | `dialog`                                       |
| Уведомления об успехе/ошибке    | `toast`                                        |
| Переключатели настроек (админ)  | `switch`                                       |
| Подсказки на иконках            | `tooltip`                                      |
| Подтверждение критичных действий| `alert-dialog`                                 |
| Плейсхолдеры при загрузке       | `skeleton`                                     |

---

## 4. Продвинутые приемы Tailwind 4 (со сниппетами)

### 4.1. Контейнерные запросы

```css
@layer utilities{ .cq{container-type:inline-size;} }
```

```tsx
<div className="grid gap-6 md:grid-cols-3">
  {ranges.map(r=>
    <div key={r.id} className="cq"><RangeCard range={r}/></div>) }
</div>
```

Внутри RangeCard:

```css
@container (min-width:400px){ .title{font-size:1.5rem;} }
```

### 4.2. Якорное позиционирование (стрелка подсказки)

```tsx
<Tooltip.Content sideOffset={6} className="rounded p-2 bg-primary text-sm text-white anchor-top">
  Скопіювано!
  <Tooltip.Arrow className="fill-primary" anchor="top"/>
</Tooltip.Content>
```

### 4.3. Стекломорфная карточка

```tsx
<Card className="backdrop-blur bg-[var(--glass-bg)] border border-white/10 shadow-card" />
```

### 4.4. Анимированный градиентный текст

```tsx
<h2 className="text-5xl font-extrabold bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent animate-[gradient_6s_ease_infinite]">
  Влучність — це ми
</h2>
```

Добавьте keyframes:

```css
@layer utilities{
  @keyframes gradient{0%{background-position:0%}100%{background-position:200%}}
}
```

### 4.5. Анимация при прокрутке (только CSS)

```css
@layer utilities{ .reveal{opacity:0;translate:0 2rem;transition:all .6s ease-out;} .reveal.in-view{opacity:1;translate:0 0;} }
```

```tsx
<div ref={useInView()} className="reveal">…</div>
```

Хук:

```ts
function useInView(){
 const ref = useRef<HTMLDivElement>(null);
 useEffect(()=>{
   const io = new IntersectionObserver(([e])=>e.isIntersecting&&e.target.classList.add('in-view'),{threshold:.2});
   if(ref.current) io.observe(ref.current);
   return ()=>io.disconnect();
 },[]);
 return ref;
}
```

### 4.6. Параллакс-фон (только CSS)

```css
.parallax{background-image:url('/img/bg.jpg');background-attachment:fixed;background-size:cover;background-position:center;}
```

Комбинируйте с наложением `.section-gradient`.

### 4.7. Фигурная обрезка Hero-секции

```tsx
<section className="relative h-[85vh] overflow-hidden">
  <Image ... className="absolute inset-0 object-cover" />
  <div className="absolute inset-0 bg-black/40 clip-[polygon(0_0,100%_0,100%_85%,0_100%)]" />
  ...контент...
</section>
```

### 4.8. 3D-эффект наклона карточки

```tsx
<Card className="[perspective:1000px] hover:[transform:rotateY(8deg)_rotateX(2deg)] transition-transform duration-300" />
```

---

## 5. Готовые сниппеты страниц

### 5.1. HeroSection.tsx

```tsx
import { Button } from "components/ui/button";
import Image from "next/image";

export const HeroSection = () => (
  <section className="relative h-[85vh] flex items-center justify-center section-gradient">
    <Image src="/images/hero.jpg" alt="Range" fill className="object-cover object-center opacity-30" priority/>
    <div className="relative z-10 text-center text-white max-w-2xl px-4">
      <h1 className="text-4xl md:text-6xl font-bold drop-shadow mb-6">Влучність — це ми</h1>
      <Button size="lg">Забронювати слот</Button>
    </div>
  </section>
);
```

### 5.2. RangeCard.tsx

```tsx
import { Card, CardContent } from "components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "components/ui/hover-card";
// ...
<HoverCard openDelay={200}>
  <HoverCardTrigger asChild>
    <Card className="shadow-card h-full flex flex-col">
      <Image ... className="aspect-[4/3] object-cover" />
      <CardContent className="flex-1 p-4 flex flex-col">
        <h3 className="font-semibold text-lg mb-2">{range.titleUk}</h3>
        <p className="text-sm text-muted-foreground">{range.length} м</p>
      </CardContent>
    </Card>
  </HoverCardTrigger>
  <HoverCardContent side="top" className="w-72 text-sm leading-relaxed">
    {range.descriptionUk}
  </HoverCardContent>
</HoverCard>
```

### 5.3. BookingStepper с вкладками

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "components/ui/tabs";
// ...
<Tabs defaultValue="step1" className="w-full">
  <TabsList className="grid grid-cols-3">
    <TabsTrigger value="step1">Дата</TabsTrigger>
    <TabsTrigger value="step2">Команда</TabsTrigger>
    <TabsTrigger value="step3">Оплата</TabsTrigger>
  </TabsList>
  <TabsContent value="step1"> <DatePicker .../> </TabsContent>
  <TabsContent value="step2"> <TeamSizeSelector .../> </TabsContent>
  <TabsContent value="step3"> <PaymentForm .../> </TabsContent>
</Tabs>
```

Индикатор прогресса ниже:

```tsx
<Progress value={(currentStep/3)*100} className="h-2 mt-4 bg-base-light/30" />
```

### 5.4. Хелпер для уведомлений

```ts
import { toast } from "components/ui/use-toast";
// ...
try{ 
  await api.booking.create(...); 
  toast.success({description:'Бронювання створено!'}) 
} catch(e){ 
  toast.error({description:e.message}) 
}
```

---

## 6. Защита производительности и доступности

* `prefetch={false}` на тяжелых изображениях.
* Медиа-запрос `motion-reduce` отключает анимацию градиента.
* Атрибуты `aria-*` уже включены в компоненты shadcn.
* Для контейнерных запросов и якорного позиционирования не требуется JavaScript → нулевая нагрузка на бандл.

---

## 7. CI / Линтинг

* **eslint-plugin-tailwindcss** — порядок классов и неизвестные токены.
* **shadcn\:sync** — запускайте в CI для обнаружения расхождений.
* **Chromatic** визуальное тестирование для согласованности цветов.

---

## 8. Шпаргалка

| Задача                                | Команда                                   |
| ------------------------------------- | ----------------------------------------- |
| Добавить новый компонент позже        | `pnpm dlx shadcn-ui@latest add carousel` |
| Обновить все примитивы shadcn         | `pnpm dlx shadcn-ui@latest upgrade`      |
| Форматирование и линтинг              | `pnpm format && pnpm lint`               |
| Синхронизировать токены после редактирования Tailwind | `pnpm run shadcn:sync`   |

---

**Руководство завершено — создавайте элегантные 👌, тактические 🪖, современные ⚡ интерфейсы!**