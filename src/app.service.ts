import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService
  ) {}
  
  getHello(): string {
    return 'Hello NestJS! This is a framework of Nodejs and then first lesson';
  }

  getAppConfig() {
    const port = this.configService.get<string>('PORT');
    const database = this.configService.get<string>('DB_DATABASE');
    
    console.log('PORT:', port);
    console.log('DB_DATABASE:', database);

    return {
      port,
      database,
    };
  }
}
