import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ВАЖНО: setGlobalPrefix ДО listen!
  console.log('Setting global prefix to: /api');
  app.setGlobalPrefix('api');

  // CORS настройки
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://hush.local:8443',
      'http://hush.local:8080',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`✅ API is available at http://localhost:${port}/api`);
}
bootstrap();
