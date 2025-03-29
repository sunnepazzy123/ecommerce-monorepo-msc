
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';
import { GptController } from './gpt.controller';

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
    LoggerModule
  ],
  controllers: [GptController],
  providers: [ConfigService, HealthCheckService],
})
export class GptModule { 
}
