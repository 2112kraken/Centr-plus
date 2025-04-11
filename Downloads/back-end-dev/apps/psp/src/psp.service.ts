import { Injectable } from '@nestjs/common';

@Injectable()
export class PspService {
  getHello(): string {
    return 'Hello World!';
  }
}
