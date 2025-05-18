import { Controller, Post, Body, Logger } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    this.logger.log(`Received booking request: ${JSON.stringify(createBookingDto)}`);
    return this.bookingService.createBooking(createBookingDto);
  }
}