import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<a style="  font-weight:bold;" href="/api"> Go to the swagger api>></a>';
  }
}
