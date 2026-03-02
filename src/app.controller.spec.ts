import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

 describe('root', () => {
    it('should return a link to the Swagger API', () => { 
      expect(appController.getHello()).toBe('<a style="  font-weight:bold;" href="/api"> Go to the swagger api>></a>');
    });
  });
});
