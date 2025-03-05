import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import proto types
import '../src/shared/prototypes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ allowedHeaders: '*', origin: '*' });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
