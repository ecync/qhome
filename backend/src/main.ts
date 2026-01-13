import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: "ws://158.101.98.79:9001/mqtt",
      protocol: 'ws',
    }
  })
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen( process.env.PORT || 3000 );
}
bootstrap();
