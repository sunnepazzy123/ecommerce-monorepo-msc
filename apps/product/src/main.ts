import { NestFactory } from '@nestjs/core';
import { connectMicroservicesQueues } from '@app/common/utils';
import { ProductModule } from './products.module';
import { Queues } from './constants';


async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  connectMicroservicesQueues(app, Queues);
}
bootstrap();
