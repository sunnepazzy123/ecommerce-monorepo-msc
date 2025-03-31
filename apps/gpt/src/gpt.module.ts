
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

const serviceAppNames = [
  APP.NOTIFICATION_SERVICE,
  APP.PRODUCT_SERVICE,
  APP.INVENTORY_SERVICE,
  APP.ORDER_SERVICE,

  // Add more services here as needed
];

const createRmqModules = (moduleNames: string[]) => {
  return moduleNames.map((serviceName) => RmqModule.register({name: serviceName}));
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
      }),
      envFilePath: `./apps/gpt/.env.${getEnvironment()}`,
    }),
    RmqModule.register({
      name: APP.GPT_SERVICE,
    }),
    ...createRmqModules(serviceAppNames),
    LoggerModule
  ],
  controllers: [GptController],
  providers: [GptService, ConfigService, HealthCheckService],
})
export class GptModule { 
}
