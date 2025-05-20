import { Module } from '@nestjs/common';
import { BookingModule } from './booking/booking.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [BookingModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}