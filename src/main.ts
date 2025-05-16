import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CustomValidationDTO } from './common/pipes/custom-validation.pipe';

async function bootstrap() {
  const environments = process.env;
  const app = await NestFactory.create(AppModule.forRoot(environments), {
    cors: true,
    rawBody: true,
  });

  app.setGlobalPrefix('/api');
  const config = app.get(ConfigService);
  const port = config.get('APP_PORT');

  // TODO: Check
  app.useGlobalPipes(new CustomValidationDTO());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port, () => {
    Logger.log(`API running in ${config.get('NODE_ENV')} mode on port ${port}`, 'API started');
  });
}
bootstrap();
