import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP } from '@app/common/constants/events';
import { getEnvironment } from '@app/common/constants/config';
import { LoggerModule } from '@app/common/helpers/logger.module';
import { HealthCheckService } from './health/health-check.service';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: `./apps/inventory/.env.${getEnvironment()}`,
    }),
    DatabaseModule,
    LoggerModule,
    RmqModule.register({
      name: APP.INVENTORY_SERVICE,
    }),
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, ConfigService, HealthCheckService],
})
export class InventoryModule {
}
