import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Logger } from '@nestjs/common';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: {
            createBooking: jest.fn().mockReturnValue({ success: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
    
    // Мокаем Logger, чтобы не засорять вывод тестов
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('вызывает bookingService.createBooking и возвращает {success: true}', () => {
      const createBookingDto: CreateBookingDto = {
        name: 'Тест Тестович',
        email: 'test@example.com',
        phone: '+380991234567',
        date: new Date('2025-06-01T10:00:00Z'),
        rangeId: 'range-1',
      };

      const result = controller.create(createBookingDto);

      // Проверяем, что сервис был вызван с правильными параметрами
      expect(service.createBooking).toHaveBeenCalledWith(createBookingDto);
      
      // Проверяем, что результат соответствует ожидаемому
      expect(result).toEqual({ success: true });
    });
  });
});