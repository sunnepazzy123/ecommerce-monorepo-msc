import { NestFactory } from '@nestjs/core';
import { connectMicroservicesQueues } from '@app/common/utils';
import { Queues } from './constants';
import { OrderModule } from './order.module';


async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  connectMicroservicesQueues(app, Queues);
}
bootstrap();
