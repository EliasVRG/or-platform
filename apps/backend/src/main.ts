import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global API Prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  if (configService.get('SWAGGER_ENABLED') !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('OR Platform API')
      .setDescription('API de Gestão de Cursos e Matrículas')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('APP_PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`✅ Application running on http://localhost:${port}`);
  console.log(`📚 Swagger available on http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});
