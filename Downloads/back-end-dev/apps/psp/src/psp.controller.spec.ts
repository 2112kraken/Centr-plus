import { Test, TestingModule } from '@nestjs/testing';

import { PspController } from './psp.controller';
import { PspService } from './psp.service';

describe('PspController', () => {
  let pspController: PspController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PspController],
      providers: [PspService],
    }).compile();

    pspController = app.get<PspController>(PspController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pspController.getHello()).toBe('Hello World!');
    });
  });
});
