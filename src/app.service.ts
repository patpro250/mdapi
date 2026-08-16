import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return ' welcome to Mater Dei Api v1.0.0';
  }
}
