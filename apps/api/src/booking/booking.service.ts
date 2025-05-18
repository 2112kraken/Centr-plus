import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  // Заглушка для сервиса бронирования
  createBooking(createBookingDto: CreateBookingDto) {
    // В будущем здесь будет логика сохранения бронирования в базу данных
    console.log('Received booking data:', createBookingDto);
    return { success: true };
  }
}