import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: `./apps/order/.env.${getEnvironment()}`,
    }),
    DatabaseModule,
    LoggerModule,
    RmqModule.register({
      name: APP.ORDER_SERVICE,
    }),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, ConfigService, HealthCheckService],
})
export class OrderModule {
}
