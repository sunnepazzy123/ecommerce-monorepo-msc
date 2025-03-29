import { NestFactory } from '@nestjs/core';
import { connectMicroservicesQueues } from '@app/common/utils';
import { Queues } from './constants';
import { InventoryModule } from './inventory.module';


async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  connectMicroservicesQueues(app, Queues);
}
bootstrap();
