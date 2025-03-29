import { NestFactory } from '@nestjs/core';
import { connectMicroservicesQueues } from '@app/common/utils';
import { Queues } from './constants';
import { GptModule } from './gpt.module';


async function bootstrap() {
  const app = await NestFactory.create(GptModule);
  connectMicroservicesQueues(app, Queues);
}
bootstrap();
