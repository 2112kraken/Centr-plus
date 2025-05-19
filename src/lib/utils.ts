import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения классов Tailwind CSS
 * Использует clsx и tailwind-merge для правильного объединения классов
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}