import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Схема валидации для входных данных процедуры создания бронирования
export const createBookingSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  phone: z.string().min(10, "Некорректный номер телефона").max(20),
  date: z.string().min(1, "Дата обязательна"),
  rangeId: z.string().min(1, "Выбор дистанции обязателен"),
  // Дополнительные поля из формы
  time: z.string().min(1, "Время обязательно"),
  duration: z.number().min(1).max(8),
  comment: z.string().optional(),
});

export const bookingRouter = createTRPCRouter({
  create: publicProcedure
    .input(createBookingSchema)
    .mutation(async ({ input }) => {
      // Логируем входные данные
      console.log("Получены данные бронирования:", input);
      
      // Здесь будет логика сохранения данных в базу
      // На данный момент просто возвращаем успешный результат
      
      return {
        success: true,
      };
    }),
});