import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [" 'self' "],
        scriptSrc: [" 'self' "],
        styleSrc: [" 'self' "],
      }
    }
  }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  //my adding for cors
  app.enableCors({
    origin:'http://localhost:3000',
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"]
  });
  
/*
  app.setGlobalPrefix('api/v1');

  //Enable Swagger Docs
  const config = new DocumentBuilder()
  .setTitle('API Documentation (Nest)')
  .setDescription('API documentation for the application')
  .setVersion('1.0')
  .addTag('auth', 'Authentication related endpoints')
  .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT auth',
  )

  .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Refresh-JWT',
      description: 'Enter refresh JWT token',
      in: 'header',
    },
    'JWT-refresh',
  )
  .addServer('http://localhost:3001', 'Development Server')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
    .swagger-ui .topbar {display: none}
    .swagger-ui .info {margin: 50px 0;}
    .swagger-ui .info .title {color: #3e1cbb;}
    `
  })
 
*/
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
